'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, ExternalLink } from 'lucide-react';
import { PROVIDER_COLORS, type ExternalCourse } from '@/lib/learn-utils';

interface ExternalCourseCardProps {
  course: ExternalCourse;
}

export default function ExternalCourseCard({ course }: ExternalCourseCardProps) {
  const providerStyle = PROVIDER_COLORS[course.provider] ?? { bg: 'bg-neutral-100', text: 'text-neutral-700' };

  return (
    <Link
      href={course.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group flex flex-col bg-white border border-lux-border hover:shadow-luxury transition-all duration-300 rounded-sm overflow-hidden'
    >
      {/* Thumbnail */}
      <div className='relative h-44 bg-lux-hover overflow-hidden'>
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Provider badge */}
        <div className='absolute top-3 left-3'>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${providerStyle.bg} ${providerStyle.text}`}>
            {course.provider}
          </span>
        </div>
        {/* Price badge */}
        <div className='absolute top-3 right-3'>
          {course.isFree ? (
            <span className='text-xs font-semibold bg-emerald-500 text-white px-2.5 py-1 rounded-full'>Free</span>
          ) : (
            <span className='text-xs font-semibold bg-[#1a1a1a]/80 text-white px-2.5 py-1 rounded-full'>${course.price}</span>
          )}
        </div>
        {/* External link indicator */}
        <div className='absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <span className='flex items-center gap-1 text-xs bg-white/90 text-lux-mid px-2 py-0.5 rounded-full'>
            <ExternalLink className='h-3 w-3' /> {course.provider}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-1'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-medium text-gold tracking-wide truncate'>{course.category}</span>
          <span className='text-xs text-lux-muted bg-lux-hover px-2 py-0.5 rounded-full flex-shrink-0'>{course.level}</span>
        </div>

        <h3 className='font-display font-semibold text-lux-black text-sm leading-snug line-clamp-2 mb-1 group-hover:text-gold transition-colors duration-200'>
          {course.title}
        </h3>

        <p className='text-xs text-lux-muted mb-3'>{course.instructor}</p>

        {/* Rating row */}
        <div className='flex items-center gap-1.5 mb-3'>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`h-3 w-3 ${s <= Math.round(course.rating) ? 'text-[#c9a96e] fill-[#c9a96e]' : 'text-lux-border fill-lux-border'}`} />
          ))}
          <span className='text-xs font-semibold text-lux-black'>{course.rating.toFixed(1)}</span>
          <span className='text-xs text-lux-muted'>({course.students.toLocaleString()})</span>
        </div>

        {/* Meta row */}
        <div className='flex items-center gap-3 text-xs text-lux-muted border-t border-lux-border pt-3 mt-auto'>
          <span className='flex items-center gap-1'><Clock className='h-3 w-3' /> {course.duration}</span>
          <span className='flex items-center gap-1'><Users className='h-3 w-3' /> {course.students.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
