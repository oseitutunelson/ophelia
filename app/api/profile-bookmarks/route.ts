import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const bookmarks = await db.profileBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Get all bookmarked profiles with their works
    const talents = await Promise.all(
      bookmarks.map(async bookmark => {
        const profile = await db.profile.findUnique({
          where: { userId: bookmark.talentId }
        });

        if (!profile) return null;

        const works = await db.work.findMany({
          where: { userId: bookmark.talentId },
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            category: true,
            createdAt: true
          },
          take: 3
        });

        return {
          ...profile,
          profilePicture: profile.profilePicture,
          works,
          bookmarkedAt: bookmark.createdAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      talents: talents.filter(t => t !== null),
      total: talents.length
    });
  } catch (error: any) {
    console.error('Failed to fetch bookmarks:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { talentId } = body;

    if (!talentId) {
      return NextResponse.json(
        { success: false, error: 'Talent ID is required' },
        { status: 400 }
      );
    }

    if (userId === talentId) {
      return NextResponse.json(
        { success: false, error: 'Cannot bookmark your own profile' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const profile = await db.profile.findUnique({
      where: { userId: talentId }
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if already bookmarked
    const existing = await db.profileBookmark.findUnique({
      where: {
        userId_talentId: {
          userId,
          talentId
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already bookmarked' },
        { status: 400 }
      );
    }

    const bookmark = await db.profileBookmark.create({
      data: {
        userId,
        talentId
      }
    });

    return NextResponse.json({
      success: true,
      bookmark
    });
  } catch (error: any) {
    console.error('Failed to bookmark profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to bookmark profile' },
      { status: 500 }
    );
  }
}
