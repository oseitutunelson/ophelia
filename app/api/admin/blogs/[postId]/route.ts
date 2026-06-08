import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, logAdminAction } from '@/lib/admin';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { postId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action } = await req.json() as { action: string };

  switch (action) {
    case 'feature':
      await db.blogPost.update({ where: { id: params.postId }, data: { featured: true } });
      await logAdminAction(adminId, 'FEATURE_BLOG', params.postId);
      break;
    case 'unfeature':
      await db.blogPost.update({ where: { id: params.postId }, data: { featured: false } });
      break;
    case 'unpublish':
      await db.blogPost.update({ where: { id: params.postId }, data: { status: 'draft' } });
      await logAdminAction(adminId, 'UNPUBLISH_BLOG', params.postId);
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db.blogPost.delete({ where: { id: params.postId } });
  await logAdminAction(adminId, 'DELETE_BLOG', params.postId);
  return NextResponse.json({ success: true });
}
