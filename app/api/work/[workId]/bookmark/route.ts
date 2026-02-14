import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { workId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthenticated' }, { status: 401 });
    }

    const workId = params.workId;
    if (!workId) {
      return NextResponse.json({ success: false, error: 'Work ID required' }, { status: 400 });
    }

    // defensive: ensure Prisma client has the bookmark model (helpful if client wasn't regenerated)
    if (!(db as any).bookmark) {
      console.error('[WORK_BOOKMARK_POST] Prisma client missing `bookmark` model on `db`', Object.keys(db || {}));
      return NextResponse.json({ success: false, error: 'Prisma client missing `bookmark` model. Run `npx prisma generate` and restart the server.' }, { status: 500 });
    }

    // toggle bookmark
    const dbAny = db as any;
    const existing = await dbAny.bookmark.findFirst({ where: { workId, userId } });
    if (existing) {
      await dbAny.bookmark.delete({ where: { id: existing.id } });
    } else {
      await dbAny.bookmark.create({ data: { workId, userId } });
    }

    const bookmarksCount = await dbAny.bookmark.count({ where: { workId } });

    return NextResponse.json({ success: true, bookmarksCount, bookmarked: !existing });
  } catch (error) {
    console.error('[WORK_BOOKMARK_POST]', error);
    // include stack in dev for easier debugging
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? error.stack : undefined;
    return NextResponse.json({ success: false, error: message, stack }, { status: 500 });
  }
}
