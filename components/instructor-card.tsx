import { Star, Users, BookOpen, BadgeCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface InstructorCardProps {
  name: string;
  imageUrl?: string | null;
  bio?: string | null;
  expertise?: string[];
  totalStudents?: number;
  totalCourses?: number;
  rating?: number;
  isVerified?: boolean;
  userId?: string;
  variant?: 'card' | 'inline';
}

export default function InstructorCard({
  name, imageUrl, bio, expertise, totalStudents = 0,
  totalCourses = 0, rating = 0, isVerified = false, userId, variant = 'card',
}: InstructorCardProps) {
  if (variant === 'inline') {
    return (
      <div className='flex items-start gap-4'>
        <Avatar className='h-14 w-14 flex-shrink-0'>
          {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
          <AvatarFallback className='bg-lux-hover text-lux-mid font-medium text-lg'>
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-lux-black'>{name}</p>
            {isVerified && <BadgeCheck className='h-4 w-4 text-gold' />}
          </div>
          {expertise && expertise.length > 0 && (
            <p className='text-xs text-lux-muted mt-0.5'>{expertise.slice(0, 2).join(' · ')}</p>
          )}
          <div className='flex items-center gap-4 mt-2 text-xs text-lux-mid'>
            <span className='flex items-center gap-1'><Star className='h-3 w-3 text-gold fill-gold' />{rating.toFixed(1)}</span>
            <span className='flex items-center gap-1'><Users className='h-3 w-3' />{totalStudents.toLocaleString()} students</span>
            <span className='flex items-center gap-1'><BookOpen className='h-3 w-3' />{totalCourses} courses</span>
          </div>
          {bio && <p className='text-sm text-lux-mid mt-2 leading-relaxed'>{bio}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white border border-lux-border p-6 text-center hover:shadow-card transition-shadow duration-300'>
      <Avatar className='h-20 w-20 mx-auto mb-3'>
        {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
        <AvatarFallback className='bg-lux-hover text-lux-mid font-medium text-2xl'>
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className='flex items-center justify-center gap-1.5 mb-1'>
        <p className='font-semibold text-lux-black'>{name}</p>
        {isVerified && <BadgeCheck className='h-4 w-4 text-gold' />}
      </div>
      {expertise && expertise.length > 0 && (
        <p className='text-xs text-lux-muted mb-3'>{expertise.slice(0, 2).join(' · ')}</p>
      )}
      <div className='flex items-center justify-center gap-4 text-xs text-lux-mid mb-3'>
        <span className='flex items-center gap-1'><Star className='h-3 w-3 text-gold fill-gold' />{rating.toFixed(1)}</span>
        <span className='flex items-center gap-1'><Users className='h-3 w-3' />{totalStudents.toLocaleString()}</span>
        <span className='flex items-center gap-1'><BookOpen className='h-3 w-3' />{totalCourses}</span>
      </div>
      {bio && <p className='text-xs text-lux-mid leading-relaxed line-clamp-3'>{bio}</p>}
      {userId && (
        <Link href={`/teach/instructor/${userId}`} className='text-xs text-gold hover:underline mt-3 inline-block'>
          View profile →
        </Link>
      )}
    </div>
  );
}
