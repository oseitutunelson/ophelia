import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, logAdminAction } from '@/lib/admin';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { applicationId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status, reviewNote } = await req.json() as { status: string; reviewNote?: string };

  if (!['approved', 'rejected', 'under_review'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const app = await db.instructorApplication.findUnique({ where: { id: params.applicationId } });
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.instructorApplication.update({
    where: { id: params.applicationId },
    data: { status, reviewNote },
  });

  // If approved, create Instructor record (if not already exists)
  if (status === 'approved') {
    const existing = await db.instructor.findUnique({ where: { userId: app.userId } });
    if (!existing) {
      await db.instructor.create({
        data: {
          userId: app.userId,
          bio: app.bio,
          expertise: app.expertise,
          website: app.portfolioUrl,
          isVerified: false,
        },
      });
    }
  }

  await logAdminAction(
    adminId,
    status === 'approved' ? 'APPROVE_INSTRUCTOR' : status === 'rejected' ? 'REJECT_INSTRUCTOR' : 'REVIEW_INSTRUCTOR',
    app.userId,
    reviewNote
  );

  return NextResponse.json({ success: true });
}
