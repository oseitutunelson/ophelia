import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateCertificateId } from '@/lib/learn-utils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { lessonId, enrollmentId, completed, watchedSeconds } =
      await req.json() as { lessonId: string; enrollmentId: string; completed?: boolean; watchedSeconds?: number };

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: { include: { modules: { include: { lessons: true } } } } },
    });
    if (!enrollment || enrollment.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const progress = await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        enrollmentId,
        completed: completed ?? false,
        completedAt: completed ? new Date() : null,
        watchedSeconds: watchedSeconds ?? 0,
      },
      update: {
        ...(completed !== undefined && { completed, completedAt: completed ? new Date() : null }),
        ...(watchedSeconds !== undefined && { watchedSeconds }),
      },
    });

    // Recalculate enrollment progress
    const allLessons = enrollment.course.modules.flatMap(m => m.lessons);
    const completedCount = await db.lessonProgress.count({
      where: { enrollmentId, completed: true },
    });
    const progressPct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

    let status = 'active';
    if (progressPct === 100) {
      status = 'completed';
      // Issue certificate if not already issued
      if (enrollment.course.hasCertificate) {
        const existing = await db.certificate.findFirst({
          where: { userId, courseId: enrollment.courseId },
        });
        if (!existing) {
          await db.certificate.create({
            data: {
              userId,
              courseId: enrollment.courseId,
              courseTitle: enrollment.course.title,
              instructorName: 'Ophelia Instructor',
              certificateId: generateCertificateId(),
            },
          });
        }
      }
    }

    await db.enrollment.update({
      where: { id: enrollmentId },
      data: { progressPct, status, ...(status === 'completed' && { completedAt: new Date() }) },
    });

    return NextResponse.json({ progress, progressPct });
  } catch (err) {
    console.error('[PROGRESS_PATCH]', err);
    return NextResponse.json({ error: 'Failed to update progress.' }, { status: 500 });
  }
}
