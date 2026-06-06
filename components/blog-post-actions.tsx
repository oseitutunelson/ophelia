'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Bookmark, Share2, Edit } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface BlogPostActionsProps {
  slug: string;
  initialLikes: number;
  initialBookmarks: number;
  authorId: string;
}

export default function BlogPostActions({ slug, initialLikes, initialBookmarks, authorId }: BlogPostActionsProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarks);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const handleLike = async () => {
    if (!userId) { router.push('/sign-in'); return; }
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      const { data } = await axios.post(`/api/blog/${slug}/like`);
      setLiked(data.liked);
      setLikeCount((c) => data.liked ? c + 1 : c - 1);
    } catch { /* silent */ } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmark = async () => {
    if (!userId) { router.push('/sign-in'); return; }
    if (loadingBookmark) return;
    setLoadingBookmark(true);
    try {
      const { data } = await axios.post(`/api/blog/${slug}/bookmark`);
      setBookmarked(data.bookmarked);
      setBookmarkCount((c) => data.bookmarked ? c + 1 : c - 1);
    } catch { /* silent */ } finally {
      setLoadingBookmark(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: window.location.href, title: document.title });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={handleLike}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 border text-sm font-medium transition-colors duration-200',
          liked ? 'border-rose-500 text-rose-600 bg-rose-50' : 'border-lux-border text-lux-mid hover:border-lux-black hover:text-lux-black'
        )}
      >
        <Heart className={cn('w-4 h-4', liked && 'fill-rose-500 stroke-rose-500')} />
        <span>{likeCount}</span>
      </button>

      <button
        onClick={handleBookmark}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 border text-sm font-medium transition-colors duration-200',
          bookmarked ? 'border-gold text-gold-deep bg-gold/5' : 'border-lux-border text-lux-mid hover:border-lux-black hover:text-lux-black'
        )}
      >
        <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-gold stroke-gold')} />
        <span>{bookmarkCount}</span>
      </button>

      <button
        onClick={handleShare}
        className='flex items-center gap-1.5 px-3 py-2 border border-lux-border text-lux-mid hover:border-lux-black hover:text-lux-black text-sm font-medium transition-colors duration-200'
      >
        <Share2 className='w-4 h-4' />
      </button>

      {userId === authorId && (
        <a
          href={`/blog/${slug}/edit`}
          className='flex items-center gap-1.5 px-3 py-2 border border-lux-border text-lux-mid hover:border-lux-black hover:text-lux-black text-sm font-medium transition-colors duration-200'
        >
          <Edit className='w-4 h-4' />
        </a>
      )}
    </div>
  );
}
