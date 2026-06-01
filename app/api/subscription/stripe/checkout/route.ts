import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import db from '@/lib/db';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { plan } = await req.json() as { plan: 'individual' | 'agency' };
    if (!plan || !STRIPE_PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    const profile = await db.profile.findFirst({ where: { userId } });
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
    const selectedPlan = STRIPE_PLANS[plan];

    // Re-use existing Stripe customer if available
    let customerId = profile.stripeCustomerId ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId, username: profile.username }
      });
      customerId = customer.id;
      await db.profile.update({ where: { id: profile.id }, data: { stripeCustomerId: customerId } });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
      metadata: { userId, plan },
      success_url: `${appUrl}/go-pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/go-pro`
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[STRIPE_CHECKOUT]', err);
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 });
  }
}
