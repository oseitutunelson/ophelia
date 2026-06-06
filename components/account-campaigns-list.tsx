'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Eye, MousePointer, Pause, Play, Trash2,
  TrendingUp, Users, Briefcase, FileText,
  PlusCircle, Loader2, ExternalLink, Zap,
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { CAMPAIGN_STATUS_LABELS, getAdProduct, type AdType } from '@/lib/ad-utils';
import { useToast } from '@/components/ui/use-toast';

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

const TYPE_ICONS = { design: TrendingUp, agency: Users, job: Briefcase, blog: FileText };

const STATUS_TABS = ['all', 'active', 'paused', 'expired', 'pending_payment'] as const;
const STATUS_LABELS: Record<string, string> = {
  all: 'All',
  active: 'Active',
  paused: 'Paused',
  expired: 'Expired',
  pending_payment: 'Awaiting Payment',
};

function CampaignRow({
  campaign,
  onUpdate,
  onDelete,
}: {
  campaign: AdCampaign;
  onUpdate: (id: string, updates: Partial<AdCampaign>) => void;
  onDelete: (id: string) => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const statusMeta = CAMPAIGN_STATUS_LABELS[campaign.status] || { label: campaign.status, color: '#b0a898' };
  const product = getAdProduct(campaign.type as AdType);
  const Icon = TYPE_ICONS[campaign.type as AdType] || TrendingUp;
  const ctr = campaign.impressions > 0
    ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1)
    : '—';

  const handleTogglePause = async () => {
    setLoading(true);
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    try {
      await axios.patch(`/api/campaigns/${campaign.id}`, { status: newStatus });
      onUpdate(campaign.id, { status: newStatus });
      toast({ description: newStatus === 'active' ? 'Campaign resumed.' : 'Campaign paused.' });
    } catch {
      toast({ description: 'Failed to update campaign.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/campaigns/${campaign.id}`);
      onDelete(campaign.id);
      toast({ description: 'Campaign deleted.' });
    } catch {
      toast({ description: 'Failed to delete campaign.', variant: 'destructive' });
    }
  };

  return (
    <div className='flex items-start gap-4 p-5 bg-white border border-lux-border hover:border-lux-subtle transition-colors duration-200'>
      {/* Thumbnail */}
      <div className='relative w-14 h-14 shrink-0 overflow-hidden bg-lux-hover flex items-center justify-center'>
        {campaign.contentImage ? (
          <Image
            src={campaign.contentImage}
            alt={campaign.contentTitle}
            fill
            className='object-cover'
            unoptimized
          />
        ) : (
          <Icon className='w-6 h-6 text-lux-muted' />
        )}
      </div>

      {/* Main content */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-3 mb-2'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-[10px] font-bold tracking-widest uppercase text-gold'>
                {product?.label}
              </span>
              <span
                className='text-[10px] font-semibold px-2 py-0.5'
                style={{ color: statusMeta.color, background: `${statusMeta.color}18` }}
              >
                {statusMeta.label}
              </span>
            </div>
            <p className='text-sm font-semibold text-lux-black truncate'>{campaign.contentTitle}</p>
            <p className='text-xs text-lux-muted mt-0.5'>
              {campaign.endDate && campaign.status === 'active'
                ? `Ends ${format(new Date(campaign.endDate), 'MMM d, yyyy')}`
                : campaign.startDate && campaign.endDate
                ? `${format(new Date(campaign.startDate), 'MMM d')} – ${format(new Date(campaign.endDate), 'MMM d, yyyy')}`
                : `${campaign.duration} days`}
              {' · '}
              <span className='text-gold font-medium'>${campaign.price.toFixed(2)}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className='flex items-center gap-1.5 shrink-0'>
            {(campaign.status === 'active' || campaign.status === 'paused') && (
              <button
                onClick={handleTogglePause}
                disabled={loading}
                title={campaign.status === 'active' ? 'Pause campaign' : 'Resume campaign'}
                className={cn(
                  'w-8 h-8 flex items-center justify-center border transition-colors duration-200',
                  campaign.status === 'active'
                    ? 'border-lux-border text-lux-muted hover:border-lux-black hover:text-lux-black'
                    : 'border-gold/30 text-gold hover:bg-gold/5'
                )}
              >
                {loading
                  ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                  : campaign.status === 'active'
                  ? <Pause className='w-3.5 h-3.5' />
                  : <Play className='w-3.5 h-3.5' />}
              </button>
            )}
            {['expired', 'pending_payment'].includes(campaign.status) && (
              <button
                onClick={handleDelete}
                title='Delete campaign'
                className='w-8 h-8 flex items-center justify-center border border-lux-border text-lux-muted hover:border-rose-400 hover:text-rose-500 transition-colors duration-200'
              >
                <Trash2 className='w-3.5 h-3.5' />
              </button>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className='flex items-center gap-5 pt-3 border-t border-lux-border/60'>
          <span className='flex items-center gap-1.5 text-xs text-lux-muted'>
            <Eye className='w-3.5 h-3.5' />
            <span className='font-semibold text-lux-dark'>{campaign.impressions.toLocaleString()}</span> impressions
          </span>
          <span className='flex items-center gap-1.5 text-xs text-lux-muted'>
            <MousePointer className='w-3.5 h-3.5' />
            <span className='font-semibold text-lux-dark'>{campaign.clicks.toLocaleString()}</span> clicks
          </span>
          <span className='text-xs text-lux-muted'>
            <span className='font-semibold text-lux-dark'>{ctr}{ctr !== '—' ? '%' : ''}</span> CTR
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AccountCampaignsList() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    axios.get('/api/campaigns')
      .then(({ data }) => setCampaigns(data.campaigns || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? campaigns : campaigns.filter((c) => c.status === tab);

  const activeCampaigns   = campaigns.filter((c) => c.status === 'active').length;
  const totalImpressions  = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks       = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalSpend        = campaigns.filter((c) => c.status !== 'pending_payment').reduce((s, c) => s + c.price, 0);

  const handleUpdate = (id: string, updates: Partial<AdCampaign>) =>
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const handleDelete = (id: string) =>
    setCampaigns((prev) => prev.filter((c) => c.id !== id));

  if (loading) {
    return (
      <div className='flex justify-center py-20'>
        <Loader2 className='w-7 h-7 animate-spin text-lux-muted' />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Stats row */}
      {campaigns.length > 0 && (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[
            { icon: Zap,           label: 'Active',      value: activeCampaigns },
            { icon: Eye,           label: 'Impressions', value: totalImpressions.toLocaleString() },
            { icon: MousePointer,  label: 'Clicks',      value: totalClicks.toLocaleString() },
            { icon: TrendingUp,    label: 'Total Spend', value: `$${totalSpend.toFixed(2)}` },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className='bg-white border border-lux-border p-5'>
                <Icon className='w-4 h-4 text-gold mb-3' />
                <p className='font-display text-2xl text-lux-black'>{s.value}</p>
                <p className='text-lux-muted text-xs mt-0.5'>{s.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Status filter tabs */}
      {campaigns.length > 0 && (
        <div className='flex items-center gap-0 border-b border-lux-border overflow-x-auto scrollbar-hide'>
          {STATUS_TABS.map((t) => {
            const count = t === 'all' ? campaigns.length : campaigns.filter((c) => c.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'relative shrink-0 flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold tracking-wider uppercase transition-colors',
                  tab === t ? 'text-lux-black' : 'text-lux-muted hover:text-lux-dark'
                )}
              >
                {STATUS_LABELS[t]}
                <span className={cn('text-[10px]', tab === t ? 'text-gold' : 'text-lux-subtle')}>{count}</span>
                {tab === t && <span className='absolute bottom-0 left-0 right-0 h-[2px] bg-lux-black' />}
              </button>
            );
          })}
        </div>
      )}

      {/* Campaign list */}
      {filtered.length === 0 ? (
        <div className='flex flex-col items-center gap-4 py-20 text-center'>
          <div className='w-14 h-14 rounded-full border-2 border-dashed border-lux-border flex items-center justify-center'>
            <Zap className='w-6 h-6 text-lux-muted' />
          </div>
          <div>
            <h3 className='font-display text-xl text-lux-black mb-1'>
              {tab === 'all' ? 'No campaigns yet' : `No ${STATUS_LABELS[tab].toLowerCase()} campaigns`}
            </h3>
            <p className='text-lux-muted text-sm max-w-xs leading-relaxed'>
              {tab === 'all'
                ? 'Boost your designs, agency, jobs, or articles to reach thousands of fashion creatives.'
                : 'Nothing here right now.'}
            </p>
          </div>
          {tab === 'all' && (
            <Link
              href='/advertise/new'
              className='mt-2 flex items-center gap-2 px-6 py-2.5 bg-lux-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-lux-dark transition-colors'
            >
              <PlusCircle className='w-4 h-4' /> Create Campaign
            </Link>
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          {filtered.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Footer links */}
      {campaigns.length > 0 && (
        <div className='flex items-center justify-between pt-4 border-t border-lux-border'>
          <Link
            href='/advertise/new'
            className='flex items-center gap-2 text-xs font-semibold text-lux-black border border-lux-border px-5 py-2.5 hover:bg-lux-hover transition-colors'
          >
            <PlusCircle className='w-3.5 h-3.5' /> New Campaign
          </Link>
          <Link
            href='/advertise/dashboard'
            className='flex items-center gap-1.5 text-xs text-lux-muted hover:text-lux-black transition-colors'
          >
            Full dashboard <ExternalLink className='w-3 h-3' />
          </Link>
        </div>
      )}
    </div>
  );
}
