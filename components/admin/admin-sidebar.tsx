'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Newspaper, Megaphone, CreditCard, DollarSign,
  BarChart2, ScrollText, Settings, ChevronRight,
  LogOut, Shield, Image,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/instructors', label: 'Instructors', icon: GraduationCap },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/blogs', label: 'Blog Posts', icon: Newspaper },
  { href: '/admin/ads', label: 'Advertisements', icon: Megaphone },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-[220px] flex-shrink-0 bg-[#09090d] flex flex-col h-full border-r border-white/[0.05]'>
      {/* Brand */}
      <div className='px-5 py-5 border-b border-white/[0.06]'>
        <div className='flex items-center gap-2.5'>
          <div className='w-7 h-7 bg-[#c9a96e] flex items-center justify-center rounded'>
            <Shield className='h-3.5 w-3.5 text-white' />
          </div>
          <div>
            <p className='text-white font-semibold text-sm leading-none'>Admin Portal</p>
            <p className='text-white/30 text-[10px] mt-0.5'>Ophelia Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 py-3 px-2.5 overflow-y-auto'>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md mb-0.5 text-sm transition-all duration-150 ${
                active
                  ? 'bg-white/[0.07] text-white'
                  : 'text-white/45 hover:text-white/75 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`h-[15px] w-[15px] flex-shrink-0 ${active ? 'text-[#c9a96e]' : 'text-current'}`} />
              <span className='flex-1 text-[13px]'>{label}</span>
              {active && <ChevronRight className='h-3 w-3 text-[#c9a96e]/60' />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='px-2.5 py-3 border-t border-white/[0.06]'>
        <Link
          href='/'
          className='flex items-center gap-2.5 px-3 py-2 rounded-md text-white/35 hover:text-white/65 hover:bg-white/[0.04] text-[13px] transition-all duration-150'
        >
          <LogOut className='h-[15px] w-[15px]' />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
