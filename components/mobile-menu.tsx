"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AlignLeft, Pencil, PenTool, Palette, Scissors, Ruler, ChevronDown } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

interface MobileMenuProps {
  userId?: string | null;
}

const NavLinks = [
  { href: '/', key: 'Find talent', text: 'Find talent' },
  { href: '/', key: 'Inspiration', text: 'Inspiration' },
  { href: '/learn', key: 'Learn design', text: 'Learn design' },
  { href: '/', key: 'Jobs', text: 'Jobs' },
  { href: '/', key: 'Go Pro', text: 'Go Pro' }
];

const LearnItems = [
  { href: '/learn/fashion-design-basics', text: 'Fashion Design Basics', icon: PenTool },
  { href: '/learn/sketching-techniques', text: 'Sketching Techniques', icon: Pencil },
  { href: '/learn/color-theory-for-fashion', text: 'Color Theory for Fashion', icon: Palette },
  { href: '/learn/fabric-and-textiles-101', text: 'Fabric & Textiles 101', icon: Scissors },
  { href: '/learn/silhouettes-and-proportions', text: 'Silhouettes & Proportions', icon: Ruler }
];

export default function MobileMenu({ userId }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  return (
    <div className='flex lg:hidden'>
      <button
        type='button'
        aria-label='Open menu'
        onClick={() => setOpen((s) => !s)}
        className='p-2'
      >
        <AlignLeft className='w-7 h-7' />
      </button>

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      {/* panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-lg transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-lg font-semibold'>Menu</h3>
            <button onClick={() => setOpen(false)} aria-label='Close menu' className='p-1'>
              ✕
            </button>
          </div>

          <nav className='flex flex-col gap-4 mb-6'>
            {NavLinks.map((link) =>
              link.text === 'Learn design' ? (
                <div key={link.key}>
                  <button
                    onClick={() => setLearnOpen((s) => !s)}
                    className='w-full flex items-center justify-between font-medium'
                    aria-expanded={learnOpen}
                  >
                    <span>Learn design</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${learnOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`${learnOpen ? 'block' : 'hidden'} mt-3 ml-2 flex flex-col gap-3`}>
                    {LearnItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setOpen(false);
                            setLearnOpen(false);
                          }}
                          className='flex items-center gap-3 text-sm'
                        >
                          <Icon className='w-4 h-4 text-muted-foreground' />
                          {item.text}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link key={link.key} href={link.href} onClick={() => setOpen(false)} className='font-medium'>
                  {link.text}
                </Link>
              )
            )}
          </nav>

          <div className='border-t pt-4 flex flex-col gap-3'>
            {userId ? (
              <>
                <Link href='/upload-new' onClick={() => setOpen(false)} className='font-medium'>
                  Share work
                </Link>
                <Link href='/account' onClick={() => setOpen(false)} className='font-medium'>
                  Account
                </Link>
                <SignOutButton>
                  <button className='text-left font-medium'>Sign out</button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href='/sign-in' onClick={() => setOpen(false)} className='font-medium'>
                  Log in
                </Link>
                <Link href='/sign-up' onClick={() => setOpen(false)} className='font-medium'>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
