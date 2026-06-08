import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Users, Award, Star, ArrowRight, Play, Flame, TrendingUp, Sparkles, GraduationCap } from 'lucide-react';
import db from '@/lib/db';
import { LEARN_CATEGORIES, EXTERNAL_COURSES, CATEGORY_GRADIENTS } from '@/lib/learn-utils';
import CourseCard from '@/components/course-card';
import ExternalCourseCard from '@/components/external-course-card';
import InstructorCard from '@/components/instructor-card';
import { clerkClient } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Learn Design | Ophelia Academy',
  description: 'Master fashion design, photography, styling, sketching, tattoos, branding, and more from industry professionals.',
};

async function getPublishedCourses() {
  try {
    return await db.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { instructor: true },
    });
  } catch { return []; }
}

async function getFeaturedInstructors() {
  try {
    const instructors = await db.instructor.findMany({
      take: 4,
      orderBy: { totalStudents: 'desc' },
    });
    const userIds = instructors.map(i => i.userId);
    if (userIds.length === 0) return [];
    const users = userIds.length > 0
      ? await clerkClient.users.getUserList({ userId: userIds })
      : [];
    return instructors.map(inst => {
      const user = users.find((u: { id: string }) => u.id === inst.userId);
      return { ...inst, name: user ? `${user.firstName} ${user.lastName}`.trim() : 'Instructor', imageUrl: user?.imageUrl };
    });
  } catch { return []; }
}

const HERO_STATS = [
  { label: 'Courses',    value: '500+',  icon: BookOpen },
  { label: 'Learners',   value: '50K+',  icon: Users },
  { label: 'Instructors',value: '100+',  icon: GraduationCap },
  { label: 'Certificates',value: '10K+', icon: Award },
];

const CATEGORY_ICONS: Partial<Record<string, string>> = {
  'Fashion Design': '✏️', 'Fashion Photography': '📸', 'Fashion Styling': '👗',
  'Pattern Making': '📐', 'Sewing & Garment Construction': '🧵',
  'Digital Illustration': '🖥️', 'Adobe Illustrator': '🎨',
  'Fashion Business': '💼', 'Tattoo Design': '🖊️', 'Luxury Fashion': '✦',
  'Streetwear Design': '🧢', 'AI for Fashion Creators': '🤖',
};

export default async function LearnPage() {
  const [platformCourses, featuredInstructors] = await Promise.all([
    getPublishedCourses(),
    getFeaturedInstructors(),
  ]);

  const trendingExternal = EXTERNAL_COURSES.slice(0, 4);
  const newExternal = EXTERNAL_COURSES.slice(4, 8);
  const freeExternal = EXTERNAL_COURSES.filter(c => c.isFree).slice(0, 4);
  const highlightCategories = LEARN_CATEGORIES.slice(0, 12);

  return (
    <div className='min-h-screen bg-lux-bg'>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className='relative bg-lux-black overflow-hidden pt-[72px]'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2218] to-[#1a1a1a]' />
        {/* Subtle gold grid overlay */}
        <div className='absolute inset-0 opacity-5' style={{
          backgroundImage: 'linear-gradient(#c9a96e 1px, transparent 1px), linear-gradient(90deg, #c9a96e 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className='relative max-w-[1152px] mx-auto px-6 pt-20 pb-20 text-center'>
          <div className='inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-xs px-4 py-2 mb-6'>
            <Sparkles className='h-3.5 w-3.5' />
            <span className='tracking-[0.2em] uppercase'>Ophelia Academy</span>
          </div>

          <h1 className='font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto'>
            Learn Fashion.{' '}
            <span className='text-[#c9a96e]'>Build Skills.</span>{' '}
            Launch Your Creative Career.
          </h1>

          <p className='text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed'>
            Master fashion design, photography, styling, sketching, tattoos, branding, and more
            from industry professionals around the world.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'>
            <Link
              href='/learn/courses'
              className='flex items-center gap-2 px-8 py-4 bg-[#c9a96e] text-white font-semibold text-sm hover:bg-[#b8963d] transition-colors duration-300'
            >
              <BookOpen className='h-4 w-4' /> Explore Courses
            </Link>
            <Link
              href='/teach'
              className='flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors duration-300'
            >
              <GraduationCap className='h-4 w-4' /> Become an Instructor
            </Link>
          </div>

          {/* Stats bar */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10'>
            {HERO_STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className='bg-white/5 px-6 py-5'>
                <Icon className='h-5 w-5 text-[#c9a96e] mx-auto mb-2' />
                <p className='text-2xl font-bold text-white font-display'>{value}</p>
                <p className='text-xs text-white/50 mt-0.5'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ────────────────────────────────────── */}
      <section className='max-w-[1152px] mx-auto px-6 py-16'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='font-display text-3xl font-bold text-lux-black'>Browse by Category</h2>
            <p className='text-lux-mid text-sm mt-1'>{LEARN_CATEGORIES.length} categories — from fashion basics to AI-powered design</p>
          </div>
          <Link href='/learn/courses' className='hidden sm:flex items-center gap-1.5 text-sm text-gold hover:underline'>
            View all <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
          {highlightCategories.map(cat => {
            const gradient = CATEGORY_GRADIENTS[cat] ?? 'from-neutral-100 to-stone-50';
            const emoji = CATEGORY_ICONS[cat] ?? '🎨';
            return (
              <Link
                key={cat}
                href={`/learn/courses?category=${encodeURIComponent(cat)}`}
                className={`group flex flex-col items-center justify-center text-center p-5 bg-gradient-to-br ${gradient} border border-transparent hover:border-lux-border hover:shadow-card transition-all duration-300 rounded-sm`}
              >
                <span className='text-2xl mb-2'>{emoji}</span>
                <span className='text-xs font-semibold text-lux-black group-hover:text-gold transition-colors duration-200 leading-tight'>
                  {cat}
                </span>
              </Link>
            );
          })}
          <Link
            href='/learn/courses'
            className='flex flex-col items-center justify-center text-center p-5 border border-lux-border hover:border-lux-black bg-white hover:shadow-card transition-all duration-300 rounded-sm'
          >
            <ArrowRight className='h-5 w-5 text-lux-muted mb-2' />
            <span className='text-xs font-semibold text-lux-mid'>All {LEARN_CATEGORIES.length} Categories</span>
          </Link>
        </div>
      </section>

      {/* ── OPHELIA COURSES (if any published) ─────────────────── */}
      {platformCourses.length > 0 && (
        <section className='max-w-[1152px] mx-auto px-6 pb-16'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <Star className='h-5 w-5 text-gold fill-gold' />
              <h2 className='font-display text-3xl font-bold text-lux-black'>Ophelia Courses</h2>
            </div>
            <Link href='/learn/courses' className='flex items-center gap-1.5 text-sm text-gold hover:underline'>
              See all <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {platformCourses.map(course => (
              <CourseCard key={course.id} course={{ ...course, instructorName: 'Ophelia Instructor' }} />
            ))}
          </div>
        </section>
      )}

      {/* ── TRENDING NOW ───────────────────────────────────────── */}
      <section className='bg-white border-y border-lux-border py-16'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <TrendingUp className='h-5 w-5 text-[#c9a96e]' />
              <div>
                <h2 className='font-display text-3xl font-bold text-lux-black'>Trending This Week</h2>
                <p className='text-sm text-lux-muted mt-1'>Most popular across all fashion categories</p>
              </div>
            </div>
            <Link href='/learn/courses?sort=popular' className='hidden sm:flex items-center gap-1.5 text-sm text-gold hover:underline'>
              View all <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {trendingExternal.map(course => (
              <ExternalCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW COURSES ────────────────────────────────────────── */}
      <section className='max-w-[1152px] mx-auto px-6 py-16'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <Sparkles className='h-5 w-5 text-[#c9a96e]' />
            <div>
              <h2 className='font-display text-3xl font-bold text-lux-black'>New Releases</h2>
              <p className='text-sm text-lux-muted mt-1'>Fresh courses added this month</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {newExternal.map(course => (
            <ExternalCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ── FREE COURSES ───────────────────────────────────────── */}
      <section className='bg-gradient-to-br from-emerald-50 to-teal-50 border-y border-emerald-100 py-16'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <span className='text-xs font-semibold text-emerald-600 tracking-wide uppercase'>Free Resources</span>
              <h2 className='font-display text-3xl font-bold text-lux-black mt-1'>Start Learning for Free</h2>
              <p className='text-sm text-lux-mid mt-1'>No payment required. Start immediately.</p>
            </div>
            <Link href='/learn/courses?free=true' className='hidden sm:flex items-center gap-1.5 text-sm text-emerald-600 hover:underline font-medium'>
              All free courses <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {freeExternal.map(course => (
              <ExternalCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED INSTRUCTORS ───────────────────────────────── */}
      {featuredInstructors.length > 0 && (
        <section className='max-w-[1152px] mx-auto px-6 py-16'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='font-display text-3xl font-bold text-lux-black'>Featured Instructors</h2>
              <p className='text-sm text-lux-muted mt-1'>Learn from industry professionals</p>
            </div>
            <Link href='/teach' className='flex items-center gap-1.5 text-sm text-gold hover:underline'>
              Become one <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {featuredInstructors.map((inst) => (
              <InstructorCard
                key={inst.id}
                name={(inst as { name?: string }).name ?? 'Instructor'}
                imageUrl={(inst as { imageUrl?: string }).imageUrl}
                bio={inst.bio}
                expertise={inst.expertise}
                totalStudents={inst.totalStudents}
                totalCourses={inst.totalCourses}
                rating={inst.rating}
                isVerified={inst.isVerified}
                userId={inst.userId}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── BECOME INSTRUCTOR CTA ──────────────────────────────── */}
      <section className='bg-lux-black py-20'>
        <div className='max-w-[1152px] mx-auto px-6 text-center'>
          <GraduationCap className='h-12 w-12 text-gold mx-auto mb-4' />
          <h2 className='font-display text-4xl font-bold text-white mb-4'>
            Share Your Expertise
          </h2>
          <p className='text-white/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed'>
            Teach the next generation of fashion creatives. Share your knowledge, build your audience,
            and earn from your passion.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link
              href='/teach'
              className='px-8 py-4 bg-gold text-white font-semibold text-sm hover:bg-gold-deep transition-colors duration-300'
            >
              Become an Instructor
            </Link>
            <Link
              href='/teach/apply'
              className='px-8 py-4 border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors duration-300'
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
