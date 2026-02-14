import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { workId: string } }
) {
  try {
    const { userId } = auth();
    const dbAny = db as any;

    const workId = params.workId;

    if (!workId) {
      return NextResponse.json({ success: false, error: 'Work ID required' }, { status: 400 });
    }

    const likesCount = await dbAny.like.count({ where: { workId } });
    const bookmarksCount = await dbAny.bookmark.count({ where: { workId } });

    let isLiked = false;
    let isBookmarked = false;

    if (userId) {
      const like = await dbAny.like.findFirst({ where: { workId, userId } });
      const bookmark = await dbAny.bookmark.findFirst({ where: { workId, userId } });
      isLiked = !!like;
      isBookmarked = !!bookmark;
    }

    return NextResponse.json({ success: true, likesCount, bookmarksCount, isLiked, isBookmarked });
  } catch (error) {
    console.log('[WORK_META_GET]', error);
    let message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
