import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { getCampaignPrice } from '@/lib/ad-utils';
import type { AdType } from '@/lib/ad-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const status = req.nextUrl.searchParams.get('status');

    const campaigns = await db.adCampaign.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('[CAMPAIGNS_GET]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const body = await req.json();
    const { type, contentId, contentTitle, contentImage, duration } = body as {
      type: AdType;
      contentId: string;
      contentTitle: string;
      contentImage?: string;
      duration: number;
    };

    if (!type || !contentTitle || !duration) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (![7, 14, 30].includes(duration)) {
      return NextResponse.json({ error: 'Invalid duration.' }, { status: 400 });
    }

    const price = getCampaignPrice(type, duration);
    if (!price) return NextResponse.json({ error: 'Invalid campaign type or duration.' }, { status: 400 });

    const campaign = await db.adCampaign.create({
      data: {
        userId,
        type,
        contentId: contentId || '',
        contentTitle,
        contentImage: contentImage || null,
        duration,
        price,
        status: 'pending_payment',
        paymentStatus: 'pending',
      },
    });

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (error) {
    console.error('[CAMPAIGNS_POST]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
