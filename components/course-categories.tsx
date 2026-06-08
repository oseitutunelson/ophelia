'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LEARN_CATEGORIES } from '@/lib/learn-utils';

export default function CourseCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') ?? '';

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === '') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('page');
    router.push(`/learn/courses?${params.toString()}`);
  }

  return (
    <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1'>
      <button
        onClick={() => select('')}
        className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
          active === ''
            ? 'bg-lux-black text-white border-lux-black'
            : 'border-lux-border text-lux-mid hover:border-lux-black hover:text-lux-black bg-white'
        }`}
      >
        All Courses
      </button>
      {LEARN_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => select(cat)}
          className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
            active === cat
              ? 'bg-lux-black text-white border-lux-black'
              : 'border-lux-border text-lux-mid hover:border-lux-black hover:text-lux-black bg-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
