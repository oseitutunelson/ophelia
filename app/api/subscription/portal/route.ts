import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import db from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const profile = await db.profile.findFirst({ where: { userId } });
    if (!profile?.stripeCustomerId) {
      return NextResponse.json({ error: 'No active Stripe subscription found.' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer:   profile.stripeCustomerId,
      return_url: `${appUrl}/account`
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[STRIPE_PORTAL]', err);
    return NextResponse.json({ error: 'Failed to open billing portal.' }, { status: 500 });
  }
}
