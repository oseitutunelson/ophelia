'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

import LearnDropdown from '@/components/learn-dropdown';
import ProfileMenu from '@/components/profile-menu';
import SearchInput from '@/components/search-input';
import MobileMenu from '@/components/mobile-menu';

const NAV_LINKS = [
  { href: '/find-talent', text: 'Find Talent' },
  { href: '/',            text: 'Inspiration' },
  { href: '/',            text: 'Learn Design', isDropdown: true },
  { href: '/jobs',        text: 'Jobs' }
];

export default function Navbar() {
  const { userId } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.style.background = 'rgba(248, 246, 241, 0.92)';
        nav.style.backdropFilter = 'blur(20px) saturate(180%)';
        nav.style.borderBottom = '1px solid rgba(229, 225, 217, 0.8)';
        nav.style.boxShadow = '0 1px 24px rgba(0,0,0,0.05)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderBottom = '1px solid transparent';
        nav.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px] px-6 lg:px-12 transition-[background,backdrop-filter,border-color,box-shadow] duration-500'
      style={{ borderBottom: '1px solid transparent' }}
    >
      {/* ── left nav links ── */}
      <div className='flex items-center gap-1 flex-1'>
        <MobileMenu userId={userId} />

        <Link href='/' className='lg:hidden mr-6'>
          <Image
            src='/ophelia-dark.png'
            alt='Ophelia'
            width={140}
            height={44}
            className='h-11 w-auto'
            priority
          />
        </Link>

        <ul className='hidden lg:flex items-center gap-8'>
          {NAV_LINKS.map((link) =>
            link.isDropdown ? (
              <li key={link.text}><LearnDropdown /></li>
            ) : (
              <li key={link.text}>
                <Link
                  href={link.href}
                  className='text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black transition-colors duration-300'
                >
                  {link.text}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      {/* ── centre logo ── */}
      <Link href='/' className='hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center'>
        <Image
          src='/ophelia-dark.png'
          alt='Ophelia'
          width={160}
          height={52}
          className='h-14 w-auto'
          priority
        />
      </Link>

      {/* ── right actions ── */}
      <div className='flex items-center justify-end gap-4 flex-1'>
        {userId ? (
          <>
            <SearchInput />
            <Link
              href='/upload-new'
              className='hidden xl:flex items-center text-luxury-label tracking-luxury text-white bg-lux-black hover:bg-lux-dark transition-colors duration-300 px-5 py-2.5 font-semibold'
            >
              Share Work
            </Link>
            <ProfileMenu />
          </>
        ) : (
          <>
            <SearchInput />
            <Link
              href='/sign-in'
              className='hidden lg:flex text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black transition-colors duration-300'
            >
              Log In
            </Link>
            <Link
              href='/sign-up'
              className='flex items-center text-luxury-label tracking-luxury text-white bg-lux-black hover:bg-lux-dark transition-colors duration-300 px-5 py-2.5 font-semibold'
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
