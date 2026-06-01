'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import useOrigin from '@/hooks/use-origin';
import { Input } from '@/components/ui/input';

export default function SearchInput() {
  const router = useRouter();
  const origin = useOrigin();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState('');

  const category = searchParams.get('category');

  const handleSearch = () => {
    if (category === null) {
      router.push(`${origin}?search=${searchVal}`);
    } else {
      router.push(`${origin}?search=${searchVal}&category=${category}`);
    }
  };

  const handleMobileSearch = () => {
    if (category === null) {
      router.push(`${origin}?search=`);
    } else {
      router.push(`${origin}?search=&category=${category}`);
    }
  };

  return (
    <>
      <form action={handleSearch}>
        <div className='hidden xl:flex items-center h-9 border border-lux-border focus-within:border-lux-black/25 bg-white transition-colors duration-300 px-3 gap-2'>
          <Search className='h-3.5 w-3.5 text-lux-subtle flex-shrink-0' />
          <Input
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder='Search...'
            className='h-7 border-none shadow-none pl-0 focus-visible:ring-0 bg-transparent text-lux-black placeholder:text-lux-subtle text-sm w-36'
          />
        </div>
      </form>
      <Search
        onClick={handleMobileSearch}
        className='h-5 w-5 xl:hidden text-lux-mid hover:text-lux-black transition-colors duration-300 cursor-pointer'
      />
    </>
  );
}
