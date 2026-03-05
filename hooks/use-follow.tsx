import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

interface FollowStats {
  followers: number;
  following: number;
  likes: number;
}

interface UseFollowResult {
  stats: FollowStats | null;
  isFollowing: boolean;
  isLoading: boolean;
  follow: () => Promise<void>;
  unfollow: () => Promise<void>;
}

export default function useFollow(targetUserId: string): UseFollowResult {
  const { userId: currentUserId } = useAuth();
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [targetUserId, currentUserId]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/users/${targetUserId}/stats`);
      if (res.data?.success) {
        setStats(res.data.stats);
        setIsFollowing(res.data.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const follow = async () => {
    if (!currentUserId) return;

    try {
      await axios.post(`/api/follow/${targetUserId}`);
      setIsFollowing(true);
      if (stats) {
        setStats({ ...stats, followers: stats.followers + 1 });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        console.error('Error following user:', error.response.data.message);
      } else {
        console.error('Error following user:', error);
      }
    }
  };

  const unfollow = async () => {
    if (!currentUserId) return;

    try {
      await axios.delete(`/api/follow/${targetUserId}`);
      setIsFollowing(false);
      if (stats) {
        setStats({ ...stats, followers: stats.followers - 1 });
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return {
    stats,
    isFollowing,
    isLoading,
    follow,
    unfollow
  };
}