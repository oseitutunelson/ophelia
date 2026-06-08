import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, logAdminAction } from '@/lib/admin';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action } = await req.json() as { action: string };
  const { courseId } = params;

  switch (action) {
    case 'feature':
      await db.course.update({ where: { id: courseId }, data: { isFeatured: true } });
      await logAdminAction(adminId, 'FEATURE_COURSE', courseId);
      break;
    case 'unfeature':
      await db.course.update({ where: { id: courseId }, data: { isFeatured: false } });
      await logAdminAction(adminId, 'UNFEATURE_COURSE', courseId);
      break;
    case 'unpublish':
      await db.course.update({ where: { id: courseId }, data: { isPublished: false } });
      await logAdminAction(adminId, 'UNPUBLISH_COURSE', courseId);
      break;
    case 'publish':
      await db.course.update({ where: { id: courseId }, data: { isPublished: true } });
      await logAdminAction(adminId, 'PUBLISH_COURSE', courseId);
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db.course.delete({ where: { id: params.courseId } });
  await logAdminAction(adminId, 'DELETE_COURSE', params.courseId);
  return NextResponse.json({ success: true });
}
