import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs';

import db from '@/lib/db';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

async function setClerkPro(userId: string, isPro: boolean, isAgencyPro = false) {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        isPro,
        isAgencyPro,
        proSince: isPro ? new Date().toISOString() : null
      }
    });
  } catch (err) {
    console.error('[STRIPE_WEBHOOK] Clerk metadata update failed', err);
  }
}

export async function POST(req: Request) {
  const body      = await req.text();
  const signature = headers().get('stripe-signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[STRIPE_WEBHOOK] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.userId;
        const plan    = (session.metadata?.plan ?? 'individual') as 'individual' | 'agency';
        const subId   = typeof session.subscription === 'string' ? session.subscription : null;

        if (userId) {
          await setClerkPro(userId, true, plan === 'agency');
          // DB write (cast until prisma generate runs on deploy)
          await (db.profile as any).updateMany({
            where: { userId },
            data:  { isPro: true, isAgencyPro: plan === 'agency', stripeSubscriptionId: subId }
          }).catch(() => {});
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub    = event.data.object as Stripe.Subscription;
        const plan   = (sub.metadata?.plan ?? 'individual') as 'individual' | 'agency';
        if (sub.status === 'active') {
          // Look up userId via stripeSubscriptionId in DB (best-effort)
          const profile: any = await (db.profile as any).findFirst({ where: { stripeSubscriptionId: sub.id } }).catch(() => null);
          if (profile?.userId) await setClerkPro(profile.userId, true, plan === 'agency');
          await (db.profile as any).updateMany({
            where: { stripeSubscriptionId: sub.id },
            data:  { isPro: true, isAgencyPro: plan === 'agency' }
          }).catch(() => {});
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub     = event.data.object as Stripe.Subscription;
        const profile: any = await (db.profile as any).findFirst({ where: { stripeSubscriptionId: sub.id } }).catch(() => null);
        if (profile?.userId) await setClerkPro(profile.userId, false, false);
        await (db.profile as any).updateMany({
          where: { stripeSubscriptionId: sub.id },
          data:  { isPro: false, isAgencyPro: false, stripeSubscriptionId: null }
        }).catch(() => {});
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[STRIPE_WEBHOOK]', err);
    return NextResponse.json({ error: 'Webhook handler error.' }, { status: 500 });
  }
}
