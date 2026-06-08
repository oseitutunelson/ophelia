import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import db from '@/lib/db';
import { clerkClient } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'pro'; // 'pro' | 'agency'

  const profiles = await db.profile.findMany({
    where: type === 'agency' ? { isAgencyPro: true } : { isPro: true },
    select: { userId: true, isPro: true, isAgencyPro: true, proExpiresAt: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const userIds = profiles.map(p => p.userId);
  let clerkUsers: { id: string; name: string; email: string; imageUrl: string }[] = [];

  if (userIds.length > 0) {
    const users = await clerkClient.users.getUserList({ userId: userIds, limit: 100 });
    clerkUsers = users.map(u => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Anonymous',
      email: u.emailAddresses[0]?.emailAddress ?? '',
      imageUrl: u.imageUrl,
    }));
  }

  const userMap = new Map(clerkUsers.map(u => [u.id, u]));
  const result = profiles.map(p => ({
    ...p,
    user: userMap.get(p.userId),
  }));

  return NextResponse.json({ subscribers: result, total: result.length });
}
