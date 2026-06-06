import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { campaignId } = await req.json() as { campaignId: string };
    if (!campaignId) return NextResponse.json({ error: 'Missing campaignId.' }, { status: 400 });

    const campaign = await db.adCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    if (campaign.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    if (campaign.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Campaign already paid.' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign — ${campaign.duration} days`,
              description: `Promote "${campaign.contentTitle}" for ${campaign.duration} days`,
            },
            unit_amount: Math.round(campaign.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { campaignId, userId },
      success_url: `${appUrl}/advertise/success?session_id={CHECKOUT_SESSION_ID}&campaign_id=${campaignId}`,
      cancel_url: `${appUrl}/advertise/new`,
    });

    // Store session ID on the campaign
    await db.adCampaign.update({
      where: { id: campaignId },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[CAMPAIGN_STRIPE_CHECKOUT]', err);
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 });
  }
}
