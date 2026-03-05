import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import type { Profile } from '@prisma/client';
import type { User } from '@clerk/nextjs/server';

import fetcher from '@/lib/fetcher';

interface CurrentProfileData {
  user: User;
  profile: Profile;
}

export default function useCurrentProfile() {
  const { userId } = useAuth();

  const { data, isLoading, error } = useSWR<CurrentProfileData>(
    userId ? '/api/profile' : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error
  };
}
