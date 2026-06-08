import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { clerkClient } from '@clerk/nextjs';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = 30;

  const users = await clerkClient.users.getUserList({
    limit,
    offset: (page - 1) * limit,
    query: query || undefined,
    orderBy: '-created_at',
  });

  const totalCount = await clerkClient.users.getCount();

  // Fetch bans for these user IDs
  const userIds = users.map(u => u.id);
  const bans = await db.userBan.findMany({ where: { userId: { in: userIds } } });
  const banMap = new Set(bans.map(b => b.userId));

  // Fetch pro status
  const profiles = await db.profile.findMany({
    where: { userId: { in: userIds } },
    select: { userId: true, isPro: true, isAgencyPro: true },
  });
  const profileMap = new Map(profiles.map(p => [p.userId, p]));

  const result = users.map(u => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Anonymous',
    email: u.emailAddresses[0]?.emailAddress ?? '',
    imageUrl: u.imageUrl,
    createdAt: new Date(u.createdAt).toISOString(),
    isBanned: banMap.has(u.id),
    isPro: profileMap.get(u.id)?.isPro ?? false,
    isAgencyPro: profileMap.get(u.id)?.isAgencyPro ?? false,
  }));

  return NextResponse.json({ users: result, total: totalCount, page });
}
