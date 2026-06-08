import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import db from '@/lib/db';
import { clerkClient } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalProfiles,
    newProfilesToday,
    totalBlogPosts,
    totalWorks,
    totalCourses,
    totalEnrollments,
    pendingInstructorApps,
    totalAdCampaigns,
    activeAdCampaigns,
    adRevenue,
    proMembers,
    agencyMembers,
    recentAudit,
  ] = await Promise.all([
    db.profile.count(),
    db.profile.count({ where: { createdAt: { gte: startOfToday } } }),
    db.blogPost.count({ where: { status: 'published' } }),
    db.work.count(),
    db.course.count({ where: { isPublished: true } }),
    db.enrollment.count(),
    db.instructorApplication.count({ where: { status: 'pending' } }),
    db.adCampaign.count(),
    db.adCampaign.count({ where: { status: 'active' } }),
    db.adCampaign.findMany({
      where: { paymentStatus: 'paid' },
      select: { price: true },
    }),
    db.profile.count({ where: { isPro: true } }),
    db.profile.count({ where: { isAgencyPro: true } }),
    db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  let totalUsers = totalProfiles;
  try {
    totalUsers = await clerkClient.users.getCount();
  } catch { /* fallback to profiles count */ }

  const totalAdRev = adRevenue.reduce((sum, c) => sum + c.price, 0);

  // Revenue this month: ad campaigns paid this month
  const adsThisMonth = await db.adCampaign.findMany({
    where: { paymentStatus: 'paid', createdAt: { gte: startOfMonth } },
    select: { price: true },
  });
  const monthlyAdRev = adsThisMonth.reduce((sum, c) => sum + c.price, 0);

  return NextResponse.json({
    totalUsers,
    newProfilesToday,
    totalBlogPosts,
    totalWorks,
    totalCourses,
    totalEnrollments,
    pendingInstructorApps,
    totalAdCampaigns,
    activeAdCampaigns,
    totalRevenue: totalAdRev,
    monthlyRevenue: monthlyAdRev,
    proMembers,
    agencyMembers,
    recentAudit,
  });
}
