"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Pencil, PenTool, Palette, Scissors, Ruler } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

const LearnItems = [
  { href: '/learn/fashion-design-basics', text: 'Fashion Design Basics', icon: PenTool },
  { href: '/learn/sketching-techniques', text: 'Sketching Techniques', icon: Pencil },
  { href: '/learn/color-theory-for-fashion', text: 'Color Theory for Fashion', icon: Palette },
  { href: '/learn/fabric-and-textiles-101', text: 'Fabric & Textiles 101', icon: Scissors },
  { href: '/learn/silhouettes-and-proportions', text: 'Silhouettes & Proportions', icon: Ruler }
];

export default function LearnDropdown() {
  const [open, setOpen] = React.useState(false);
  const hoverTimeout = React.useRef<number | null>(null);

  const openMenu = () => {
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setOpen(true);
  };

  const closeMenu = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    // small delay to allow moving between trigger and content
    hoverTimeout.current = window.setTimeout(() => setOpen(false), 150) as unknown as number;
  };

  return (
    <DropdownMenu open={open} onOpenChange={(v) => setOpen(v)}>
      <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
        <DropdownMenuTrigger asChild>
          <button className='flex items-center hover:opacity-80'>
            Learn design <ChevronDownIcon className='ml-1' />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          className='min-w-[22rem] p-3'
        >
          {LearnItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} asChild className='px-4 py-3 cursor-pointer'>
                <Link href={item.href} className='w-full flex items-center gap-4'>
                  <Icon className='h-5 w-5 text-muted-foreground' />
                  <span className='text-base font-medium'>{item.text}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
