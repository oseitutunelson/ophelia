'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { BookOpen, GraduationCap, Pencil, Camera, Palette, Scissors, Cpu } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const QuickCategories = [
  { href: '/learn/courses?category=Fashion+Design',       text: 'Fashion Design',       icon: Pencil },
  { href: '/learn/courses?category=Fashion+Photography',  text: 'Fashion Photography',  icon: Camera },
  { href: '/learn/courses?category=Fashion+Illustration', text: 'Fashion Illustration', icon: Palette },
  { href: '/learn/courses?category=Pattern+Making',       text: 'Pattern Making',       icon: Scissors },
  { href: '/learn/courses?category=AI+for+Fashion+Creators', text: 'AI for Fashion',   icon: Cpu },
];

export default function LearnDropdown() {
  const [open, setOpen] = React.useState(false);
  const hoverTimeout = React.useRef<number | null>(null);

  const openMenu = () => {
    if (hoverTimeout.current) { window.clearTimeout(hoverTimeout.current); hoverTimeout.current = null; }
    setOpen(true);
  };

  const closeMenu = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setOpen(false), 150) as unknown as number;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
        <DropdownMenuTrigger asChild>
          <button className='flex items-center text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black transition-colors duration-300'>
            Learn Design <ChevronDownIcon className='ml-1' />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          className='min-w-[22rem] p-3'
        >
          {/* Main hub link */}
          <DropdownMenuItem asChild className='px-4 py-3 cursor-pointer mb-1'>
            <Link href='/learn' className='w-full flex items-center gap-4'>
              <div className='h-9 w-9 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0'>
                <BookOpen className='h-4 w-4 text-[#c9a96e]' />
              </div>
              <div>
                <p className='text-sm font-semibold text-lux-black'>Learning Hub</p>
                <p className='text-xs text-lux-muted'>Browse all 500+ courses</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Quick categories */}
          {QuickCategories.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} asChild className='px-4 py-2.5 cursor-pointer'>
                <Link href={item.href} className='w-full flex items-center gap-4'>
                  <Icon className='h-4 w-4 text-lux-muted flex-shrink-0' />
                  <span className='text-sm font-medium'>{item.text}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          {/* Become instructor */}
          <DropdownMenuItem asChild className='px-4 py-3 cursor-pointer'>
            <Link href='/teach' className='w-full flex items-center gap-4'>
              <GraduationCap className='h-4 w-4 text-[#c9a96e] flex-shrink-0' />
              <div>
                <p className='text-sm font-semibold text-lux-black'>Become an Instructor</p>
                <p className='text-xs text-lux-muted'>Share your expertise & earn</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
