import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import db from '@/lib/db';
import { paystack } from '@/lib/paystack';

// Base prices in USD
const PLAN_USD: Record<string, number> = {
  individual: 2.59,
  agency:     9.59
};

async function getGhsRate(): Promise<number> {
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
    const data = await res.json();
    const rate = data?.rates?.GHS;
    if (typeof rate === 'number' && rate > 0) return rate;
  } catch {
    // fall through to fallback
  }
  return 15.5; // fallback rate: 1 USD ≈ 15.5 GHS
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { plan } = await req.json() as { plan: 'individual' | 'agency' };
    if (!plan || !PLAN_USD[plan]) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    const user    = await currentUser();
    const profile = await db.profile.findFirst({ where: { userId } });
    if (!profile || !user) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const email  = user.emailAddresses[0]?.emailAddress;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

    // Convert USD → GHS pesewas (1 GHS = 100 pesewas)
    const ghsRate       = await getGhsRate();
    const amountInGhs   = PLAN_USD[plan] * ghsRate;
    const amountPesewas = Math.round(amountInGhs * 100);

    const response = await paystack.post('/transaction/initialize', {
      email,
      amount:       amountPesewas,
      currency:     'GHS',
      // Redirect to a PAGE (not API route) so the session cookie travels with the browser
      callback_url: `${appUrl}/go-pro/success`,
      metadata:     { userId, plan, username: profile.username }
    });

    const data = response.data;

    if (!data?.status) {
      console.error('[PAYSTACK_INITIALIZE] error:', data?.message);
      return NextResponse.json({ error: data?.message ?? 'Failed to initialize payment.' }, { status: 500 });
    }

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (err: any) {
    const msg = err?.response?.data?.message;
    console.error('[PAYSTACK_INITIALIZE]', msg ?? err);
    return NextResponse.json({ error: msg ?? 'Failed to initialize Paystack payment.' }, { status: 500 });
  }
}
