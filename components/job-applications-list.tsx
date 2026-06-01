'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Application {
  id: string;
  message: string;
  workId?: string;
  portfolioUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  work?: {
    id: string;
    title: string;
    image: string;
    liveSiteUrl: string;
  };
}

const STATUS_STYLES = {
  pending:  'text-[#b89a52] border-[#c9a96e]/40',
  accepted: 'text-lux-black border-lux-black/30 bg-lux-black/5',
  rejected: 'text-lux-subtle border-lux-border line-through',
} as const;

const STATUS_LABELS = {
  pending:  'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
} as const;

export default function JobApplicationsList({ jobId }: { jobId: string }) {
  const { toast }                                     = useToast();
  const [applications, setApplications]               = useState<Application[]>([]);
  const [isLoading,    setIsLoading]                  = useState(true);
  const [updatingId,   setUpdatingId]                 = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    axios.get(`/api/job/${jobId}/applications`)
      .then((r) => { if (alive && r.data?.success) setApplications(r.data.applications); })
      .catch(() => { toast({ description: 'Failed to load applications', variant: 'destructive' }); })
      .finally(() => { if (alive) setIsLoading(false); });
    return () => { alive = false; };
  }, [jobId]);

  const updateStatus = async (appId: string, status: 'accepted' | 'rejected') => {
    setUpdatingId(appId);
    try {
      const r = await axios.patch(`/api/job/${jobId}/applications`, { applicationId: appId, status });
      if (r.data?.success) {
        setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
        toast({ description: `Application ${status}` });
      }
    } catch {
      toast({ description: 'Failed to update application', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className='border border-lux-border p-6 space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='h-9 w-9 rounded-full shimmer bg-lux-border' />
              <div className='h-3.5 w-32 shimmer bg-lux-border' />
            </div>
            <div className='h-3 w-full shimmer bg-lux-border' />
            <div className='h-3 w-4/5 shimmer bg-lux-border' />
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className='py-16 text-center'>
        <h3 className='font-display text-xl font-bold text-lux-black mb-2'>No applications yet</h3>
        <p className='text-sm text-lux-mid'>Check back later for candidates.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='font-display text-2xl font-bold text-lux-black mb-2'>
        Applications
      </h2>
      <p className='text-luxury-label tracking-luxury text-lux-muted mb-7'>
        {applications.length} candidate{applications.length !== 1 ? 's' : ''}
      </p>

      <div className='space-y-4'>
        {applications.map((app) => (
          <div
            key={app.id}
            className='border border-lux-border p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
          >
            {/* Applicant row */}
            <div className='flex items-start justify-between mb-5'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-9 w-9 ring-1 ring-lux-border flex-shrink-0'>
                  <AvatarImage src={app.user.imageUrl ?? ''} />
                  <AvatarFallback className='text-[9px] bg-lux-hover text-lux-mid'>
                    {app.user.firstName?.charAt(0)}{app.user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-display font-bold text-lux-black text-[0.95rem] leading-tight'>
                    {app.user.firstName} {app.user.lastName}
                  </p>
                  <p className='text-luxury-label tracking-luxury text-lux-subtle mt-0.5'>
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              <span className={cn(
                'text-luxury-label tracking-luxury border px-3 py-1',
                STATUS_STYLES[app.status]
              )}>
                {STATUS_LABELS[app.status]}
              </span>
            </div>

            {/* Message */}
            <div className='mb-5'>
              <p className='text-luxury-label tracking-luxury text-lux-muted mb-2'>Message</p>
              <p className='text-sm text-lux-mid leading-relaxed whitespace-pre-wrap'>{app.message}</p>
            </div>

            {/* Shared work */}
            {app.work && (
              <div className='mb-5 border border-lux-border p-4'>
                <p className='text-luxury-label tracking-luxury text-lux-muted mb-3'>Submitted Work</p>
                <div className='flex gap-4 items-center'>
                  {app.work.image && (
                    <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden bg-[#f0ece5]'>
                      <Image src={app.work.image} alt={app.work.title} fill className='object-cover' />
                    </div>
                  )}
                  <div className='min-w-0'>
                    <p className='font-medium text-lux-black text-sm truncate'>{app.work.title}</p>
                    <Link
                      href={app.work.liveSiteUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 text-luxury-label tracking-luxury text-[#c9a96e] hover:opacity-70 transition-opacity duration-200 mt-1'
                    >
                      View Project <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio link */}
            {app.portfolioUrl && (
              <div className='mb-5 border border-lux-border p-4'>
                <p className='text-luxury-label tracking-luxury text-lux-muted mb-2'>Portfolio</p>
                <Link
                  href={app.portfolioUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 text-sm text-[#c9a96e] hover:opacity-70 transition-opacity duration-200 break-all'
                >
                  {app.portfolioUrl} <ExternalLink size={12} className='flex-shrink-0' />
                </Link>
              </div>
            )}

            {/* Accept / Reject */}
            {app.status === 'pending' && (
              <div className='flex gap-2 pt-4 border-t border-lux-border'>
                <button
                  type='button'
                  onClick={() => updateStatus(app.id, 'accepted')}
                  disabled={updatingId !== null}
                  className='flex-1 inline-flex items-center justify-center gap-2 bg-lux-black hover:bg-lux-dark text-white py-2.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300 disabled:opacity-60'
                >
                  {updatingId === app.id ? <Loader2 size={12} className='animate-spin' /> : <Check size={12} />}
                  Accept
                </button>
                <button
                  type='button'
                  onClick={() => updateStatus(app.id, 'rejected')}
                  disabled={updatingId !== null}
                  className='flex-1 inline-flex items-center justify-center gap-2 border border-lux-border hover:border-lux-black/30 text-lux-mid hover:text-lux-black py-2.5 text-luxury-label tracking-luxury transition-all duration-300 disabled:opacity-60'
                >
                  {updatingId === app.id ? <Loader2 size={12} className='animate-spin' /> : <X size={12} />}
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
