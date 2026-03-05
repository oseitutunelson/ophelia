import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const targetUserId = params.userId;

    // Get followers (users who follow this user)
    const followers = await db.follow.findMany({
      where: { followingId: targetUserId },
      select: { followerId: true }
    });

    const followerIds = followers.map(f => f.followerId);

    // Get user details for followers
    const followerUsers = await Promise.all(
      followerIds.map(async (userId) => {
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
      users: followerUsers
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch followers' },
      { status: 500 }
    );
  }
}