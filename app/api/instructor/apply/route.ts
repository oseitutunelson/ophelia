import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const existing = await db.instructorApplication.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: 'Application already submitted.', status: existing.status });
    }

    const { fullName, bio, expertise, experience, portfolioUrl, sampleLessonUrl } =
      await req.json() as {
        fullName: string;
        bio: string;
        expertise: string[];
        experience: string;
        portfolioUrl?: string;
        sampleLessonUrl?: string;
      };

    if (!fullName || !bio || !experience || !expertise?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const application = await db.instructorApplication.create({
      data: { userId, fullName, bio, expertise, experience, portfolioUrl, sampleLessonUrl },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    console.error('[INSTRUCTOR_APPLY]', err);
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const application = await db.instructorApplication.findUnique({ where: { userId } });
    return NextResponse.json(application ?? null);
  } catch (err) {
    console.error('[INSTRUCTOR_APPLY_GET]', err);
    return NextResponse.json(null);
  }
}
