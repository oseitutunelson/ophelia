'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Bookmark, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface BlogPostMeta {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  tags: string[];
  authorId: string;
  readTime: number;
  viewCount: number;
  featured: boolean;
  createdAt: Date | string;
  _count: { likes: number; comments: number; bookmarks: number };
  author?: {
    username: string;
    profilePicture: string | null;
    displayName: string;
  };
}

interface BlogCardProps {
  post: BlogPostMeta;
  variant?: 'featured' | 'large' | 'medium' | 'small' | 'horizontal' | 'minimal';
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Fashion News': 'bg-rose-50 text-rose-700',
  'Fashion Trends': 'bg-violet-50 text-violet-700',
  'Streetwear': 'bg-blue-50 text-blue-700',
  'Luxury Fashion': 'bg-amber-50 text-amber-800',
  'Designer Stories': 'bg-emerald-50 text-emerald-700',
  'Fashion Business': 'bg-sky-50 text-sky-700',
  'Sustainability': 'bg-green-50 text-green-700',
  'Fashion Week': 'bg-pink-50 text-pink-700',
  'Celebrity Style': 'bg-purple-50 text-purple-700',
  'Editorials': 'bg-orange-50 text-orange-700',
};

function CategoryBadge({ category }: { category: string }) {
  const colorClass = CATEGORY_COLORS[category] || 'bg-lux-hover text-lux-dark';
  return (
    <span className={cn('text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm', colorClass)}>
      {category}
    </span>
  );
}

function AuthorAvatar({ author, size = 'sm' }: { author?: BlogPostMeta['author']; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 28 : 36;
  if (author?.profilePicture) {
    return (
      <Image
        src={author.profilePicture}
        alt={author.displayName}
        width={dim}
        height={dim}
        className={cn('rounded-full object-cover', size === 'sm' ? 'w-7 h-7' : 'w-9 h-9')}
      />
    );
  }
  const initials = author?.displayName?.slice(0, 2).toUpperCase() || '??';
  return (
    <div
      className={cn(
        'rounded-full bg-lux-border flex items-center justify-center text-lux-mid font-medium',
        size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'
      )}
    >
      {initials}
    </div>
  );
}

export default function BlogCard({ post, variant = 'medium', className }: BlogCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group relative block overflow-hidden', className)}>
        <div className='relative w-full h-[520px] lg:h-[620px]'>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              priority
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-lux-black to-lux-dark' />
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent' />
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-8 lg:p-12'>
          <CategoryBadge category={post.category} />
          <h2 className='font-display text-3xl lg:text-5xl text-white mt-4 mb-4 leading-tight max-w-3xl group-hover:text-gold transition-colors duration-300'>
            {post.title}
          </h2>
          {post.excerpt && (
            <p className='text-white/70 text-base leading-relaxed max-w-2xl line-clamp-2 mb-6 hidden md:block'>
              {post.excerpt}
            </p>
          )}
          <div className='flex items-center gap-4'>
            <AuthorAvatar author={post.author} />
            <div>
              <p className='text-white text-sm font-medium'>{post.author?.displayName || 'Ophelia Author'}</p>
              <p className='text-white/60 text-xs'>{timeAgo}</p>
            </div>
            <div className='ml-auto flex items-center gap-4 text-white/70 text-sm'>
              <span className='flex items-center gap-1.5'>
                <Clock className='w-4 h-4' />
                {post.readTime} min
              </span>
              <span className='flex items-center gap-1.5'>
                <Heart className='w-4 h-4' />
                {post._count.likes}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'large') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group block', className)}>
        <div className='relative overflow-hidden aspect-[16/10] mb-4'>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-lux-border to-lux-hover' />
          )}
          <div className='absolute top-4 left-4'>
            <CategoryBadge category={post.category} />
          </div>
        </div>
        <h3 className='font-display text-2xl text-lux-black leading-snug mb-2 group-hover:text-gold-deep transition-colors duration-200 line-clamp-2'>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className='text-lux-mid text-sm leading-relaxed line-clamp-2 mb-3'>{post.excerpt}</p>
        )}
        <div className='flex items-center gap-3'>
          <AuthorAvatar author={post.author} />
          <div className='flex-1 min-w-0'>
            <p className='text-lux-black text-sm font-medium truncate'>{post.author?.displayName || 'Ophelia Author'}</p>
            <p className='text-lux-muted text-xs'>{timeAgo} · {post.readTime} min read</p>
          </div>
          <div className='flex items-center gap-3 text-lux-muted text-xs shrink-0'>
            <span className='flex items-center gap-1'><Heart className='w-3.5 h-3.5' />{post._count.likes}</span>
            <span className='flex items-center gap-1'><MessageCircle className='w-3.5 h-3.5' />{post._count.comments}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group flex gap-4 items-start py-4 border-b border-lux-border last:border-0', className)}>
        <div className='relative w-24 h-20 shrink-0 overflow-hidden'>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='w-full h-full bg-lux-border' />
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <CategoryBadge category={post.category} />
          <h4 className='font-display text-base text-lux-black leading-snug mt-1.5 mb-1 group-hover:text-gold-deep transition-colors line-clamp-2'>
            {post.title}
          </h4>
          <p className='text-lux-muted text-xs'>{timeAgo} · {post.readTime} min read</p>
        </div>
      </Link>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link href={`/blog/${post.slug}`} className={cn('group flex items-center justify-between py-3.5 border-b border-lux-border last:border-0', className)}>
        <div className='flex-1 min-w-0 pr-4'>
          <span className='text-[10px] font-semibold tracking-wider uppercase text-gold mr-2'>{post.category}</span>
          <h4 className='font-display text-sm text-lux-black group-hover:text-gold-deep transition-colors line-clamp-1 mt-0.5'>
            {post.title}
          </h4>
        </div>
        <div className='flex items-center gap-2 text-lux-muted text-xs shrink-0'>
          <Eye className='w-3 h-3' />
          {post.viewCount}
        </div>
      </Link>
    );
  }

  // Default: medium card
  return (
    <Link href={`/blog/${post.slug}`} className={cn('group block', className)}>
      <div className='relative overflow-hidden aspect-[4/3] mb-3'>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-lux-border to-lux-hover' />
        )}
        <div className='absolute top-3 left-3'>
          <CategoryBadge category={post.category} />
        </div>
      </div>
      <h3 className='font-display text-lg text-lux-black leading-snug mb-1.5 group-hover:text-gold-deep transition-colors line-clamp-2'>
        {post.title}
      </h3>
      <div className='flex items-center gap-2.5 mt-2'>
        <AuthorAvatar author={post.author} />
        <div className='flex-1 min-w-0'>
          <p className='text-xs text-lux-dark font-medium truncate'>{post.author?.displayName || 'Author'}</p>
          <p className='text-[11px] text-lux-muted'>{timeAgo} · {post.readTime} min</p>
        </div>
        <div className='flex items-center gap-2 text-lux-muted text-xs'>
          <span className='flex items-center gap-1'><Heart className='w-3 h-3' />{post._count.likes}</span>
          <span className='flex items-center gap-1'><Bookmark className='w-3 h-3' />{post._count.bookmarks}</span>
        </div>
      </div>
    </Link>
  );
}
