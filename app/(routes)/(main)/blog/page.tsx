import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { clerkClient } from '@clerk/nextjs';
import { PenSquare } from 'lucide-react';

import db from '@/lib/db';
import BlogCard, { type BlogPostMeta } from '@/components/blog-card';
import BlogCategories from '@/components/blog-categories';
import BlogNewsSection from '@/components/blog-news-section';

export const metadata: Metadata = {
  title: 'Fashion Blog | Ophelia',
  description: 'Discover the latest fashion news, trends, designer stories, and editorial content from the Ophelia community.',
};

export const dynamic = 'force-dynamic';

type PageProps = { searchParams: { category?: string; sort?: string; search?: string } };

async function getPostsWithAuthors(
  where: Record<string, unknown>,
  limit: number
): Promise<BlogPostMeta[]> {
  const posts = await db.blogPost.findMany({
    take: limit,
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { likes: true, comments: true, bookmarks: true } } },
  });

  if (posts.length === 0) return [];

  const authorIds = Array.from(new Set(posts.map((p) => p.authorId)));
  const [profiles, clerkUsers] = await Promise.all([
    db.profile.findMany({ where: { userId: { in: authorIds } } }),
    clerkClient.users.getUserList({ userId: authorIds }).catch(() => []),
  ]);

  const profileMap = new Map(profiles.map((p) => [p.userId, p]));
  const clerkMap = new Map(
    Array.isArray(clerkUsers) ? clerkUsers.map((u) => [u.id, u]) : []
  );

  return posts.map((post) => {
    const profile = profileMap.get(post.authorId);
    const clerk = clerkMap.get(post.authorId);
    return {
      ...post,
      author: {
        username: profile?.username || 'author',
        profilePicture: profile?.profilePicture || clerk?.imageUrl || null,
        displayName:
          clerk
            ? [clerk.firstName, clerk.lastName].filter(Boolean).join(' ') || profile?.username || 'Author'
            : profile?.username || 'Author',
      },
    } as BlogPostMeta;
  });
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category, search } = searchParams;

  const baseWhere: Record<string, unknown> = {
    status: 'published',
    ...(category && category !== 'All' && { category }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [featuredPosts, latestPosts, trendingPosts] = await Promise.all([
    getPostsWithAuthors({ ...baseWhere, featured: true }, 1),
    getPostsWithAuthors(baseWhere, 12),
    db.blogPost.findMany({
      take: 5,
      where: {
        status: 'published',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { viewCount: 'desc' },
      select: { id: true, slug: true, title: true, category: true, excerpt: true, coverImage: true, tags: true, authorId: true, readTime: true, viewCount: true, featured: true, createdAt: true, _count: { select: { likes: true, comments: true, bookmarks: true } } },
    }),
  ]);

  const heroPost = featuredPosts[0] || latestPosts[0];
  const gridPosts = latestPosts.slice(heroPost ? 1 : 0);

  return (
    <main className='pt-20 pb-20 bg-lux-bg min-h-screen'>
      {/* ── Masthead ── */}
      <header className='border-b border-lux-border bg-white'>
        <div className='max-w-7xl mx-auto px-5 lg:px-12 py-8 flex flex-col md:flex-row md:items-end justify-between gap-4'>
          <div>
            <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-2'>
              The Ophelia Journal
            </p>
            <h1 className='font-display text-4xl lg:text-6xl text-lux-black'>Fashion &amp; Culture</h1>
            <p className='text-lux-mid text-sm mt-2 max-w-lg'>
              Stories, trends, and perspectives from fashion's most creative minds.
            </p>
          </div>
          <Link
            href='/blog/new'
            className='self-start md:self-end flex items-center gap-2 px-6 py-3 bg-lux-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-lux-dark transition-colors'
          >
            <PenSquare className='w-4 h-4' />
            Write an Article
          </Link>
        </div>

        {/* Category filter */}
        <div className='max-w-7xl mx-auto px-5 lg:px-12'>
          <Suspense>
            <BlogCategories />
          </Suspense>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-5 lg:px-12'>
        {/* ── Hero featured post ── */}
        {heroPost && (
          <section className='mt-10'>
            <BlogCard post={heroPost} variant='featured' />
          </section>
        )}

        {/* ── Main content grid ── */}
        {gridPosts.length > 0 && (
          <section className='mt-12'>
            <div className='flex items-end justify-between mb-6'>
              <div>
                <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-1'>Latest</p>
                <h2 className='font-display text-2xl text-lux-black'>Recent Stories</h2>
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {gridPosts.slice(0, 4).map((post) => (
                <BlogCard key={post.id} post={post} variant='large' />
              ))}
            </div>
          </section>
        )}

        {/* ── Fashion News Today ── */}
        <BlogNewsSection />

        {/* ── More articles + Trending sidebar ── */}
        {gridPosts.length > 4 && (
          <section className='mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* More articles */}
            <div className='lg:col-span-2'>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-1'>Explore</p>
                  <h2 className='font-display text-2xl text-lux-black'>More Stories</h2>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                {gridPosts.slice(4).map((post) => (
                  <BlogCard key={post.id} post={post} variant='medium' />
                ))}
              </div>
            </div>

            {/* Trending sidebar */}
            {trendingPosts.length > 0 && (
              <aside>
                <div className='mb-5'>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-1'>This Week</p>
                  <h2 className='font-display text-xl text-lux-black'>Trending</h2>
                </div>
                <div className='bg-white border border-lux-border p-5'>
                  {(trendingPosts as BlogPostMeta[]).map((post, i) => (
                    <div key={post.id} className='flex items-start gap-4 py-4 border-b border-lux-border last:border-0'>
                      <span className='font-display text-3xl text-lux-border font-bold shrink-0 leading-none mt-1'>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className='text-[10px] font-bold tracking-wider uppercase text-gold'>{post.category}</span>
                        <Link href={`/blog/${post.slug}`} className='block font-display text-sm text-lux-black hover:text-gold-deep transition-colors mt-0.5 leading-snug'>
                          {post.title}
                        </Link>
                        <p className='text-[11px] text-lux-muted mt-1'>{post.viewCount} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </section>
        )}

        {/* Empty state */}
        {latestPosts.length === 0 && (
          <div className='text-center py-24'>
            <p className='font-display text-2xl text-lux-black mb-3'>No articles yet</p>
            <p className='text-lux-muted text-sm mb-8'>Be the first to share your fashion story with the community.</p>
            <Link
              href='/blog/new'
              className='inline-flex items-center gap-2 px-8 py-3 bg-lux-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-lux-dark transition-colors'
            >
              <PenSquare className='w-4 h-4' />
              Write the First Article
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
