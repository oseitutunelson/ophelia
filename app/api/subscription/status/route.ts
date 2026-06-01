import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ isPro: false, isAgencyPro: false });

    const profile = await db.profile.findFirst({
      where: { userId },
      select: { isPro: true, isAgencyPro: true, proExpiresAt: true }
    });

    // Treat expired subs as free
    if (profile?.proExpiresAt && profile.proExpiresAt < new Date()) {
      return NextResponse.json({ isPro: false, isAgencyPro: false });
    }

    return NextResponse.json({
      isPro:       profile?.isPro       ?? false,
      isAgencyPro: profile?.isAgencyPro ?? false
    });
  } catch (err) {
    console.error('[SUBSCRIPTION_STATUS]', err);
    return NextResponse.json({ isPro: false, isAgencyPro: false });
  }
}
