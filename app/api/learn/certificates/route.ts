import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json([]);

    const certs = await db.certificate.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    return NextResponse.json(certs);
  } catch (err) {
    console.error('[CERTIFICATES_GET]', err);
    return NextResponse.json([]);
  }
}
