import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

function buildDateSeries(days: number) {
  const series: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    series.push(d.toISOString().split('T')[0]);
  }
  return series;
}

function groupByDate<T extends { createdAt: Date }>(items: T[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of items) {
    const key = item.createdAt.toISOString().split('T')[0];
    map[key] = (map[key] ?? 0) + 1;
  }
  return map;
}

export async function GET(req: NextRequest) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get('days') ?? '30'), 90);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [profiles, blogPosts, enrollments, adCampaigns] = await Promise.all([
    db.profile.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.blogPost.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.enrollment.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.adCampaign.findMany({
      where: { paymentStatus: 'paid', createdAt: { gte: since } },
      select: { createdAt: true, price: true },
    }),
  ]);

  const series = buildDateSeries(days);
  const profileMap = groupByDate(profiles);
  const blogMap = groupByDate(blogPosts);
  const enrollMap = groupByDate(enrollments);

  const revenueMap: Record<string, number> = {};
  for (const c of adCampaigns) {
    const key = c.createdAt.toISOString().split('T')[0];
    revenueMap[key] = (revenueMap[key] ?? 0) + c.price;
  }

  const labelStep = days > 30 ? Math.ceil(days / 15) : 1;
  const data = series.map((date, i) => ({
    date: i % labelStep === 0 ? date.slice(5) : '',
    fullDate: date,
    users: profileMap[date] ?? 0,
    blogs: blogMap[date] ?? 0,
    enrollments: enrollMap[date] ?? 0,
    revenue: Math.round((revenueMap[date] ?? 0) * 100) / 100,
  }));

  return NextResponse.json({ data });
}
