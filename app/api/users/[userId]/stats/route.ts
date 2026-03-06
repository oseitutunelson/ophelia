import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    const targetUserId = params.userId;
    console.log('Stats request:', { currentUserId, targetUserId });

    // Get follower and following counts
    const [followerCount, followingCount] = await Promise.all([
      db.follow.count({
        where: { followingId: targetUserId }
      }),
      db.follow.count({
        where: { followerId: targetUserId }
      })
    ]);

    // Get total likes across all works
    const totalLikes = await db.like.count({
      where: {
        work: {
          userId: targetUserId
        }
      }
    });

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== targetUserId) {
      const follow = await db.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      success: true,
      stats: {
        followers: followerCount,
        following: followingCount,
        likes: totalLikes
      },
      isFollowing
    });
  } catch (error) {
    console.error('Error fetching follow stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}