import { useEffect, useState } from 'react';
import axios from 'axios';

interface JobApplication {
  id: string;
  jobId: string;
  message: string;
  workId?: string;
  portfolioUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  job: {
    id: string;
    title: string;
    image?: string;
  };
}

export default function useGetApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/profile/my-applications');
        if (res.data?.success) {
          setApplications(res.data.applications);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, isLoading, error };
}
