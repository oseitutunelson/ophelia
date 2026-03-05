import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import db from '@/lib/db';
import ProfileNav from '@/components/profile-nav';
import ProfileHeader from '@/components/profile-header';
import UserJobsCard from '@/components/user-jobs-card';
import UserApplicationsCard from '@/components/user-applications-card';

type Props = {
  params: { username: string };
};

export default async function ProfileJobsPage({
  params
}: {
  params: { username: string };
}) {
  // get logged in user
  const loggedInUser = await currentUser();

  // get user profile of the username
  const profile = await db.profile.findUnique({
    where: {
      username: params.username
    }
  });

  if (!profile) {
    notFound();
  }

  // Only allow viewing own jobs page
  if (!loggedInUser || loggedInUser.id !== profile.userId) {
    notFound();
  }

  // get user profile's works for the header
  const [works, totalWorks] = await db.$transaction([
    db.work.findMany({
      take: 12,
      where: {
        userId: loggedInUser.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    db.work.count({
      where: {
        userId: loggedInUser.id
      }
    })
  ]);

  const pageCount = Math.ceil(totalWorks / 12);

  return (
    <section className='flex flex-col justify-start items-center lg:px-20 py-6 px-5'>
      <ProfileHeader
        user={loggedInUser}
        profile={profile}
        works={works}
        isOwner={true}
      />
      <ProfileNav username={profile.username} activeNav='jobs' />

      <div className='w-full mt-3 flex flex-col items-center'>
        <div className='w-full max-w-4xl space-y-8'>
          <UserJobsCard />
          <UserApplicationsCard />
        </div>
      </div>
    </section>
  );
}
