import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProBadgeProps {
  isAgency?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProBadge({ isAgency = false, size = 'sm', className }: ProBadgeProps) {
  const dim      = size === 'md' ? 'w-[18px] h-[18px]' : 'w-[15px] h-[15px]';
  const iconSize = size === 'md' ? 10 : 8;
  const label    = isAgency ? 'Verified Agency' : 'Verified Pro Designer';

  return (
    <span className='relative group/badge inline-flex flex-shrink-0 items-center'>
      {/* Badge circle */}
      <span
        aria-label={label}
        role='img'
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          dim,
          isAgency ? 'bg-[#c9a96e]' : 'bg-[#1d9bf0]',
          className
        )}
      >
        <Check size={iconSize} strokeWidth={3.5} className='text-white' />
      </span>

      {/* CSS tooltip */}
      <span
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2',
          'whitespace-nowrap bg-[#0f1419] text-white text-[10px] leading-none px-2.5 py-1.5',
          'opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 z-50',
          'after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2',
          'after:border-4 after:border-transparent after:border-t-[#0f1419]'
        )}
      >
        {label}
      </span>
    </span>
  );
}
