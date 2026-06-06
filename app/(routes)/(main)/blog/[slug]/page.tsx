import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { clerkClient } from '@clerk/nextjs';
import { Clock, Eye, ArrowLeft, PenSquare } from 'lucide-react';
import { format } from 'date-fns';

import db from '@/lib/db';
import BlogPostActions from '@/components/blog-post-actions';
import BlogCommentsSection from '@/components/blog-comments-section';

type Props = { params: { slug: string } };

async function getPost(slug: string) {
  const post = await db.blogPost.findUnique({
    where: { slug, status: 'published' },
    include: { _count: { select: { likes: true, comments: true, bookmarks: true } } },
  });
  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.title} | Ophelia Journal`,
    description: post.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || '',
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Increment view count
  await db.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

  const [profile, clerkUsersResult] = await Promise.all([
    db.profile.findFirst({ where: { userId: post.authorId } }),
    clerkClient.users.getUserList({ userId: [post.authorId] }).catch(() => []),
  ]);

  const clerkUsers = Array.isArray(clerkUsersResult) ? clerkUsersResult : [];
  const clerkUser = clerkUsers[0];
  const authorName = clerkUser
    ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || profile?.username || 'Author'
    : profile?.username || 'Author';
  const authorAvatar = profile?.profilePicture || clerkUser?.imageUrl || null;
  const authorUsername = profile?.username || 'author';

  // Related posts
  const relatedPosts = await db.blogPost.findMany({
    take: 3,
    where: { status: 'published', category: post.category, id: { not: post.id } },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { likes: true, comments: true, bookmarks: true } } },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.coverImage || '',
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'Ophelia', logo: '' },
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className='pt-20 pb-24 bg-white min-h-screen'>
        {/* Back nav */}
        <div className='max-w-4xl mx-auto px-5 lg:px-0 pt-8 mb-6'>
          <Link href='/blog' className='inline-flex items-center gap-2 text-lux-muted hover:text-lux-black text-sm transition-colors'>
            <ArrowLeft className='w-4 h-4' /> Back to Journal
          </Link>
        </div>

        {/* Hero */}
        <article className='max-w-4xl mx-auto px-5 lg:px-0'>
          {/* Category + Meta */}
          <header className='mb-8'>
            <span className='inline-block text-[11px] font-bold tracking-widest uppercase text-gold border border-gold/30 px-3 py-1.5 mb-4'>
              {post.category}
            </span>
            <h1 className='font-display text-4xl lg:text-6xl text-lux-black leading-tight mb-5'>
              {post.title}
            </h1>
            {post.excerpt && (
              <p className='text-lux-mid text-lg leading-relaxed mb-6 max-w-2xl'>{post.excerpt}</p>
            )}

            {/* Author bar */}
            <div className='flex items-center gap-4 pb-6 border-b border-lux-border'>
              <Link href={`/${authorUsername}`}>
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    width={44}
                    height={44}
                    className='w-11 h-11 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-11 h-11 rounded-full bg-lux-border flex items-center justify-center text-lux-mid text-sm font-semibold'>
                    {authorName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </Link>
              <div className='flex-1'>
                <Link href={`/${authorUsername}`} className='text-sm font-semibold text-lux-black hover:text-gold-deep transition-colors'>
                  {authorName}
                </Link>
                <div className='flex items-center gap-3 text-xs text-lux-muted mt-0.5'>
                  <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                  <span>·</span>
                  <span className='flex items-center gap-1'><Clock className='w-3.5 h-3.5' />{post.readTime} min read</span>
                  <span>·</span>
                  <span className='flex items-center gap-1'><Eye className='w-3.5 h-3.5' />{post.viewCount.toLocaleString()} views</span>
                </div>
              </div>

              {/* Sticky action bar */}
              <BlogPostActions
                slug={post.slug}
                initialLikes={post._count.likes}
                initialBookmarks={post._count.bookmarks}
                authorId={post.authorId}
              />
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className='relative aspect-[16/8] overflow-hidden mb-12'>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className='object-cover'
                priority
              />
            </div>
          )}

          {/* Article content */}
          <div
            className='prose prose-lg prose-ophelia max-w-none'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-12 pt-8 border-t border-lux-border'>
              {post.tags.map((tag) => (
                <span key={tag} className='text-xs text-lux-mid bg-lux-hover px-3 py-1.5 rounded-sm'>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author card */}
          <div className='mt-12 p-6 bg-lux-bg border border-lux-border flex gap-5 items-start'>
            <Link href={`/${authorUsername}`}>
              {authorAvatar ? (
                <Image src={authorAvatar} alt={authorName} width={64} height={64} className='w-16 h-16 rounded-full object-cover shrink-0' />
              ) : (
                <div className='w-16 h-16 rounded-full bg-lux-border flex items-center justify-center text-lux-mid font-semibold text-lg shrink-0'>
                  {authorName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </Link>
            <div>
              <p className='text-[10px] font-bold tracking-widest uppercase text-lux-muted mb-1'>Written by</p>
              <Link href={`/${authorUsername}`} className='font-display text-xl text-lux-black hover:text-gold-deep transition-colors'>
                {authorName}
              </Link>
              {profile?.bio && <p className='text-lux-mid text-sm mt-2 leading-relaxed'>{profile.bio}</p>}
              <Link href={`/${authorUsername}`} className='inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-lux-black border border-lux-border px-4 py-1.5 hover:bg-lux-hover transition-colors'>
                <PenSquare className='w-3.5 h-3.5' /> View Profile
              </Link>
            </div>
          </div>

          {/* Comments */}
          <BlogCommentsSection slug={post.slug} commentCount={post._count.comments} />
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className='max-w-7xl mx-auto px-5 lg:px-12 mt-20 pt-12 border-t border-lux-border'>
            <div className='mb-8'>
              <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-1'>More Like This</p>
              <h2 className='font-display text-2xl text-lux-black'>Related Articles</h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className='group block'>
                  <div className='relative overflow-hidden aspect-[4/3] mb-3'>
                    {rp.coverImage ? (
                      <Image src={rp.coverImage} alt={rp.title} fill className='object-cover transition-transform duration-500 group-hover:scale-105' />
                    ) : (
                      <div className='w-full h-full bg-lux-border' />
                    )}
                    <div className='absolute top-3 left-3'>
                      <span className='text-[10px] font-bold tracking-wider uppercase bg-white/90 text-lux-black px-2.5 py-1'>
                        {rp.category}
                      </span>
                    </div>
                  </div>
                  <h3 className='font-display text-lg text-lux-black group-hover:text-gold-deep transition-colors line-clamp-2'>
                    {rp.title}
                  </h3>
                  <p className='text-xs text-lux-muted mt-1.5'>{rp.readTime} min read</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
