import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const campaign = await db.adCampaign.findUnique({ where: { id: params.id } });
    if (!campaign) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (campaign.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('[CAMPAIGN_GET]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const campaign = await db.adCampaign.findUnique({ where: { id: params.id } });
    if (!campaign) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (campaign.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    const body = await req.json();
    const { status } = body;

    // Only allow pausing and resuming active/paused campaigns
    if (status && !['paused', 'active'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status transition.' }, { status: 400 });
    }

    const updated = await db.adCampaign.update({
      where: { id: params.id },
      data: { ...(status && { status }) },
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('[CAMPAIGN_PATCH]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const campaign = await db.adCampaign.findUnique({ where: { id: params.id } });
    if (!campaign) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (campaign.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    // Only allow deleting expired or pending_payment campaigns
    if (!['expired', 'pending_payment'].includes(campaign.status)) {
      return NextResponse.json({ error: 'Cannot delete an active or paused campaign.' }, { status: 400 });
    }

    await db.adCampaign.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CAMPAIGN_DELETE]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
