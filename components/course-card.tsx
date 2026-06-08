'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, BookOpen, Award } from 'lucide-react';
import { CATEGORY_GRADIENTS, formatDuration } from '@/lib/learn-utils';

export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string | null;
  thumbnail?: string | null;
  category: string;
  level: string;
  price: number;
  isFree: boolean;
  rating: number;
  ratingCount: number;
  enrollmentCount: number;
  totalDuration: number;
  totalLessons: number;
  hasCertificate: boolean;
  instructor?: {
    userId: string;
    bio?: string | null;
  } | null;
  instructorName?: string;
}

interface CourseCardProps {
  course: CourseCardData;
  variant?: 'default' | 'horizontal' | 'compact';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? 'text-[#c9a96e] fill-[#c9a96e]' : 'text-lux-border fill-lux-border'}`}
        />
      ))}
    </div>
  );
}

export default function CourseCard({ course, variant = 'default' }: CourseCardProps) {
  const gradient = CATEGORY_GRADIENTS[course.category] ?? 'from-neutral-100 to-stone-50';
  const displayName = course.instructorName ?? 'Ophelia Instructor';

  if (variant === 'horizontal') {
    return (
      <Link href={`/learn/courses/${course.id}`} className='group flex gap-4 p-4 border border-lux-border bg-white hover:shadow-card transition-all duration-300 rounded-sm'>
        <div className={`relative w-32 h-20 flex-shrink-0 bg-gradient-to-br ${gradient} rounded-sm overflow-hidden`}>
          {course.thumbnail ? (
            <Image src={course.thumbnail} alt={course.title} fill className='object-cover' />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center'>
              <BookOpen className='h-6 w-6 text-lux-mid opacity-40' />
            </div>
          )}
        </div>
        <div className='flex flex-col justify-between min-w-0'>
          <div>
            <p className='text-xs text-gold tracking-wide mb-1'>{course.category}</p>
            <h3 className='font-medium text-lux-black text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200'>
              {course.title}
            </h3>
            <p className='text-xs text-lux-muted mt-0.5'>{displayName}</p>
          </div>
          <div className='flex items-center gap-3 mt-2'>
            <StarRating rating={course.rating} />
            <span className='text-xs text-lux-mid'>{course.rating.toFixed(1)}</span>
            {course.isFree ? (
              <span className='text-xs font-semibold text-emerald-600'>Free</span>
            ) : (
              <span className='text-xs font-semibold text-lux-black'>${course.price}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/learn/courses/${course.id}`} className='group flex flex-col border border-lux-border bg-white hover:shadow-card transition-all duration-300 rounded-sm overflow-hidden'>
        <div className={`relative h-28 bg-gradient-to-br ${gradient}`}>
          {course.thumbnail && (
            <Image src={course.thumbnail} alt={course.title} fill className='object-cover' />
          )}
          {course.isFree && (
            <span className='absolute top-2 left-2 text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full'>
              Free
            </span>
          )}
        </div>
        <div className='p-3'>
          <h3 className='font-medium text-lux-black text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200'>
            {course.title}
          </h3>
          <p className='text-xs text-lux-muted mt-1'>{displayName}</p>
          <div className='flex items-center justify-between mt-2'>
            <div className='flex items-center gap-1'>
              <Star className='h-3 w-3 text-[#c9a96e] fill-[#c9a96e]' />
              <span className='text-xs text-lux-mid'>{course.rating.toFixed(1)}</span>
            </div>
            {!course.isFree && <span className='text-xs font-bold text-lux-black'>${course.price}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/learn/courses/${course.id}`}
      className='group flex flex-col bg-white border border-lux-border hover:shadow-luxury transition-all duration-300 rounded-sm overflow-hidden'
    >
      {/* Thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient}`}>
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className='object-cover group-hover:scale-105 transition-transform duration-500' />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-10 w-10 text-lux-mid opacity-30' />
          </div>
        )}
        {/* Badges */}
        <div className='absolute top-3 left-3 flex gap-2'>
          {course.isFree ? (
            <span className='text-xs font-semibold bg-emerald-500 text-white px-2.5 py-1 rounded-full'>
              Free
            </span>
          ) : (
            <span className='text-xs font-semibold bg-[#1a1a1a]/80 text-white px-2.5 py-1 rounded-full'>
              ${course.price}
            </span>
          )}
        </div>
        {course.hasCertificate && (
          <div className='absolute bottom-3 right-3'>
            <span className='flex items-center gap-1 text-xs bg-white/90 text-lux-mid px-2 py-0.5 rounded-full'>
              <Award className='h-3 w-3 text-[#c9a96e]' /> Certificate
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-1'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-medium text-gold tracking-wide truncate'>{course.category}</span>
          <span className='text-xs text-lux-muted bg-lux-hover px-2 py-0.5 rounded-full flex-shrink-0'>{course.level}</span>
        </div>

        <h3 className='font-display font-semibold text-lux-black text-base leading-snug line-clamp-2 mb-1 group-hover:text-gold transition-colors duration-200'>
          {course.title}
        </h3>

        <p className='text-xs text-lux-muted mb-3'>{displayName}</p>

        {course.shortDescription && (
          <p className='text-xs text-lux-mid line-clamp-2 mb-3 flex-1'>{course.shortDescription}</p>
        )}

        {/* Rating row */}
        <div className='flex items-center gap-1.5 mb-3'>
          <StarRating rating={course.rating} />
          <span className='text-xs font-semibold text-lux-black'>{course.rating.toFixed(1)}</span>
          <span className='text-xs text-lux-muted'>({course.ratingCount.toLocaleString()})</span>
        </div>

        {/* Meta row */}
        <div className='flex items-center gap-3 text-xs text-lux-muted border-t border-lux-border pt-3'>
          <span className='flex items-center gap-1'>
            <Users className='h-3 w-3' /> {course.enrollmentCount.toLocaleString()}
          </span>
          <span className='flex items-center gap-1'>
            <Clock className='h-3 w-3' /> {formatDuration(course.totalDuration)}
          </span>
          <span className='flex items-center gap-1'>
            <BookOpen className='h-3 w-3' /> {course.totalLessons} lessons
          </span>
        </div>
      </div>
    </Link>
  );
}
