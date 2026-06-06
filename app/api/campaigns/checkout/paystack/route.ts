import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { paystack } from '@/lib/paystack';

async function getGhsRate(): Promise<number> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
    const data = await res.json();
    const rate = data?.rates?.GHS;
    if (typeof rate === 'number' && rate > 0) return rate;
  } catch { /* fallback */ }
  return 15.5;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { campaignId } = await req.json() as { campaignId: string };
    if (!campaignId) return NextResponse.json({ error: 'Missing campaignId.' }, { status: 400 });

    const [campaign, user] = await Promise.all([
      db.adCampaign.findUnique({ where: { id: campaignId } }),
      currentUser(),
    ]);

    if (!campaign) return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    if (campaign.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    if (campaign.paymentStatus === 'paid') return NextResponse.json({ error: 'Already paid.' }, { status: 400 });

    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: 'No email found.' }, { status: 400 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
    const ghsRate = await getGhsRate();
    const amountPesewas = Math.round(campaign.price * ghsRate * 100);

    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: amountPesewas,
      currency: 'GHS',
      callback_url: `${appUrl}/advertise/success?campaign_id=${campaignId}`,
      metadata: { campaignId, userId },
    });

    const data = response.data;
    if (!data?.status) {
      return NextResponse.json({ error: data?.message ?? 'Failed to initialize payment.' }, { status: 500 });
    }

    await db.adCampaign.update({
      where: { id: campaignId },
      data: { paystackRef: data.data.reference },
    });

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
    console.error('[CAMPAIGN_PAYSTACK_CHECKOUT]', msg ?? err);
    return NextResponse.json({ error: msg ?? 'Failed to initialize payment.' }, { status: 500 });
  }
}
