'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import StatCard from '@/components/admin/stat-card';
import { CreditCard, TrendingUp, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Subscriber {
  userId: string; isPro: boolean; isAgencyPro: boolean; proExpiresAt?: string; createdAt: string;
  user?: { id: string; name: string; email: string; imageUrl: string };
}

export default function AdminSubscriptionsPage() {
  const [type, setType] = useState<'pro' | 'agency'>('pro');
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async (t: string) => {
    setLoading(true);
    const res = await axios.get(`/api/admin/subscriptions?type=${t}`);
    setSubs(res.data.subscribers);
    setTotal(res.data.total);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(type); }, [type, fetch]);

  const monthlyRevenue = total * (type === 'agency' ? 49 : 12);

  return (
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-[22px] font-bold text-[#0f0f14]'>Subscription Management</h1>
        <p className='text-[13px] text-[#6b6b7b] mt-0.5'>Active subscriber overview</p>
      </div>

      <div className='grid grid-cols-3 gap-4 mb-6'>
        <StatCard label='Total Subscribers' value={total} icon={<Users className='h-5 w-5'/>} />
        <StatCard label='Est. Monthly Revenue' value={`$${monthlyRevenue.toLocaleString()}`} icon={<CreditCard className='h-5 w-5'/>} accent='#10b981'/>
        <StatCard label='Plan' value={type === 'agency' ? 'Agency Pro ($49/mo)' : 'Pro ($12/mo)'} icon={<TrendingUp className='h-5 w-5'/>} accent='#7c3aed'/>
      </div>

      <div className='flex gap-1 mb-6 border-b border-[#e8e8ec]'>
        {(['pro', 'agency'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${type === t ? 'border-[#c9a96e] text-[#0f0f14]' : 'border-transparent text-[#6b6b7b] hover:text-[#0f0f14]'}`}>
            {t === 'pro' ? 'Individual Pro' : 'Agency Pro'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='space-y-2'>{[1,2,3].map(i=><div key={i} className='h-16 bg-[#f4f4f8] rounded-xl animate-pulse'/>)}</div>
      ) : subs.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'><CreditCard className='h-10 w-10 mx-auto mb-3 opacity-40'/><p>No {type === 'agency' ? 'Agency Pro' : 'Pro'} subscribers yet</p></div>
      ) : (
        <div className='bg-white border border-[#e8e8ec] rounded-xl overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-[#f0f0f4]'>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>SUBSCRIBER</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>PLAN</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>EXPIRES</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.userId} className='border-b border-[#f8f8fa] last:border-0 hover:bg-[#fafafa]'>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      {s.user?.imageUrl && (
                        <div className='relative w-8 h-8 rounded-full overflow-hidden bg-[#e8e8ec] flex-shrink-0'>
                          <Image src={s.user.imageUrl} alt={s.user.name} fill className='object-cover'/>
                        </div>
                      )}
                      <div>
                        <p className='text-[13px] font-medium text-[#0f0f14]'>{s.user?.name ?? 'Unknown'}</p>
                        <p className='text-[11px] text-[#9898a8]'>{s.user?.email ?? s.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 hidden md:table-cell'>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${s.isAgencyPro ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                      {s.isAgencyPro ? 'Agency Pro' : 'Pro'}
                    </span>
                  </td>
                  <td className='px-4 py-3 hidden md:table-cell'>
                    <p className='text-[12px] text-[#6b6b7b]'>{s.proExpiresAt ? new Date(s.proExpiresAt).toLocaleDateString() : 'N/A'}</p>
                  </td>
                  <td className='px-4 py-3'>
                    <p className='text-[12px] text-[#6b6b7b]'>{formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
