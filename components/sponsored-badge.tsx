import { cn } from '@/lib/utils';

interface SponsoredBadgeProps {
  variant?: 'light' | 'dark' | 'overlay';
  className?: string;
}

export default function SponsoredBadge({ variant = 'light', className }: SponsoredBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[9px] font-bold tracking-widest uppercase px-2 py-0.5',
        variant === 'overlay' && 'bg-black/50 text-white/80 backdrop-blur-sm',
        variant === 'light'   && 'bg-lux-hover text-lux-muted border border-lux-border',
        variant === 'dark'    && 'bg-[#1a1a1a]/80 text-[#6b6b6b] border border-[#2a2a2a]',
        className
      )}
    >
      Sponsored
    </span>
  );
}
