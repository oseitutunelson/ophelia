'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import StatCard from '@/components/admin/stat-card';
import { AreaChartCard } from '@/components/admin/area-chart';
import {
  Users, BookOpen, Newspaper, Image, Megaphone, GraduationCap,
  DollarSign, TrendingUp, CreditCard, Clock, CheckCircle, AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  totalUsers: number; newProfilesToday: number; totalBlogPosts: number;
  totalWorks: number; totalCourses: number; totalEnrollments: number;
  pendingInstructorApps: number; totalAdCampaigns: number; activeAdCampaigns: number;
  totalRevenue: number; monthlyRevenue: number; proMembers: number; agencyMembers: number;
  recentAudit: { id: string; action: string; target?: string; createdAt: string }[];
}

interface ChartPoint { date: string; users: number; revenue: number; enrollments: number; blogs: number; [key: string]: number | string }

const ACTION_LABELS: Record<string, string> = {
  APPROVE_INSTRUCTOR: 'Approved instructor', REJECT_INSTRUCTOR: 'Rejected instructor',
  BAN_USER: 'Banned user', UNBAN_USER: 'Unbanned user', DELETE_USER: 'Deleted user',
  UPGRADE_PRO: 'Upgraded to Pro', DOWNGRADE_PRO: 'Downgraded Pro',
  FEATURE_COURSE: 'Featured course', UNPUBLISH_COURSE: 'Unpublished course',
  DELETE_COURSE: 'Deleted course', FEATURE_BLOG: 'Featured blog post',
  APPROVE_AD: 'Approved advertisement', PAUSE_AD: 'Paused advertisement',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/analytics?days=30'),
    ]).then(([s, a]) => {
      setStats(s.data);
      setChartData(a.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='p-8'>
        <div className='h-8 w-48 bg-[#e8e8ec] rounded animate-pulse mb-8' />
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className='h-24 bg-[#e8e8ec] rounded-xl animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-[22px] font-bold text-[#0f0f14]'>Platform Overview</h1>
          <p className='text-[13px] text-[#6b6b7b] mt-0.5'>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {stats.pendingInstructorApps > 0 && (
          <Link href='/admin/instructors' className='flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-[13px] font-medium hover:bg-amber-100 transition-colors'>
            <AlertCircle className='h-4 w-4' />
            {stats.pendingInstructorApps} pending instructor {stats.pendingInstructorApps === 1 ? 'application' : 'applications'}
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
        <StatCard label='Total Users' value={stats.totalUsers.toLocaleString()} change={undefined} sub={`+${stats.newProfilesToday} today`} icon={<Users className='h-5 w-5' />} />
        <StatCard label='Pro Members' value={stats.proMembers.toLocaleString()} icon={<CreditCard className='h-5 w-5' />} accent='#7c3aed' />
        <StatCard label='Agency Pro' value={stats.agencyMembers.toLocaleString()} icon={<TrendingUp className='h-5 w-5' />} accent='#0ea5e9' />
        <StatCard label='Pending Instructors' value={stats.pendingInstructorApps} icon={<GraduationCap className='h-5 w-5' />} accent='#f59e0b' />
        <StatCard label='Published Courses' value={stats.totalCourses.toLocaleString()} sub={`${stats.totalEnrollments} enrollments`} icon={<BookOpen className='h-5 w-5' />} accent='#10b981' />
        <StatCard label='Blog Posts' value={stats.totalBlogPosts.toLocaleString()} icon={<Newspaper className='h-5 w-5' />} accent='#6366f1' />
        <StatCard label='Design Posts' value={stats.totalWorks.toLocaleString()} icon={<Image className='h-5 w-5' />} accent='#ec4899' />
        <StatCard label='Active Ads' value={stats.activeAdCampaigns} sub={`${stats.totalAdCampaigns} total`} icon={<Megaphone className='h-5 w-5' />} accent='#ef4444' />
        <StatCard label='Total Ad Revenue' value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub={`$${stats.monthlyRevenue.toFixed(2)} this month`} icon={<DollarSign className='h-5 w-5' />} accent='#10b981' />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8'>
        <AreaChartCard title='New Users (30 days)' data={chartData} dataKey='users' color='#c9a96e' />
        <AreaChartCard title='Ad Revenue (30 days)' data={chartData} dataKey='revenue' color='#10b981' formatValue={v => `$${v}`} />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8'>
        <AreaChartCard title='Course Enrollments (30 days)' data={chartData} dataKey='enrollments' color='#6366f1' />
        <AreaChartCard title='Blog Posts Published (30 days)' data={chartData} dataKey='blogs' color='#ec4899' />
      </div>

      {/* Recent audit log */}
      {stats.recentAudit.length > 0 && (
        <div className='bg-white border border-[#e8e8ec] rounded-xl p-5'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-[13px] font-semibold text-[#0f0f14]'>Recent Activity</p>
            <Link href='/admin/audit' className='text-[12px] text-[#c9a96e] hover:underline'>View all</Link>
          </div>
          <div className='space-y-3'>
            {stats.recentAudit.map(log => (
              <div key={log.id} className='flex items-center gap-3'>
                <div className='w-7 h-7 rounded-full bg-[#c9a96e]/10 flex items-center justify-center flex-shrink-0'>
                  <CheckCircle className='h-3.5 w-3.5 text-[#c9a96e]' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-[13px] text-[#0f0f14]'>{ACTION_LABELS[log.action] ?? log.action}</p>
                  {log.target && <p className='text-[11px] text-[#9898a8] truncate'>Target: {log.target}</p>}
                </div>
                <p className='text-[11px] text-[#9898a8] flex-shrink-0 flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
