'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  'Branding',
  'Illustration',
  'Motion Design',
  'Fashion Photography',
  'Garment Design',
  'Jewelry & Accessories',
  '3D Fashion Design',
  'Sketches & Concepts',
  'NFT Fashion',
  'Pattern Making'
];

export default function HeroSection() {
  const { userId } = useAuth();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });

      /* --- entrance sequence --- */
      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          '.hero-line',
          { opacity: 0, y: 56, rotationX: 12 },
          { opacity: 1, y: 0, rotationX: 0, duration: 1.1, stagger: 0.14 },
          '-=0.45'
        )
        .fromTo(
          '.hero-body',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.85 },
          '-=0.65'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          '-=0.55'
        )
        .fromTo(
          '.hero-scroll',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.3'
        );

      /* --- parallax on scroll --- */
      gsap.to('.hero-spotlight', {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      gsap.to('.hero-content-inner', {
        yPercent: 14,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '55% top',
          end: 'bottom top',
          scrub: 1.8
        }
      });

      /* --- stats counter --- */
      gsap.fromTo(
        '.hero-stat',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.hero-stats',
            start: 'top 88%',
            once: true
          }
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]'
    >
      {/* ── layered background ── */}
      <div className='hero-spotlight absolute inset-0 pointer-events-none'>
        {/* deep ambient radial */}
        <div className='absolute inset-0 bg-gradient-radial from-[#c9a96e]/[0.04] via-transparent to-transparent'
          style={{ backgroundPosition: '50% 40%', backgroundSize: '120% 120%' }} />
        {/* centre glow */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[700px] h-[700px] rounded-full bg-[#c9a96e]/[0.05] blur-[120px]' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[340px] h-[340px] rounded-full bg-[#f8f6f0]/[0.03] blur-[70px]' />
        {/* subtle grid */}
        <div
          className='absolute inset-0 opacity-[0.025]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(248,246,240,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(248,246,240,0.4) 1px, transparent 1px)',
            backgroundSize: '90px 90px'
          }}
        />
        {/* bottom fade */}
        <div className='absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent' />
      </div>

      {/* ── main content ── */}
      <div className='hero-content-inner relative z-10 w-full max-w-[960px] mx-auto px-6 text-center pt-24 pb-16'>

        {/* eyebrow label */}
        <div className='hero-eyebrow opacity-0 flex items-center justify-center gap-3 mb-10'>
          <div className='h-px w-10 bg-[#c9a96e]/50' />
          <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>
            Creative Portfolio Platform
          </span>
          <div className='h-px w-10 bg-[#c9a96e]/50' />
        </div>

        {/* headline — Playfair Display */}
        <h1 className='font-display' style={{ perspective: '800px' }}>
          <span className='hero-line opacity-0 block text-[clamp(3.2rem,7.5vw,7.8rem)] leading-[0.92] font-bold text-[#f8f6f0] tracking-tight'>
            Discover
          </span>
          <span className='hero-line opacity-0 block text-[clamp(3.2rem,7.5vw,7.8rem)] leading-[0.92] font-bold italic text-[#c9a96e] tracking-tight'>
            World&#8209;Class
          </span>
          <span className='hero-line opacity-0 block text-[clamp(3.2rem,7.5vw,7.8rem)] leading-[0.92] font-bold text-[#f8f6f0] tracking-tight'>
            Design
          </span>
        </h1>

        {/* subheading */}
        <p className='hero-body opacity-0 mt-8 text-[#8a8a8a] text-base md:text-lg leading-relaxed max-w-[480px] mx-auto'>
          Where creative professionals gain inspiration, feedback,
          community, and career opportunities.
        </p>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mt-10'>
          <Link
            href={userId ? '/#works' : '/sign-up'}
            className='hero-cta opacity-0 group inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] px-8 py-3.5 text-luxury-label tracking-luxury transition-colors duration-300 font-semibold'
          >
            {userId ? 'Browse Works' : 'Get Started'}
            <ArrowRight size={14} className='transition-transform duration-300 group-hover:translate-x-1' />
          </Link>
          <Link
            href='/find-talent'
            className='hero-cta opacity-0 inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#c9a96e]/40 text-[#a0a0a0] hover:text-[#f8f6f0] px-8 py-3.5 text-luxury-label tracking-luxury transition-all duration-300'
          >
            Find Talent
          </Link>
        </div>

        {/* stats row */}
        <div className='hero-stats mt-16 pt-12 border-t border-[#1c1c1c] grid grid-cols-3 gap-8 max-w-[480px] mx-auto'>
          {[
            { value: '12K+', label: 'Designers' },
            { value: '48K+', label: 'Works Shared' },
            { value: '2K+', label: 'Jobs Posted' }
          ].map((s) => (
            <div key={s.label} className='hero-stat opacity-0 text-center'>
              <div className='font-display text-2xl font-bold text-[#f8f6f0]'>{s.value}</div>
              <div className='text-luxury-label text-[#525252] mt-1 tracking-luxury'>{s.label}</div>
            </div>
          ))}
        </div>
      </div>


      {/* ── marquee band ── */}
      <div className='absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[#141414] z-10'>
        <div className='flex animate-marquee whitespace-nowrap py-3'>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className='inline-flex items-center gap-4 mx-4'>
              <span className='text-luxury-label text-[#2e2e2e] tracking-luxury'>{item}</span>
              <span className='w-1 h-1 rounded-full bg-[#c9a96e]/30' />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
