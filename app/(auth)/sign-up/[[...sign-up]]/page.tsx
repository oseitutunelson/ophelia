import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign Up | Ophelia',
  description:
    'Create an account on Ophelia, the world’s leading community for designers to share, grow, and get hired.'
};

export default function SignUpPage() {
  return (
    <>
      <section className='hidden lg:flex w-[400px] grow-0 relative text-white'>
        <div className='flex flex-col justify-between h-full'>
          <Link href='/' className='absolute top-10 left-10 z-10'>
            <Image
              src='/ophelia-dark.png'
              alt='ophelia logo'
              className='w-[120px] h-[130px]'
              width={200}
              height={200}
              priority
            />
          </Link>
          <video
            playsInline
            className='w-full object-cover h-full'
            autoPlay
            loop
            muted
            src='sign-up.mp4'
          />
          <Link href='/' className='absolute bottom-10 left-10 text-sm'>
            @nguyenhut
          </Link>
        </div>
      </section>
      <section className='flex flex-col flex-1 overflow-auto justify-center w-full'>
        <main className='flex justify-center xl:justify-start grow items-center w-full h-full'>
          <div className='xl:ml-28'>
            <SignUp />
          </div>
        </main>
      </section>
    </>
  );
}
