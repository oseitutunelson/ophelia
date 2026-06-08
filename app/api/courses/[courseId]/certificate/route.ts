import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

type Params = { params: { courseId: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const cert = await db.certificate.findFirst({
      where: { userId, courseId: params.courseId },
    });

    if (!cert) return NextResponse.json({ error: 'Certificate not found.' }, { status: 404 });
    return NextResponse.json(cert);
  } catch (err) {
    console.error('[CERTIFICATE_GET]', err);
    return NextResponse.json({ error: 'Failed.' }, { status: 500 });
  }
}
