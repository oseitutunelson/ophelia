'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from '@/components/admin/stat-card';
import { AreaChartCard } from '@/components/admin/area-chart';
import { DollarSign, TrendingUp, CreditCard, Megaphone, BookOpen } from 'lucide-react';

interface ChartPoint { date: string; revenue: number; [key: string]: number | string }

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<{ totalRevenue: number; monthlyRevenue: number; proMembers: number; agencyMembers: number } | null>(null);
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

  if (loading) return <div className='p-8'><div className='h-8 w-48 bg-[#e8e8ec] rounded animate-pulse mb-8'/><div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>{[1,2,3,4].map(i=><div key={i} className='h-24 bg-[#e8e8ec] rounded-xl animate-pulse'/>)}</div></div>;
  if (!stats) return null;

  const proRevenue = stats.proMembers * 12;
  const agencyRevenue = stats.agencyMembers * 49;

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Revenue Center</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>Platform earnings overview</p>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <StatCard label='Total Ad Revenue' value={`$${stats.totalRevenue.toFixed(2)}`} icon={<DollarSign className='h-5 w-5'/>} accent='#10b981'/>
        <StatCard label='Monthly Ad Revenue' value={`$${stats.monthlyRevenue.toFixed(2)}`} icon={<TrendingUp className='h-5 w-5'/>} accent='#c9a96e'/>
        <StatCard label='Est. Pro Revenue' value={`$${proRevenue.toLocaleString()}`} sub={`${stats.proMembers} subscribers × $12`} icon={<CreditCard className='h-5 w-5'/>} accent='#7c3aed'/>
        <StatCard label='Est. Agency Revenue' value={`$${agencyRevenue.toLocaleString()}`} sub={`${stats.agencyMembers} agencies × $49`} icon={<CreditCard className='h-5 w-5'/>} accent='#0ea5e9'/>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
        <AreaChartCard title='Ad Revenue (30 days)' data={chartData} dataKey='revenue' color='#10b981' formatValue={v=>`$${v}`}/>
        <div className='bg-white border border-[#e8e8ec] rounded-xl p-5'>
          <p className='text-[13px] font-semibold text-[#0f0f14] mb-4'>Revenue Sources</p>
          <div className='space-y-4'>
            {[
              { label: 'Advertisement Campaigns', value: stats.totalRevenue, color: '#c9a96e', icon: <Megaphone className='h-4 w-4'/> },
              { label: 'Pro Subscriptions (est.)', value: proRevenue, color: '#7c3aed', icon: <CreditCard className='h-4 w-4'/> },
              { label: 'Agency Pro (est.)', value: agencyRevenue, color: '#0ea5e9', icon: <TrendingUp className='h-4 w-4'/> },
              { label: 'Course Sales', value: 0, color: '#10b981', icon: <BookOpen className='h-4 w-4'/> },
            ].map(source => {
              const total = stats.totalRevenue + proRevenue + agencyRevenue;
              const pct = total > 0 ? Math.round((source.value / total) * 100) : 0;
              return (
                <div key={source.label}>
                  <div className='flex items-center justify-between mb-1.5'>
                    <div className='flex items-center gap-2'>
                      <span style={{ color: source.color }}>{source.icon}</span>
                      <span className='text-[12px] text-[#6b6b7b]'>{source.label}</span>
                    </div>
                    <div className='text-right'>
                      <span className='text-[13px] font-semibold text-[#0f0f14]'>${source.value.toLocaleString()}</span>
                      <span className='text-[11px] text-[#9898a8] ml-2'>{pct}%</span>
                    </div>
                  </div>
                  <div className='h-1.5 bg-[#f4f4f8] rounded-full overflow-hidden'>
                    <div className='h-full rounded-full transition-all duration-500' style={{ width: `${pct}%`, background: source.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
