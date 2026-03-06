import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { talentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const { talentId } = params;

    const bookmark = await db.profileBookmark.findUnique({
      where: {
        userId_talentId: {
          userId,
          talentId
        }
      }
    });

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    await db.profileBookmark.delete({
      where: {
        userId_talentId: {
          userId,
          talentId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Bookmark deleted'
    });
  } catch (error: any) {
    console.error('Failed to delete bookmark:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { talentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const { talentId } = params;

    const bookmark = await db.profileBookmark.findUnique({
      where: {
        userId_talentId: {
          userId,
          talentId
        }
      }
    });

    return NextResponse.json({
      success: true,
      isBookmarked: !!bookmark
    });
  } catch (error: any) {
    console.error('Failed to check bookmark:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check bookmark' },
      { status: 500 }
    );
  }
}
