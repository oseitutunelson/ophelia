'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChartCard, BarChartCard } from '@/components/admin/area-chart';

interface AnalyticsPoint {
  date: string; users: number; blogs: number; enrollments: number; revenue: number;
  [key: string]: number | string;
}

const PERIODS = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/admin/analytics?days=${days}`)
      .then(r => setData(r.data.data))
      .finally(() => setLoading(false));
  }, [days]);

  const totalUsers = data.reduce((s, d) => s + d.users, 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalEnrollments = data.reduce((s, d) => s + d.enrollments, 0);
  const totalBlogs = data.reduce((s, d) => s + d.blogs, 0);

  return (
    <div className='p-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-[22px] font-bold text-[#0f0f14]'>Analytics</h1>
          <p className='text-[13px] text-[#6b6b7b] mt-0.5'>Platform activity and growth metrics</p>
        </div>
        <div className='flex gap-1 p-1 bg-white border border-[#e8e8ec] rounded-lg'>
          {PERIODS.map(p => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${days === p.days ? 'bg-[#0f0f14] text-white' : 'text-[#6b6b7b] hover:text-[#0f0f14]'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {[
          { label: 'New Users', value: totalUsers, color: '#c9a96e' },
          { label: 'Ad Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#10b981' },
          { label: 'Enrollments', value: totalEnrollments, color: '#6366f1' },
          { label: 'Blog Posts', value: totalBlogs, color: '#ec4899' },
        ].map(s => (
          <div key={s.label} className='bg-white border border-[#e8e8ec] rounded-xl p-4'>
            <p className='text-[12px] text-[#9898a8] mb-1'>{s.label} ({days}d)</p>
            <p className='text-[20px] font-bold' style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {[1,2,3,4].map(i=><div key={i} className='h-56 bg-[#f4f4f8] rounded-xl animate-pulse'/>)}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
            <AreaChartCard title='New User Signups' data={data} dataKey='users' color='#c9a96e' />
            <AreaChartCard title='Ad Revenue' data={data} dataKey='revenue' color='#10b981' formatValue={v => `$${v}`} />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
            <AreaChartCard title='Course Enrollments' data={data} dataKey='enrollments' color='#6366f1' />
            <AreaChartCard title='Blog Posts Published' data={data} dataKey='blogs' color='#ec4899' />
          </div>
          <BarChartCard
            title='Platform Activity Overview'
            data={data}
            bars={[
              { key: 'users', color: '#c9a96e', label: 'New Users' },
              { key: 'enrollments', color: '#6366f1', label: 'Enrollments' },
              { key: 'blogs', color: '#ec4899', label: 'Blog Posts' },
            ]}
            height={220}
          />
        </>
      )}
    </div>
  );
}
