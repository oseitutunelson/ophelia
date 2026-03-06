"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Filter } from 'lucide-react';

interface TalentFilterProps {
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (search: string) => void;
  selectedCategory?: string;
}

export default function TalentFilter({
  onCategoryChange,
  onSearchChange,
  selectedCategory = 'all'
}: TalentFilterProps) {
  const fashionCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion-design', label: 'Fashion Design' },
    { value: 'tailor-seamstress', label: 'Tailor/Seamstress' },
    { value: 'pattern-making', label: 'Pattern Making' },
    { value: 'fashion-styling', label: 'Fashion Styling' },
    { value: 'wardrobe-consulting', label: 'Wardrobe Consulting' },
    { value: 'fashion-marketing', label: 'Fashion Marketing' },
    { value: 'fashion-writing', label: 'Fashion Writing' },
    { value: 'other-fashion', label: 'Other Fashion Jobs' }
  ];

  return (
    <div className='flex flex-wrap gap-3 items-center'>
      <Button
        variant='outline'
        className='flex items-center gap-2 rounded-lg border-[#e7e7e9] hover:bg-transparent'
      >
        <Filter className='w-4 h-4' />
        Filter
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 rounded-lg border-[#e7e7e9] hover:bg-transparent'
          >
            Categories
            <ChevronDownIcon className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          {fashionCategories.map(cat => (
            <DropdownMenuItem
              key={cat.value}
              onClick={() => onCategoryChange?.(cat.value)}
              className={
                selectedCategory === cat.value ? 'bg-gray-100' : ''
              }
            >
              {cat.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 rounded-lg border-[#e7e7e9] hover:bg-transparent'
          >
            Budget
            <ChevronDownIcon className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          <DropdownMenuItem>Under $50</DropdownMenuItem>
          <DropdownMenuItem>$50 - $100</DropdownMenuItem>
          <DropdownMenuItem>$100 - $500</DropdownMenuItem>
          <DropdownMenuItem>$500+</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 rounded-lg border-[#e7e7e9] hover:bg-transparent'
          >
            Location
            <ChevronDownIcon className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          <DropdownMenuItem>Anywhere</DropdownMenuItem>
          <DropdownMenuItem>North America</DropdownMenuItem>
          <DropdownMenuItem>Europe</DropdownMenuItem>
          <DropdownMenuItem>Asia</DropdownMenuItem>
          <DropdownMenuItem>Africa</DropdownMenuItem>
          <DropdownMenuItem>South America</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 rounded-lg border-[#e7e7e9] hover:bg-transparent'
          >
            Rating
            <ChevronDownIcon className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          <DropdownMenuItem>★★★★★ (5 stars)</DropdownMenuItem>
          <DropdownMenuItem>★★★★ and up (4+)</DropdownMenuItem>
          <DropdownMenuItem>★★★ and up (3+)</DropdownMenuItem>
          <DropdownMenuItem>All ratings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 rounded-lg border-[#e7e7e9] hover:bg-transparent'
          >
            More
            <ChevronDownIcon className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          <DropdownMenuItem>Verified Talent</DropdownMenuItem>
          <DropdownMenuItem>Recently Active</DropdownMenuItem>
          <DropdownMenuItem>New Talent</DropdownMenuItem>
          <DropdownMenuItem>Most Bookmarked</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
