import Link from 'next/link';
import Image from 'next/image';

const FOOTER_COLS = [
  {
    heading: 'Platform',
    links: [
      { href: '/',           text: 'Inspiration' },
      { href: '/find-talent', text: 'Find Talent' },
      { href: '/jobs',       text: 'Jobs Board' },
      { href: '/upload-new', text: 'Share Work' }
    ]
  },
  {
    heading: 'Resources',
    links: [
      { href: '/blog', text: 'Blog' },
      { href: '/', text: 'Learn Design' },
      { href: '/', text: 'Advertising' },
      { href: '/', text: 'Support' }
    ]
  },
  {
    heading: 'Company',
    links: [
      { href: '/', text: 'About' },
      { href: '/', text: 'Careers' },
      { href: '/', text: 'Press' },
      { href: '/', text: 'Contact' }
    ]
  }
];

const SOCIAL = [
  {
    label: 'Twitter / X',
    href: '/',
    icon: (
      <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.857L1.26 2.25H8.08l4.258 5.635L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z' />
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: '/',
    icon: (
      <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75'>
        <rect x='2' y='2' width='20' height='20' rx='5' />
        <circle cx='12' cy='12' r='4' />
        <circle cx='17.5' cy='6.5' r='0.5' fill='currentColor' stroke='none' />
      </svg>
    )
  },
  {
    label: 'Pinterest',
    href: '/',
    icon: (
      <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z' />
      </svg>
    )
  }
];

export default function Footer() {
  return (
    <footer className='relative bg-[#f2ede5] border-t border-lux-border'>
      <div className='divider-gold' />

      <div className='max-w-[1200px] mx-auto px-8'>
        {/* main grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 lg:gap-8 pt-16 pb-14'>
          {/* brand column */}
          <div className='flex flex-col gap-5'>
            <Link href='/'>
              <Image
                src='/ophelia-dark.png'
                alt='Ophelia'
                width={160}
                height={52}
                className='h-14 w-auto'
              />
            </Link>
            <p className='text-lux-mid text-sm leading-relaxed max-w-[240px]'>
              The platform where designers gain inspiration, share work, and find opportunities.
            </p>
            <div className='flex items-center gap-4'>
              {SOCIAL.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className='text-lux-subtle hover:text-gold transition-colors duration-300'
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className='flex flex-col gap-4'>
              <h4 className='text-luxury-label tracking-luxury text-lux-black'>
                {col.heading}
              </h4>
              <ul className='flex flex-col gap-3'>
                {col.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className='text-sm text-lux-mid hover:text-lux-black transition-colors duration-300'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className='border-t border-lux-border py-7 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-lux-subtle text-xs'>
            &copy; {new Date().getFullYear()} Ophelia. All rights reserved.
          </p>
          <ul className='flex items-center gap-6'>
            {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map((t) => (
              <li key={t}>
                <Link href='/' className='text-lux-subtle text-xs hover:text-lux-mid transition-colors duration-300'>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
