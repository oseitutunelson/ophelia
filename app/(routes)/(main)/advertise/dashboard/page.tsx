'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { PlusCircle, TrendingUp, Eye, MousePointer, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';
import AdCampaignCard from '@/components/ad-campaign-card';
import { cn } from '@/lib/utils';

interface AdCampaign {
  id: string;
  type: string;
  contentTitle: string;
  contentImage: string | null;
  status: string;
  duration: number;
  price: number;
  impressions: number;
  clicks: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

const STATUS_TABS = ['all', 'active', 'paused', 'expired', 'pending_payment'] as const;
const STATUS_LABELS: Record<string, string> = {
  all: 'All',
  active: 'Active',
  paused: 'Paused',
  expired: 'Expired',
  pending_payment: 'Awaiting Payment',
};

export default function AdvertiseDashboardPage() {
  const { userId, isLoaded } = useAuth();

  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>('all');

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) { redirect('/sign-in'); return; }

    axios.get('/api/campaigns')
      .then(({ data }) => setCampaigns(data.campaigns || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoaded, userId]);

  const filtered = tab === 'all' ? campaigns : campaigns.filter((c) => c.status === tab);

  const totalImpressions = campaigns.filter((c) => c.status === 'active').reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.filter((c) => c.status === 'active').reduce((s, c) => s + c.clicks, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalSpend = campaigns.filter((c) => c.status !== 'pending_payment').reduce((s, c) => s + c.price, 0);

  const handleUpdate = (id: string, updates: Partial<AdCampaign>) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <main className='bg-[#0d0d0d] min-h-screen pt-24 pb-20 px-5 lg:px-12'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='flex items-end justify-between mb-10'>
          <div>
            <p className='text-[11px] font-bold tracking-widest uppercase text-gold mb-2'>Advertiser Dashboard</p>
            <h1 className='font-display text-4xl text-white'>My Campaigns</h1>
          </div>
          <Link
            href='/advertise/new'
            className='flex items-center gap-2 px-6 py-3 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors'
          >
            <PlusCircle className='w-4 h-4' /> New Campaign
          </Link>
        </div>

        {/* Stats grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
          {[
            { icon: Zap, label: 'Active Campaigns', value: activeCampaigns },
            { icon: Eye, label: 'Total Impressions', value: totalImpressions.toLocaleString() },
            { icon: MousePointer, label: 'Total Clicks', value: totalClicks.toLocaleString() },
            { icon: TrendingUp, label: 'Total Spend', value: `$${totalSpend.toFixed(2)}` },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className='bg-[#111111] border border-[#1e1e1e] p-5'>
                <Icon className='w-5 h-5 text-gold mb-3' />
                <p className='font-display text-2xl text-white'>{stat.value}</p>
                <p className='text-[#3a3a3a] text-xs mt-1'>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Status tabs */}
        <div className='flex items-center gap-0 border-b border-[#1e1e1e] mb-6 overflow-x-auto scrollbar-hide'>
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'relative shrink-0 px-5 py-3 text-xs font-semibold tracking-wider uppercase transition-colors',
                tab === t ? 'text-gold' : 'text-[#3a3a3a] hover:text-[#6b6b6b]'
              )}
            >
              {STATUS_LABELS[t]}
              {tab === t && <span className='absolute bottom-0 left-0 right-0 h-[2px] bg-gold' />}
              <span className='ml-2 text-[10px] text-[#3a3a3a]'>
                {t === 'all' ? campaigns.length : campaigns.filter((c) => c.status === t).length}
              </span>
            </button>
          ))}
        </div>

        {/* Campaign list */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='w-8 h-8 animate-spin text-gold' />
          </div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-20 border border-[#1e1e1e] bg-[#111111]'>
            <p className='font-display text-xl text-white mb-3'>No campaigns yet</p>
            <p className='text-[#3a3a3a] text-sm mb-8'>Start your first campaign to increase visibility across the platform.</p>
            <Link href='/advertise/new' className='inline-flex items-center gap-2 px-6 py-3 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors'>
              <PlusCircle className='w-4 h-4' /> Create Campaign
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {filtered.map((campaign) => (
              <AdCampaignCard
                key={campaign.id}
                campaign={campaign}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
