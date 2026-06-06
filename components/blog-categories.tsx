'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BLOG_CATEGORIES } from '@/lib/blog-utils';

export default function BlogCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'All';

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('offset');
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className='relative'>
      <div className='flex items-center gap-0 overflow-x-auto scrollbar-hide border-b border-lux-border'>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'relative shrink-0 px-4 py-3 text-[11px] font-semibold tracking-widest uppercase transition-colors duration-200 whitespace-nowrap',
              active === cat
                ? 'text-lux-black'
                : 'text-lux-muted hover:text-lux-dark'
            )}
          >
            {cat}
            {active === cat && (
              <span className='absolute bottom-0 left-0 right-0 h-[2px] bg-lux-black' />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
