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

    // defensive: ensure Prisma client has the like model (helpful if client wasn't regenerated)
    if (!(db as any).like) {
      console.error('[WORK_LIKE_POST] Prisma client missing `like` model on `db`', Object.keys(db || {}));
      return NextResponse.json({ success: false, error: 'Prisma client missing `like` model. Run `npx prisma generate` and restart the server.' }, { status: 500 });
    }

    // toggle like
    const existing = await (db as any).like.findFirst({ where: { workId, userId } });
    if (existing) {
      await (db as any).like.delete({ where: { id: existing.id } });
    } else {
      await (db as any).like.create({ data: { workId, userId } });
    }

    const likesCount = await (db as any).like.count({ where: { workId } });

    return NextResponse.json({ success: true, likesCount, liked: !existing });
  } catch (error) {
    console.error('[WORK_LIKE_POST]', error);
    // include stack in dev for easier debugging
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? error.stack : undefined;
    return NextResponse.json({ success: false, error: message, stack }, { status: 500 });
  }
}
