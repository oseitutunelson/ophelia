import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { sessionId, campaignId } = await req.json() as { sessionId: string; campaignId: string };
    if (!sessionId || !campaignId) return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });

    const campaign = await db.adCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.userId !== userId) {
      return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    }

    if (campaign.paymentStatus === 'paid') {
      return NextResponse.json({ success: true, alreadyActive: true });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + campaign.duration * 24 * 60 * 60 * 1000);

    await db.adCampaign.update({
      where: { id: campaignId },
      data: { paymentStatus: 'paid', status: 'active', startDate, endDate },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CAMPAIGN_ACTIVATE]', err);
    return NextResponse.json({ error: 'Activation failed.' }, { status: 500 });
  }
}
