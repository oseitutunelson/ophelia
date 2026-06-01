import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProfileNavProps {
  username: string;
  activeNav: 'work' | 'jobs' | 'about';
}

const NAV_ITEMS = [
  { key: 'work',  label: 'Work',  href: (u: string) => `/${u}`       },
  { key: 'jobs',  label: 'Jobs',  href: (u: string) => `/${u}/jobs`  },
  { key: 'about', label: 'About', href: (u: string) => `/${u}/about` },
] as const;

export default function ProfileNav({ username, activeNav }: ProfileNavProps) {
  return (
    <div className='w-full border-b border-lux-border'>
      <ul className='flex gap-0'>
        {NAV_ITEMS.map(({ key, label, href }) => (
          <li key={key}>
            <Link
              href={href(username)}
              className={cn(
                'inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury transition-all duration-200 border-b-2 -mb-px',
                activeNav === key
                  ? 'text-lux-black border-lux-black'
                  : 'text-lux-muted hover:text-lux-mid border-transparent'
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
