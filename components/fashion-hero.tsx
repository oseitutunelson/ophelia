'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TAGS = [
  'Branding', 'Illustration', 'Motion Design', 'Fashion Photography',
  'Garment Design', 'Jewelry & Accessories', '3D Fashion', 'Pattern Making',
  'Sketches & Concepts', 'Metaverse Wearables', 'Editorial Design', 'Textile Art'
];

const LEFT_INFO = [
  { label: 'Season',   value: 'SS 2025' },
  { label: 'Platform', value: 'Editorial' }
];
const RIGHT_INFO = [
  { label: 'Designers',    value: '12K+' },
  { label: 'Works Shared', value: '48K+' }
];

export default function FashionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      /* ── Initial states ───────────────────────────────────── */
      gsap.set('.lb-top',         { yPercent: -100 });
      gsap.set('.lb-bot',         { yPercent:  100 });
      gsap.set('.campaign-label', { opacity: 0, y: 14 });
      gsap.set('.edit-left',      { opacity: 0, x: -28 });
      gsap.set('.edit-right',     { opacity: 0, x:  28 });
      gsap.set('.dress-wrap',     { opacity: 0, scale: 0.9 });
      gsap.set('.hero-tagline',   { opacity: 0, y: 28 });
      gsap.set('.hero-cta-wrap',  { opacity: 0, y: 18 });
      gsap.set('.scroll-cue',     { opacity: 0 });

      /* ── Cinematic entry timeline ─────────────────────────── */
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } });

      tl
        /* bars sweep in */
        .to('.lb-top', { yPercent: 0, duration: 0.5 })
        .to('.lb-bot', { yPercent: 0, duration: 0.5 }, '<')

        /* campaign label fades in behind bars */
        .to('.campaign-label', { opacity: 1, y: 0, duration: 0.6 }, '-=0.1')

        /* dress blooms in while bars frame it */
        .to('.dress-wrap', { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.3')

        /* grand reveal — bars retract */
        .to('.lb-top', { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '+=0.45')
        .to('.lb-bot', { yPercent:  100, duration: 0.85, ease: 'expo.inOut' }, '<')

        /* editorial panels slide in */
        .to('.edit-left',  { opacity: 1, x: 0, duration: 0.75 }, '-=0.35')
        .to('.edit-right', { opacity: 1, x: 0, duration: 0.75 }, '<0.08')

        /* tagline + CTAs + scroll cue */
        .to('.hero-tagline',  { opacity: 1, y: 0, duration: 0.7  }, '-=0.35')
        .to('.hero-cta-wrap', { opacity: 1, y: 0, duration: 0.6  }, '-=0.4')
        .to('.scroll-cue',    { opacity: 1,        duration: 0.45 }, '-=0.2');

      /* ── Idle levitation float ────────────────────────────── */
      gsap.to('.dress-float', {
        y: -16,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      /* ── 3D mouse-follow tilt ─────────────────────────────── */
      const onMove = (e: MouseEvent) => {
        const r  = section.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;

        gsap.to('.dress-3d', {
          rotationY: dx * 8,
          rotationX: -dy * 5,
          transformPerspective: 1400,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to('.dress-glow', {
          x: dx * 30,
          y: dy * 20,
          duration: 1.1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      const onLeave = () => {
        gsap.to('.dress-3d', {
          rotationY: 0, rotationX: 0,
          duration: 2, ease: 'elastic.out(1, 0.5)', overwrite: 'auto'
        });
        gsap.to('.dress-glow', {
          x: 0, y: 0,
          duration: 1.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto'
        });
      };

      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);

      /* ── Scroll parallax (explicit fromTo so reversal is clean) ── */
      gsap.fromTo('.dress-3d',
        { yPercent: 0 },
        {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );

      return () => {
        section.removeEventListener('mousemove', onMove);
        section.removeEventListener('mouseleave', onLeave);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden'
      style={{ background: 'linear-gradient(168deg, #f8f6f1 0%, #f1ebe1 50%, #ece4d6 100%)' }}
    >

      {/* ── Ambient background ──────────────────────────────── */}
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-40'
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.18) 0%, transparent 65%)' }} />
        <div className='absolute inset-0 opacity-[0.022]'
          style={{
            backgroundImage: 'linear-gradient(rgba(30,20,10,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(30,20,10,0.5) 1px,transparent 1px)',
            backgroundSize: '72px 72px'
          }} />
      </div>

      {/* ── Cinematic letterbox bars (start hidden via translateY) ── */}
      <div className='lb-top fixed top-0 left-0 right-0 h-[10vh] bg-[#0e0e0e] z-40 pointer-events-none'
        style={{ transform: 'translateY(-100%)' }} />
      <div className='lb-bot fixed bottom-0 left-0 right-0 h-[10vh] bg-[#0e0e0e] z-40 pointer-events-none'
        style={{ transform: 'translateY(100%)' }} />


      {/* ── Left editorial panel ─────────────────────────────── */}
      <div className='edit-left absolute left-8 lg:left-14 xl:left-24 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8'>
        {LEFT_INFO.map(({ label, value }) => (
          <div key={label}>
            <div className='text-luxury-label tracking-luxury text-lux-muted mb-1.5'>{label}</div>
            <div className='font-display text-[1.65rem] font-bold text-lux-black leading-none'>{value}</div>
          </div>
        ))}
        <div className='h-px w-14 bg-gradient-to-r from-gold/50 to-transparent mt-1' />
        <p className='text-luxury-label tracking-luxury text-lux-muted leading-loose max-w-[110px]'>
          Where creativity finds its voice
        </p>
      </div>

      {/* ── Right editorial panel ────────────────────────────── */}
      <div className='edit-right absolute right-8 lg:right-14 xl:right-24 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 items-end text-right'>
        {RIGHT_INFO.map(({ label, value }) => (
          <div key={label}>
            <div className='text-luxury-label tracking-luxury text-lux-muted mb-1.5'>{label}</div>
            <div className='font-display text-[1.65rem] font-bold text-lux-black leading-none'>{value}</div>
          </div>
        ))}
        <div className='h-px w-14 bg-gradient-to-l from-gold/50 to-transparent mt-1' />
        <p className='text-luxury-label tracking-luxury text-lux-muted leading-loose max-w-[110px]'>
          Discover world-class design
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DRESS — main campaign centrepiece
      ══════════════════════════════════════════════════════════ */}
      <div
        className='dress-3d relative z-10 flex flex-col items-center mt-[37px]'
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className='dress-wrap relative'>

          {/* Ambient gold halo */}
          <div
            className='dress-glow absolute -inset-24 pointer-events-none blur-3xl opacity-50 z-0'
            style={{ background: 'radial-gradient(ellipse, rgba(201,169,110,0.35) 0%, transparent 65%)' }}
          />

          {/* The dress */}
          <div
            className='dress-float relative z-10'
            style={{ width: 'min(420px, 78vw)' }}
          >
            <Image
              src='/dress-hero.png'
              alt='XVII Century Dress'
              width={960}
              height={960}
              priority
              className='w-full h-auto object-contain select-none'
              style={{
                filter: 'drop-shadow(0 36px 56px rgba(20,14,6,0.16)) drop-shadow(0 10px 24px rgba(20,14,6,0.10))'
              }}
            />
          </div>

          {/* Ground shadow */}
          <div
            className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-[55%] h-5 blur-2xl pointer-events-none z-0'
            style={{ background: 'rgba(20,14,6,0.13)' }}
          />
        </div>

        {/* Tagline */}
        <div className='hero-tagline mt-8 text-center px-4 max-w-xl'>
          <h1 className='font-display text-3xl md:text-4xl lg:text-[2.8rem] font-bold italic text-lux-black leading-[1.08] tracking-tight'>
            Where Creativity<br />Finds Its Voice
          </h1>
        </div>

        {/* CTA buttons */}
        <div className='hero-cta-wrap mt-7 flex flex-col sm:flex-row gap-3 items-center'>
          <Link
            href={userId ? '/#works' : '/sign-up'}
            className='group inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-9 py-3.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
          >
            {userId ? 'Explore Works' : 'Get Started'}
            <ArrowRight size={13} className='transition-transform duration-300 group-hover:translate-x-1' />
          </Link>
          <Link
            href='/find-talent'
            className='inline-flex items-center gap-2 border border-lux-border hover:border-lux-black/30 text-lux-mid hover:text-lux-black px-9 py-3.5 text-luxury-label tracking-luxury transition-all duration-300'
          >
            Find Talent
          </Link>
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────── */}
      <div className='scroll-cue absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10'>
        <span className='text-luxury-label tracking-luxury text-lux-subtle'>Scroll</span>
        <div className='w-px h-10 bg-gradient-to-b from-gold/50 to-transparent' />
      </div>

      {/* ── Marquee band ─────────────────────────────────────── */}
      <div className='absolute bottom-0 left-0 right-0 border-t border-lux-border/50 bg-white/20 backdrop-blur-sm overflow-hidden z-10'>
        <div className='flex animate-marquee whitespace-nowrap py-2.5'>
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => (
            <span key={i} className='inline-flex items-center gap-4 mx-5'>
              <span className='text-luxury-label tracking-luxury text-lux-subtle'>{tag}</span>
              <span className='w-1 h-1 rounded-full bg-gold/40' />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
