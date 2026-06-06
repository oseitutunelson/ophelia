'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsArticle } from '@/app/api/blog/news/route';

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCard({ article }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  return (
    <a
      href={article.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group block shrink-0 w-72 lg:w-80'
    >
      <div className='relative overflow-hidden aspect-video mb-3'>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          unoptimized
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='w-7 h-7 rounded-full bg-white/90 flex items-center justify-center'>
            <ExternalLink className='w-3.5 h-3.5 text-lux-black' />
          </div>
        </div>
      </div>
      <div className='space-y-1.5'>
        <div className='flex items-center gap-2'>
          <span className='text-[10px] font-bold tracking-wider uppercase text-gold'>
            {article.source.name}
          </span>
          <span className='text-lux-subtle'>·</span>
          <span className='flex items-center gap-1 text-[10px] text-lux-muted'>
            <Clock className='w-3 h-3' />
            {timeAgo}
          </span>
        </div>
        <h4 className='font-display text-sm text-lux-black leading-snug group-hover:text-gold-deep transition-colors line-clamp-2'>
          {article.title}
        </h4>
        {article.description && (
          <p className='text-lux-muted text-xs leading-relaxed line-clamp-2'>{article.description}</p>
        )}
      </div>
    </a>
  );
}

function NewsCardSkeleton() {
  return (
    <div className='shrink-0 w-72 lg:w-80 animate-pulse'>
      <div className='aspect-video bg-lux-border mb-3' />
      <div className='space-y-2'>
        <div className='h-3 bg-lux-border rounded w-1/3' />
        <div className='h-4 bg-lux-border rounded w-full' />
        <div className='h-4 bg-lux-border rounded w-4/5' />
        <div className='h-3 bg-lux-border rounded w-full' />
      </div>
    </div>
  );
}

export default function BlogNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/news')
      .then((r) => r.json())
      .then((data) => { setArticles(data.articles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className='py-12 border-t border-lux-border'>
      <div className='flex items-end justify-between mb-8'>
        <div>
          <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-1'>Live Updates</p>
          <h2 className='font-display text-2xl lg:text-3xl text-lux-black'>Fashion News Today</h2>
        </div>
        <div className='flex items-center gap-2 text-xs text-lux-muted'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75' />
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500' />
          </span>
          Live feed
        </div>
      </div>

      <div className='flex gap-6 overflow-x-auto scrollbar-hide pb-4'>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : articles.map((article, i) => <NewsCard key={i} article={article} />)}
      </div>
    </section>
  );
}
