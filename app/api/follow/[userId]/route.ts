import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const targetUserId = params.userId;
    console.log('Follow request:', { currentUserId: userId, targetUserId });

    if (userId === targetUserId) {
      return NextResponse.json(
        { success: false, message: "You can't follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId
        }
      }
    });

    if (existingFollow) {
      console.log('User already following');
      return NextResponse.json(
        { success: false, message: 'Already following this user' },
        { status: 400 }
      );
    }

    // Create follow relationship
    const follow = await db.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId
      }
    });

    return NextResponse.json({
      success: true,
      follow
    });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const targetUserId = params.userId;

    // Delete follow relationship
    const follow = await db.follow.deleteMany({
      where: {
        followerId: userId,
        followingId: targetUserId
      }
    });

    return NextResponse.json({
      success: true,
      deleted: follow.count > 0
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}