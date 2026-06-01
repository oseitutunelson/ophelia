import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProBadgeProps {
  isAgency?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProBadge({ isAgency = false, size = 'sm', className }: ProBadgeProps) {
  const dim = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const icon = size === 'md' ? 11 : 9;

  return (
    <span
      title={isAgency ? 'Agency Pro' : 'Verified Pro'}
      className={cn(
        'inline-flex items-center justify-center rounded-full flex-shrink-0',
        dim,
        isAgency
          ? 'bg-[#1a1a1a] border border-[#c9a96e]'
          : 'bg-[#c9a96e]',
        className
      )}
    >
      <Check
        size={icon}
        strokeWidth={3}
        className={isAgency ? 'text-[#c9a96e]' : 'text-white'}
      />
    </span>
  );
}
