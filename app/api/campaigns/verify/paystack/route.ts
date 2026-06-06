import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { paystack } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { reference, campaignId } = await req.json() as { reference: string; campaignId: string };
    if (!reference || !campaignId) return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });

    const { data: res } = await paystack.get(`/transaction/verify/${reference}`);
    if (!res?.status || res.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
    }

    const campaign = await db.adCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.userId !== userId) {
      return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + campaign.duration * 24 * 60 * 60 * 1000);

    await db.adCampaign.update({
      where: { id: campaignId },
      data: { paymentStatus: 'paid', status: 'active', startDate, endDate, paystackRef: reference },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CAMPAIGN_PAYSTACK_VERIFY]', err);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
