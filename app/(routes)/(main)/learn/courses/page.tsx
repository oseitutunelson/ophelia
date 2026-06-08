'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react';
import axios from 'axios';
import { LEARN_CATEGORIES, COURSE_LEVELS, EXTERNAL_COURSES, type ExternalCourse } from '@/lib/learn-utils';
import CourseCard from '@/components/course-card';
import ExternalCourseCard from '@/components/external-course-card';
import CourseCategories from '@/components/course-categories';

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') ?? '';
  const level    = searchParams.get('level') ?? '';
  const search   = searchParams.get('search') ?? '';
  const isFree   = searchParams.get('free') === 'true';
  const sort     = searchParams.get('sort') ?? 'newest';

  const [courses, setCourses] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  // Filter external courses
  const externalFiltered = EXTERNAL_COURSES.filter(c => {
    if (category && c.category !== category) return false;
    if (level && level !== 'All Levels' && c.level !== level) return false;
    if (isFree && !c.isFree) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (level) params.set('level', level);
        if (search) params.set('search', search);
        if (isFree) params.set('free', 'true');
        params.set('sort', sort);
        const res = await axios.get(`/api/courses?${params.toString()}`);
        setCourses(res.data.courses ?? []);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, level, search, isFree, sort]);

  function updateParam(key: string, val: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set(key, val); else params.delete(key);
    params.delete('page');
    router.push(`/learn/courses?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam('search', searchInput);
  }

  function clearAll() {
    router.push('/learn/courses');
    setSearchInput('');
  }

  const hasFilters = !!(category || level || search || isFree);
  const totalResults = courses.length + externalFiltered.length;

  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      {/* Page header */}
      <div className='bg-gradient-to-b from-lux-black to-lux-dark'>
        <div className='max-w-[1152px] mx-auto px-6 py-12'>
          <h1 className='font-display text-4xl font-bold text-white mb-2'>Course Catalog</h1>
          <p className='text-white/60 text-sm'>
            {LEARN_CATEGORIES.length} categories · 500+ courses · Free & paid options
          </p>
          <form onSubmit={handleSearch} className='mt-6 flex gap-3 max-w-xl'>
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40' />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder='Search courses...'
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 text-sm'
              />
            </div>
            <button type='submit' className='px-5 py-3 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors duration-200'>
              Search
            </button>
          </form>
        </div>
      </div>

      <div className='max-w-[1152px] mx-auto px-6 py-8'>
        {/* Categories */}
        <div className='mb-6'>
          <CourseCategories />
        </div>

        {/* Filter bar */}
        <div className='flex flex-wrap items-center gap-3 mb-6'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2 text-sm border border-lux-border px-4 py-2 bg-white hover:border-lux-black transition-colors duration-200'
          >
            <SlidersHorizontal className='h-4 w-4' /> Filters
            {hasFilters && <span className='h-2 w-2 bg-gold rounded-full' />}
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => updateParam('sort', e.target.value)}
            className='text-sm border border-lux-border px-3 py-2 bg-white focus:outline-none focus:border-lux-black text-lux-black'
          >
            <option value='newest'>Newest</option>
            <option value='popular'>Most Popular</option>
            <option value='rating'>Top Rated</option>
            <option value='price_asc'>Price: Low to High</option>
          </select>

          {/* Free toggle */}
          <button
            onClick={() => updateParam('free', isFree ? '' : 'true')}
            className={`text-sm px-4 py-2 border transition-colors duration-200 ${isFree ? 'bg-emerald-500 text-white border-emerald-500' : 'border-lux-border text-lux-mid hover:border-lux-black bg-white'}`}
          >
            Free Only
          </button>

          {hasFilters && (
            <button onClick={clearAll} className='flex items-center gap-1.5 text-sm text-lux-muted hover:text-lux-black'>
              <X className='h-3.5 w-3.5' /> Clear all
            </button>
          )}

          {!loading && (
            <span className='text-xs text-lux-muted ml-auto'>{totalResults} courses</span>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className='mb-6 p-4 bg-white border border-lux-border grid grid-cols-2 sm:grid-cols-3 gap-4'>
            <div>
              <label className='text-xs font-medium text-lux-black mb-1.5 block'>Level</label>
              <select
                value={level}
                onChange={e => updateParam('level', e.target.value)}
                className='w-full text-sm border border-lux-border px-3 py-2 focus:outline-none focus:border-lux-black text-lux-black bg-white'
              >
                <option value=''>All Levels</option>
                {COURSE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Platform courses */}
        {!loading && courses.length > 0 && (
          <div className='mb-10'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-xs font-semibold text-gold tracking-wide uppercase bg-gold/10 px-2 py-1'>Ophelia Courses</span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {(courses as Parameters<typeof CourseCard>[0]['course'][]).map((c) => (
                <CourseCard key={(c as { id: string }).id} course={c as Parameters<typeof CourseCard>[0]['course']} />
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='bg-white border border-lux-border h-72 animate-pulse' />
            ))}
          </div>
        )}

        {/* External courses */}
        {externalFiltered.length > 0 && (
          <div>
            {courses.length > 0 && (
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-xs font-semibold text-lux-mid tracking-wide uppercase bg-lux-hover px-2 py-1'>From External Partners</span>
              </div>
            )}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {externalFiltered.map((c: ExternalCourse) => (
                <ExternalCourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && totalResults === 0 && (
          <div className='text-center py-20'>
            <BookOpen className='h-12 w-12 text-lux-muted mx-auto mb-4' />
            <p className='font-display text-xl font-bold text-lux-black mb-2'>No courses found</p>
            <p className='text-sm text-lux-muted mb-6'>Try different filters or search terms</p>
            <button onClick={clearAll} className='text-sm text-gold hover:underline'>Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LearnCoursesPage() {
  return (
    <Suspense fallback={<div className='min-h-screen pt-[72px] flex items-center justify-center'><div className='h-8 w-8 border-2 border-gold border-t-transparent animate-spin' /></div>}>
      <CoursesContent />
    </Suspense>
  );
}
