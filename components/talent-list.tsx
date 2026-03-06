"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import TalentCard from '@/components/talent-card';
import TalentFilter from '@/components/talent-filter';
import { Skeleton } from '@/components/ui/skeleton';

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

interface Talent {
  id: string;
  userId: string;
  username: string;
  bio?: string;
  works: Work[];
  profilePicture?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TalentList() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([]);

  useEffect(() => {
    const fetchTalents = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const res = await axios.get(
          `/api/talents?${params.toString()}`
        );
        if (res.data?.success) {
          setTalents(res.data.talents || []);
        }
      } catch (err) {
        console.error('Failed to fetch talents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTalents();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-[#3d3d4e] mb-2'>
          Hire Top Fashion Designers
        </h1>
        <p className='text-[#6d6d78]'>
          Find creative fashion professionals ready to work on your next project.
        </p>
      </div>

      {/* Popular Categories */}
      <div className='mb-8'>
        <p className='text-sm font-semibold text-[#3d3d4e] mb-3'>
          Popular
        </p>
        <div className='flex flex-wrap gap-2'>
          {[
            'fashion-design',
            'tailor-seamstress',
            'pattern-making',
            'fashion-styling',
            'wardrobe-consulting',
            'fashion-marketing',
            'fashion-writing',
            'other-fashion'
          ].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#3d3d4e] text-white'
                  : 'bg-[#f7f7f8] text-[#3d3d4e] hover:bg-[#ebe9f1]'
              }`}
            >
              {cat
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className='mb-8 pb-8 border-b border-[#e7e7e9]'>
        <TalentFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Talents Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='border border-[#e7e7e9] rounded-lg overflow-hidden'>
              <Skeleton className='h-56 w-full' />
              <div className='p-4 space-y-3'>
                <Skeleton className='h-4 w-2/3' />
                <Skeleton className='h-3 w-full' />
                <div className='grid grid-cols-3 gap-2'>
                  <Skeleton className='h-16' />
                  <Skeleton className='h-16' />
                  <Skeleton className='h-16' />
                </div>
                <Skeleton className='h-8 w-full' />
              </div>
            </div>
          ))}
        </div>
      ) : talents.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-[#9e9ea7] text-lg mb-2'>No designers found</p>
          <p className='text-sm text-[#9e9ea7]'>
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div>
          <p className='text-sm text-[#9e9ea7] mb-4'>
            Found {talents.length} designer{talents.length !== 1 ? 's' : ''}
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {talents.map(talent => (
              <TalentCard
                key={talent.userId}
                userId={talent.userId}
                username={talent.username}
                bio={talent.bio}
                works={talent.works}
                profilePicture={talent.profilePicture}
                githubUrl={talent.githubUrl}
                linkedinUrl={talent.linkedinUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
