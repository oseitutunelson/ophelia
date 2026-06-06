import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type');
    const now = new Date();

    // Auto-expire ended campaigns
    await db.adCampaign.updateMany({
      where: { status: 'active', endDate: { lt: now } },
      data: { status: 'expired' },
    });

    const where = {
      status: 'active',
      paymentStatus: 'paid',
      startDate: { lte: now },
      endDate: { gte: now },
      ...(type && { type }),
    };

    const campaigns = await db.adCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 12,
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('[ADS_GET]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
