"use client";

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BookmarkIcon, MessageCircleIcon, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import useGetProfile from '@/hooks/use-get-profile';
import ProBadge from '@/components/pro-badge';

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

interface TalentCardProps {
  userId: string;
  username: string;
  bio?: string;
  works: Work[];
  profilePicture?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function TalentCard({
  userId,
  username,
  bio,
  works,
  profilePicture,
}: TalentCardProps) {
  const { toast }                                 = useToast();
  const { data: profileData }                     = useGetProfile({ userId });
  const [isBookmarked,   setIsBookmarked]         = useState(false);
  const [isBookmarking,  setIsBookmarking]        = useState(false);
  const [checkingStatus, setCheckingStatus]       = useState(true);

  const isPro      = !!(profileData?.user as any)?.publicMetadata?.isPro;
  const isAgency   = !!(profileData?.user as any)?.publicMetadata?.isAgencyPro;

  useEffect(() => {
    let alive = true;
    axios.get(`/api/profile-bookmarks/${userId}`)
      .then((r) => { if (alive && r.data?.success) setIsBookmarked(!!r.data.isBookmarked); })
      .catch(() => {})
      .finally(() => { if (alive) setCheckingStatus(false); });
    return () => { alive = false; };
  }, [userId]);

  const handleBookmark = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        const r = await axios.delete(`/api/profile-bookmarks/${userId}`);
        if (r.data?.success) {
          setIsBookmarked(false);
          toast({ description: 'Removed from saved designers' });
        }
      } else {
        const r = await axios.post('/api/profile-bookmarks', { talentId: userId });
        if (r.data?.success) {
          setIsBookmarked(true);
          toast({ description: 'Designer saved' });
        }
      }
    } catch (err: any) {
      toast({ description: err.response?.data?.error || 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsBookmarking(false);
    }
  };

  const featuredWork = works[0];

  return (
    <div className='talent-card-item group flex flex-col border border-lux-border bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_56px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)] hover:-translate-y-1'>

      {/* ── Featured work image ──────────────────────────────── */}
      <Link href={`/${username}`} className='relative block w-full aspect-[4/3] overflow-hidden bg-[#f0ece5]'>
        {featuredWork ? (
          <Image
            src={featuredWork.image}
            alt={featuredWork.title}
            fill
            className='object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-[#f0ece5] to-[#e5dfd6] flex items-center justify-center'>
            <span className='text-luxury-label tracking-luxury text-lux-subtle'>No works yet</span>
          </div>
        )}

        {/* category label on featured work */}
        {featuredWork && (
          <div className='absolute bottom-3 left-3'>
            <span className='inline-block bg-white/90 backdrop-blur-sm text-lux-black text-[10px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1'>
              {featuredWork.category}
            </span>
          </div>
        )}

        {/* bookmark button */}
        <button
          type='button'
          aria-label='Save designer'
          onClick={(e) => { e.preventDefault(); handleBookmark(); }}
          disabled={isBookmarking || checkingStatus}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all duration-200 shadow-sm',
            'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
          )}
        >
          <BookmarkIcon
            size={12}
            className={isBookmarked ? 'text-gold fill-gold' : 'text-lux-black'}
          />
        </button>
      </Link>

      {/* ── Card body ────────────────────────────────────────── */}
      <div className='flex flex-col flex-1 p-5'>

        {/* Profile row */}
        <Link
          href={`/${username}`}
          className='flex items-center gap-3 mb-4 hover:opacity-75 transition-opacity duration-200'
        >
          <Avatar className='h-10 w-10 ring-1 ring-lux-border flex-shrink-0'>
            {profilePicture && <AvatarImage src={profilePicture} alt={username} />}
            <AvatarFallback className='bg-[#f0ece5] text-lux-black font-semibold text-sm'>
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='font-display font-bold text-lux-black text-[1rem] leading-tight flex items-center gap-1.5'>
              <span className='truncate'>{username}</span>
              {isPro && <ProBadge isAgency={isAgency} size='md' />}
            </p>
            <p className='text-luxury-label tracking-luxury text-[#c9a96e] mt-0.5'>
              {isPro ? (isAgency ? 'Agency Pro' : 'Verified Pro') : 'Designer'}
            </p>
          </div>
        </Link>

        {/* Bio */}
        {bio && (
          <p className='text-sm text-lux-mid leading-relaxed line-clamp-2 mb-4'>
            {bio}
          </p>
        )}

        {/* Mini work grid */}
        {works.length > 1 && (
          <div className='mb-5'>
            <p className='text-luxury-label tracking-luxury text-lux-muted mb-2'>
              Portfolio · {works.length} works
            </p>
            <div className='grid grid-cols-3 gap-1.5'>
              {works.slice(0, 3).map((work) => (
                <Link
                  key={work.id}
                  href={`/work/${work.id}`}
                  className='relative group/thumb aspect-square overflow-hidden bg-[#f0ece5]'
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className='object-cover transition-transform duration-500 group-hover/thumb:scale-110'
                  />
                  <div className='absolute inset-0 bg-lux-black/0 group-hover/thumb:bg-lux-black/20 transition-colors duration-300' />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className='flex-1' />

        {/* CTA buttons */}
        <div className='flex gap-2 pt-4 border-t border-lux-border'>
          <Link
            href={`/messages?user=${userId}`}
            className='flex-1 inline-flex items-center justify-center gap-2 border border-lux-border hover:border-lux-black/30 text-lux-mid hover:text-lux-black px-4 py-2.5 text-luxury-label tracking-luxury transition-all duration-300'
          >
            <MessageCircleIcon size={12} />
            Contact
          </Link>
          <Link
            href={`/${username}`}
            className='flex-1 inline-flex items-center justify-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-4 py-2.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
          >
            View Profile
            <ArrowRight size={11} className='transition-transform duration-300 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </div>
  );
}
