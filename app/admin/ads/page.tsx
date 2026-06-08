'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Megaphone, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Campaign {
  id: string; userId: string; type: string; contentTitle: string; status: string;
  duration: number; price: number; impressions: number; clicks: number;
  paymentStatus: string; createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending_payment: 'bg-[#f4f4f8] text-[#6b6b7b]',
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border border-amber-200',
  expired: 'bg-red-50 text-red-700 border border-red-200',
};

const TABS = ['all', 'active', 'pending_payment', 'paused', 'expired'];
const TAB_LABELS: Record<string, string> = { all: 'All', active: 'Active', pending_payment: 'Pending', paused: 'Paused', expired: 'Expired/Rejected' };

export default function AdminAdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');

  const fetch = useCallback(async (t: string) => {
    setLoading(true);
    const status = t === 'all' ? '' : t;
    const res = await axios.get(`/api/admin/ads?status=${status}`);
    setCampaigns(res.data.campaigns);
    setTotal(res.data.total);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(tab); }, [tab, fetch]);

  async function act(campaignId: string, action: string) {
    setActing(campaignId + action);
    try {
      await axios.patch(`/api/admin/ads/${campaignId}`, { action });
      fetch(tab);
    } catch { alert('Failed'); } finally { setActing(''); }
  }

  const totalRevenue = campaigns.filter(c => c.paymentStatus === 'paid').reduce((s, c) => s + c.price, 0);

  return (
    <div className='p-8'>
      <div className='flex items-start justify-between mb-6'>
        <div>
          <h1 className='text-[22px] font-bold text-[#0f0f14]'>Advertisement Management</h1>
          <p className='text-[13px] text-[#6b6b7b] mt-0.5'>{total.toLocaleString()} campaigns · ${totalRevenue.toFixed(2)} total revenue</p>
        </div>
      </div>
      <div className='flex gap-1 mb-6 border-b border-[#e8e8ec]'>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#c9a96e] text-[#0f0f14]' : 'border-transparent text-[#6b6b7b] hover:text-[#0f0f14]'}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
      {loading ? (
        <div className='space-y-2'>{[1,2,3].map(i=><div key={i} className='h-16 bg-[#f4f4f8] rounded-xl animate-pulse'/>)}</div>
      ) : campaigns.length === 0 ? (
        <div className='text-center py-20 text-[#9898a8]'><Megaphone className='h-10 w-10 mx-auto mb-3 opacity-40'/><p>No campaigns found</p></div>
      ) : (
        <div className='bg-white border border-[#e8e8ec] rounded-xl overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-[#f0f0f4]'>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>CAMPAIGN</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>TYPE</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden md:table-cell'>PRICE</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3 hidden lg:table-cell'>IMPRESSIONS</th>
                <th className='text-left text-[11px] font-semibold text-[#9898a8] px-4 py-3'>STATUS</th>
                <th className='text-right text-[11px] font-semibold text-[#9898a8] px-4 py-3'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id} className='border-b border-[#f8f8fa] last:border-0 hover:bg-[#fafafa]'>
                  <td className='px-4 py-3'>
                    <p className='text-[13px] font-medium text-[#0f0f14] line-clamp-1'>{c.contentTitle}</p>
                    <p className='text-[11px] text-[#9898a8]'>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</p>
                  </td>
                  <td className='px-4 py-3 hidden md:table-cell'><span className='text-[12px] text-[#6b6b7b] capitalize'>{c.type}</span></td>
                  <td className='px-4 py-3 hidden md:table-cell'><span className='text-[12px] font-medium text-[#0f0f14]'>${c.price}</span></td>
                  <td className='px-4 py-3 hidden lg:table-cell'><span className='text-[12px] text-[#6b6b7b]'>{c.impressions.toLocaleString()}</span></td>
                  <td className='px-4 py-3'>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status] ?? 'bg-[#f4f4f8] text-[#6b6b7b]'}`}>{c.status.replace('_', ' ')}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-1'>
                      {c.status !== 'active' && (
                        <button onClick={() => act(c.id, 'approve')} disabled={!!acting} title='Approve' className='p-1.5 rounded-lg hover:bg-emerald-50 text-[#9898a8] hover:text-emerald-600 transition-colors'>
                          <CheckCircle className='h-4 w-4'/>
                        </button>
                      )}
                      {c.status === 'active' && (
                        <button onClick={() => act(c.id, 'pause')} disabled={!!acting} title='Pause' className='p-1.5 rounded-lg hover:bg-amber-50 text-[#9898a8] hover:text-amber-600 transition-colors'>
                          <PauseCircle className='h-4 w-4'/>
                        </button>
                      )}
                      {c.status !== 'expired' && (
                        <button onClick={() => act(c.id, 'reject')} disabled={!!acting} title='Reject/Expire' className='p-1.5 rounded-lg hover:bg-red-50 text-[#9898a8] hover:text-red-600 transition-colors'>
                          <XCircle className='h-4 w-4'/>
                        </button>
                      )}
                    </div>
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
