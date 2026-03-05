'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Work } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const { userId } = useAuth();
  const { toast } = useToast();
  const { data: profileData, isLoading: profileLoading } = useGetProfile({
    userId: userId!
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [workId, setWorkId] = useState<string>('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [shareType, setShareType] = useState<'work' | 'link'>('work');

  if (!userId) {
    return (
      <Button className='rounded-full px-8 font-semibold' disabled>
        Sign in to Apply
      </Button>
    );
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a message',
        variant: 'destructive'
      });
      return;
    }

    if (shareType === 'work' && !workId) {
      toast({
        title: 'Error',
        description: 'Please select a project from your portfolio',
        variant: 'destructive'
      });
      return;
    }

    if (shareType === 'link' && !portfolioUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a portfolio link',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`/api/job/${jobId}/apply`, {
        message,
        workId: shareType === 'work' ? workId : null,
        portfolioUrl: shareType === 'link' ? portfolioUrl : null
      });

      if (res.data?.success) {
        toast({
          title: 'Success',
          description: 'Application sent successfully!'
        });
        setMessage('');
        setWorkId('');
        setPortfolioUrl('');
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to submit application',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='rounded-full h-9 px-6 font-semibold hover:opacity-80'>
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Apply for This Job</DialogTitle>
          <DialogDescription>
            Tell the employer about yourself and share your work
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Message */}
          <div>
            <label className='text-sm font-medium text-[#3d3d4e] mb-2 block'>
              Your Message *
            </label>
            <Textarea
              placeholder='Introduce yourself and explain why you&apos;re interested in this position...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='min-h-24 resize-none'
            />
          </div>

          {/* Share Type Selection */}
          <div>
            <label className='text-sm font-medium text-[#3d3d4e] mb-2 block'>
              How to Share Your Work *
            </label>
            <Select value={shareType} onValueChange={(v) => setShareType(v as 'work' | 'link')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='work'>Select from my portfolio</SelectItem>
                <SelectItem value='link'>Share a link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Work Selection or URL Input */}
          {shareType === 'work' ? (
            <div>
              <label className='text-sm font-medium text-[#3d3d4e] mb-2 block'>
                Select Project *
              </label>
              {profileLoading ? (
                <p className='text-sm text-[#9e9ea7]'>Loading your projects...</p>
              ) : profileData?.works && profileData.works.length > 0 ? (
                <Select value={workId} onValueChange={setWorkId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a project' />
                  </SelectTrigger>
                  <SelectContent>
                    {profileData.works.map((work: Work) => (
                      <SelectItem key={work.id} value={work.id}>
                        {work.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className='text-sm text-[#9e9ea7]'>
                  You haven&apos;t posted any projects yet. Please share a link instead.
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className='text-sm font-medium text-[#3d3d4e] mb-2 block'>
                Portfolio Link *
              </label>
              <input
                type='url'
                placeholder='https://your-portfolio.com or github.com/username'
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className='w-full px-3 py-2 border border-[#e7e7e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          )}
        </div>

        <div className='flex gap-2 justify-end'>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className='rounded-full'
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Submit Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
