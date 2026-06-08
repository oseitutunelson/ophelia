import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, logAdminAction } from '@/lib/admin';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { campaignId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action } = await req.json() as { action: string };

  switch (action) {
    case 'approve':
      await db.adCampaign.update({ where: { id: params.campaignId }, data: { status: 'active' } });
      await logAdminAction(adminId, 'APPROVE_AD', params.campaignId);
      break;
    case 'pause':
      await db.adCampaign.update({ where: { id: params.campaignId }, data: { status: 'paused' } });
      await logAdminAction(adminId, 'PAUSE_AD', params.campaignId);
      break;
    case 'reject':
      await db.adCampaign.update({ where: { id: params.campaignId }, data: { status: 'expired' } });
      await logAdminAction(adminId, 'REJECT_AD', params.campaignId);
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
