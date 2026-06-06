'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Eye, MousePointer, Pause, Play, Trash2, TrendingUp, Users, Briefcase, FileText } from 'lucide-react';
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

interface AdCampaignCardProps {
  campaign: AdCampaign;
  onUpdate: (id: string, updates: Partial<AdCampaign>) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS = { design: TrendingUp, agency: Users, job: Briefcase, blog: FileText };

export default function AdCampaignCard({ campaign, onUpdate, onDelete }: AdCampaignCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const statusMeta = CAMPAIGN_STATUS_LABELS[campaign.status] || { label: campaign.status, color: '#6b6b6b' };
  const product = getAdProduct(campaign.type as AdType);
  const Icon = TYPE_ICONS[campaign.type as AdType] || TrendingUp;
  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : '0.0';

  const handleTogglePause = async () => {
    setLoading(true);
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    try {
      await axios.patch(`/api/campaigns/${campaign.id}`, { status: newStatus });
      onUpdate(campaign.id, { status: newStatus });
      toast({ title: newStatus === 'active' ? 'Campaign resumed.' : 'Campaign paused.' });
    } catch {
      toast({ title: 'Failed to update campaign.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await axios.delete(`/api/campaigns/${campaign.id}`);
      onDelete(campaign.id);
      toast({ title: 'Campaign deleted.' });
    } catch {
      toast({ title: 'Failed to delete campaign.', variant: 'destructive' });
    }
  };

  return (
    <div className='bg-[#111111] border border-[#1e1e1e] p-5 hover:border-[#2a2a2a] transition-colors'>
      <div className='flex items-start gap-4'>
        {/* Thumbnail */}
        <div className='relative w-14 h-14 shrink-0 overflow-hidden bg-[#1a1a1a] flex items-center justify-center'>
          {campaign.contentImage ? (
            <Image src={campaign.contentImage} alt={campaign.contentTitle} fill className='object-cover' unoptimized />
          ) : (
            <Icon className='w-6 h-6 text-[#3a3a3a]' />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-[10px] font-bold tracking-widest uppercase text-gold'>{product?.label}</span>
                <span
                  className='text-[10px] font-semibold px-2 py-0.5 rounded-sm'
                  style={{ color: statusMeta.color, background: `${statusMeta.color}18` }}
                >
                  {statusMeta.label}
                </span>
              </div>
              <p className='text-[#f7f5f0] text-sm font-medium truncate'>{campaign.contentTitle}</p>
              {campaign.endDate && (
                <p className='text-[#3a3a3a] text-xs mt-0.5'>
                  {campaign.status === 'active'
                    ? `Ends ${format(new Date(campaign.endDate), 'MMM d, yyyy')}`
                    : campaign.startDate
                    ? `Ran ${format(new Date(campaign.startDate), 'MMM d')} – ${format(new Date(campaign.endDate), 'MMM d, yyyy')}`
                    : `${campaign.duration} days`}
                </p>
              )}
            </div>
            <span className='font-display text-lg text-gold shrink-0'>${campaign.price}</span>
          </div>

          {/* Metrics row */}
          <div className='flex items-center gap-5 mt-4 pt-4 border-t border-[#1e1e1e]'>
            <div className='flex items-center gap-1.5 text-xs text-[#6b6b6b]'>
              <Eye className='w-3.5 h-3.5' />
              <span className='font-semibold text-[#b0a898]'>{campaign.impressions.toLocaleString()}</span>
              <span>impressions</span>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-[#6b6b6b]'>
              <MousePointer className='w-3.5 h-3.5' />
              <span className='font-semibold text-[#b0a898]'>{campaign.clicks.toLocaleString()}</span>
              <span>clicks</span>
            </div>
            <div className='text-xs text-[#6b6b6b]'>
              <span className='font-semibold text-[#b0a898]'>{ctr}%</span> CTR
            </div>

            {/* Actions */}
            <div className='ml-auto flex items-center gap-2'>
              {(campaign.status === 'active' || campaign.status === 'paused') && (
                <button
                  onClick={handleTogglePause}
                  disabled={loading}
                  className={cn(
                    'w-7 h-7 rounded-sm flex items-center justify-center border transition-colors',
                    campaign.status === 'active'
                      ? 'border-[#2a2a2a] text-[#6b6b6b] hover:border-gold/40 hover:text-gold'
                      : 'border-gold/30 text-gold hover:bg-gold/10'
                  )}
                  title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                >
                  {campaign.status === 'active' ? <Pause className='w-3.5 h-3.5' /> : <Play className='w-3.5 h-3.5' />}
                </button>
              )}
              {['expired', 'pending_payment'].includes(campaign.status) && (
                <button
                  onClick={handleDelete}
                  className='w-7 h-7 rounded-sm flex items-center justify-center border border-[#2a2a2a] text-[#6b6b6b] hover:border-rose-500/40 hover:text-rose-500 transition-colors'
                  title='Delete'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
