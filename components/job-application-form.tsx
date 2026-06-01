'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Work } from '@prisma/client';

import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import useGetProfile from '@/hooks/use-get-profile';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export default function JobApplicationForm({ jobId, onSuccess }: JobApplicationFormProps) {
  const { userId }    = useAuth();
  const { toast }     = useToast();
  const { data: profileData, isLoading: profileLoading } = useGetProfile({ userId: userId! });

  const [isOpen,        setIsOpen]        = useState(false);
  const [isLoading,     setIsLoading]     = useState(false);
  const [message,       setMessage]       = useState('');
  const [workId,        setWorkId]        = useState('');
  const [portfolioUrl,  setPortfolioUrl]  = useState('');
  const [shareType,     setShareType]     = useState<'work' | 'link'>('work');

  if (!userId) {
    return (
      <button
        disabled
        className='text-luxury-label tracking-luxury text-lux-muted border border-lux-border px-8 py-3 cursor-not-allowed opacity-60'
      >
        Sign in to Apply
      </button>
    );
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({ description: 'Please write a message', variant: 'destructive' });
      return;
    }
    if (shareType === 'work' && !workId) {
      toast({ description: 'Please select a project from your portfolio', variant: 'destructive' });
      return;
    }
    if (shareType === 'link' && !portfolioUrl.trim()) {
      toast({ description: 'Please provide a portfolio link', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const r = await axios.post(`/api/job/${jobId}/apply`, {
        message,
        workId:       shareType === 'work' ? workId       : null,
        portfolioUrl: shareType === 'link' ? portfolioUrl : null
      });
      if (r.data?.success) {
        toast({ description: 'Application submitted successfully' });
        setMessage(''); setWorkId(''); setPortfolioUrl('');
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (err: any) {
      toast({ description: err.response?.data?.message || 'Failed to submit application', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className='group inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-8 py-3.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'>
          Apply Now
          <ArrowRight size={12} className='transition-transform duration-300 group-hover:translate-x-0.5' />
        </button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg border-lux-border rounded-none p-0 gap-0'>
        <DialogHeader className='px-8 pt-8 pb-6 border-b border-lux-border'>
          <DialogTitle className='font-display text-2xl font-bold text-lux-black'>
            Apply for this Role
          </DialogTitle>
          <p className='text-sm text-lux-mid mt-1'>
            Tell the team about yourself and share your work.
          </p>
        </DialogHeader>

        <div className='px-8 py-7 space-y-6'>

          {/* Message */}
          <div className='space-y-2'>
            <label className='text-luxury-label tracking-luxury text-lux-muted block'>
              Your Message *
            </label>
            <textarea
              placeholder='Introduce yourself and explain why you are a great fit for this role…'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className='w-full px-4 py-3 border border-lux-border bg-white text-lux-black text-sm placeholder:text-lux-subtle focus:outline-none focus:border-lux-black/30 transition-colors duration-200 resize-none'
            />
          </div>

          {/* Share type */}
          <div className='space-y-2'>
            <label className='text-luxury-label tracking-luxury text-lux-muted block'>
              Share Your Work *
            </label>
            <Select value={shareType} onValueChange={(v) => setShareType(v as 'work' | 'link')}>
              <SelectTrigger className='border-lux-border rounded-none h-11 text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='rounded-none border-lux-border'>
                <SelectItem value='work'>Select from my portfolio</SelectItem>
                <SelectItem value='link'>Share a link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Portfolio work / URL */}
          {shareType === 'work' ? (
            <div className='space-y-2'>
              <label className='text-luxury-label tracking-luxury text-lux-muted block'>
                Select Project *
              </label>
              {profileLoading ? (
                <p className='text-sm text-lux-muted'>Loading your projects…</p>
              ) : (profileData?.works?.length ?? 0) > 0 ? (
                <Select value={workId} onValueChange={setWorkId}>
                  <SelectTrigger className='border-lux-border rounded-none h-11 text-sm'>
                    <SelectValue placeholder='Choose a project' />
                  </SelectTrigger>
                  <SelectContent className='rounded-none border-lux-border'>
                    {(profileData?.works ?? []).map((work: Work) => (
                      <SelectItem key={work.id} value={work.id}>{work.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className='text-sm text-lux-muted'>
                  No projects uploaded yet — share a link instead.
                </p>
              )}
            </div>
          ) : (
            <div className='space-y-2'>
              <label className='text-luxury-label tracking-luxury text-lux-muted block'>
                Portfolio Link *
              </label>
              <input
                type='url'
                placeholder='https://your-portfolio.com'
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className='w-full px-4 py-3 border border-lux-border bg-white text-lux-black text-sm placeholder:text-lux-subtle focus:outline-none focus:border-lux-black/30 transition-colors duration-200'
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='px-8 pb-8 flex items-center justify-end gap-3 border-t border-lux-border pt-5'>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className='px-6 py-2.5 text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 transition-all duration-200'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={isLoading}
            className='inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-7 py-2.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300 disabled:opacity-60'
          >
            {isLoading && <Loader2 size={13} className='animate-spin' />}
            Submit Application
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
