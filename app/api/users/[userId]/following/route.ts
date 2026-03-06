import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const targetUserId = params.userId;

    // Get following (users this user follows)
    const following = await db.follow.findMany({
      where: { followerId: targetUserId },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);

    // Get user details for following
    const followingUsers = await Promise.all(
      followingIds.map(async (userId) => {
        const user = await clerkClient.users.getUser(userId);
        const profile = await db.profile.findFirst({
          where: { userId }
        });
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          username: profile?.username || '',
          bio: profile?.bio
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: followingUsers
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch following' },
      { status: 500 }
    );
  }
}