'use client';

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Work } from '@prisma/client';
import { BookmarkIcon, HeartIcon, EyeIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons/Icons';
import useGetProfile from '@/hooks/use-get-profile';
import ProBadge from '@/components/pro-badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Deterministic aspect-ratio pattern — creates visual masonry variety
const ASPECTS = [
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[1/1]',
  'aspect-[4/3]',
  'aspect-[16/9]',
  'aspect-[4/5]',
];

interface SearchCardProps {
  work: Work;
  index: number;
}

export default function SearchCard({ work, index }: SearchCardProps) {
  const { data, isLoading } = useGetProfile({ userId: work.userId });

  const [likesCount,     setLikesCount]     = useState<number | null>(null);
  const [bookmarksCount, setBookmarksCount] = useState<number | null>(null);
  const [isLiked,        setIsLiked]        = useState(false);
  const [isBookmarked,   setIsBookmarked]   = useState(false);

  const aspectClass = ASPECTS[index % ASPECTS.length];

  useEffect(() => {
    let alive = true;
    axios.get(`/api/work/${work.id}/meta`).then((r) => {
      if (r.data?.success && alive) {
        setLikesCount(r.data.likesCount ?? 0);
        setBookmarksCount(r.data.bookmarksCount ?? 0);
        setIsLiked(!!r.data.isLiked);
        setIsBookmarked(!!r.data.isBookmarked);
      }
    }).catch(() => {});
    return () => { alive = false; };
  }, [work.id]);

  return (
    <div className='break-inside-avoid mb-5 group/card'>

      {/* ── Image block ─────────────────────────────────────── */}
      <Link
        href={`/work/${work.id}`}
        scroll={false}
        className={cn(
          'relative w-full overflow-hidden block bg-[#f0ece5]',
          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-hover/card:shadow-[0_20px_60px_rgba(0,0,0,0.14),0_6px_20px_rgba(0,0,0,0.08)]',
          aspectClass
        )}
      >
        <Image
          src={work.image}
          alt={work.title}
          fill
          sizes='(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw'
          className='object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04]'
          loading='lazy'
        />

        {/* dark overlay */}
        <div className='absolute inset-0 bg-card-info opacity-0 group-hover/card:opacity-100 transition-opacity duration-400 z-10' />

        {/* category tag — top left */}
        <div className='absolute top-3 left-3 z-20 opacity-0 translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300'>
          <span className='inline-block bg-white/90 backdrop-blur-sm text-lux-black text-[10px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1'>
            {work.category}
          </span>
        </div>

        {/* action buttons — top right */}
        <div className='absolute top-3 right-3 z-20 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300'>
          <button
            type='button'
            aria-label='Bookmark'
            onClick={async (e) => {
              e.preventDefault(); e.stopPropagation();
              const r = await axios.post(`/api/work/${work.id}/bookmark`).catch(() => null);
              if (r?.data?.success) {
                setBookmarksCount(r.data.bookmarksCount ?? 0);
                setIsBookmarked(!!r.data.bookmarked);
              }
            }}
            className='w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white border border-white/20 transition-all duration-200 shadow-sm'
          >
            <BookmarkIcon size={12} className={isBookmarked ? 'text-gold fill-gold' : 'text-lux-black'} />
          </button>
          <button
            type='button'
            aria-label='Like'
            onClick={async (e) => {
              e.preventDefault(); e.stopPropagation();
              const r = await axios.post(`/api/work/${work.id}/like`).catch(() => null);
              if (r?.data?.success) {
                setLikesCount(r.data.likesCount ?? 0);
                setIsLiked(!!r.data.liked);
              }
            }}
            className='w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white border border-white/20 transition-all duration-200 shadow-sm'
          >
            <HeartIcon size={12} className={isLiked ? 'text-gold fill-gold' : 'text-lux-black'} />
          </button>
        </div>

        {/* bottom: title + metrics */}
        <div className='absolute bottom-0 inset-x-0 z-20 p-4 opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300'>
          <p className='text-white font-medium text-sm leading-snug line-clamp-2 mb-2'>
            {work.title}
          </p>
          <div className='flex items-center gap-3'>
            <span className='flex items-center gap-1.5'>
              <HeartIcon size={11} className={cn('fill-current', isLiked ? 'text-gold' : 'text-white/70')} />
              <span className='text-white/70 text-[11px]'>
                {likesCount !== null ? likesCount.toLocaleString() : '—'}
              </span>
            </span>
            <span className='flex items-center gap-1.5'>
              <EyeIcon size={11} className='text-white/70' />
              <span className='text-white/70 text-[11px]'>
                {bookmarksCount !== null ? bookmarksCount.toLocaleString() : '—'}
              </span>
            </span>
          </div>
        </div>
      </Link>

      {/* ── Creator meta ────────────────────────────────────── */}
      <div className='mt-2.5 px-0.5 flex items-center justify-between'>
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <div className='h-5 w-5 rounded-full shimmer bg-lux-border' />
            <div className='h-3 w-24 shimmer bg-lux-border rounded-sm' />
          </div>
        ) : data?.user && data?.profile ? (
          <Link
            href={`/${data.profile.username}`}
            className='flex items-center gap-2 hover:opacity-70 transition-opacity duration-200'
          >
            <Avatar className='h-5 w-5 ring-1 ring-lux-border'>
              <AvatarImage src={data.user.imageUrl} alt='avatar' />
              <AvatarFallback className='text-[8px] bg-lux-hover text-lux-mid'>
                {data.user.firstName?.charAt(0)}{data.user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className='text-xs text-lux-mid flex items-center gap-1'>
              <span className='truncate max-w-[110px]'>{data.user.firstName} {data.user.lastName}</span>
              {(data.user as any).publicMetadata?.isPro && (
                <ProBadge isAgency={!!(data.user as any).publicMetadata?.isAgencyPro} />
              )}
            </span>
          </Link>
        ) : (
          <div />
        )}

        <div className='flex items-center gap-1.5'>
          <Icons.heart className={cn('w-3.5 h-3.5 fill-current', isLiked ? 'text-gold' : 'text-lux-subtle')} />
          <span className='text-[11px] text-lux-subtle'>
            {likesCount !== null ? likesCount.toLocaleString() : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
