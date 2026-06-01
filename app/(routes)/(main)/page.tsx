import { Metadata, ResolvingMetadata } from 'next';

import db from '@/lib/db';
import WorkList from '@/components/work-list';
import FilterNav from '@/components/filter-nav';
import SearchHeader from '@/components/search-header';
import FashionHero from '@/components/fashion-hero';

type Props = {
  searchParams: { search?: string; category?: string };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { search, category } = searchParams;
  const previousTitle = (await parent).title || '';
  let title = previousTitle as string;
  if (typeof search === 'string')
    title = `Browse ${search.charAt(0).toUpperCase()}${search.slice(1)} designs | Ophelia`;
  else if (typeof category === 'string')
    title = `Browse ${category.charAt(0).toUpperCase()}${category.slice(1)} designs | Ophelia`;
  return { title };
}

interface HomePageProps {
  searchParams: { search?: string; category?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search, category } = searchParams;

  const titleContains  = typeof search   === 'string' ? search   : undefined;
  const categoryFilter = typeof category === 'string' ? decodeURIComponent(category) : undefined;
  const isFiltered = titleContains !== undefined || categoryFilter !== undefined;

  const [works, totalWorks] = await db.$transaction([
    db.work.findMany({
      take: 12,
      where: {
        title: { contains: titleContains, mode: 'insensitive' },
        ...(categoryFilter && { category: { equals: categoryFilter, mode: 'insensitive' } })
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.work.count({
      where: {
        title: { contains: titleContains, mode: 'insensitive' },
        ...(categoryFilter && { category: { equals: categoryFilter, mode: 'insensitive' } })
      }
    })
  ]);

  const pageCount = Math.ceil(totalWorks / 12);

  return (
    <>
      {/* Cocktail-style fashion hero — only on unfiltered home */}
      {!isFiltered && <FashionHero />}

      {/* Search results header */}
      <SearchHeader search={titleContains} />

      {/* Works section */}
      <section className='flex flex-col items-center lg:px-16 xl:px-20 py-8 px-5'>
        {isFiltered && <div className='h-4' />}
        <FilterNav />
        <WorkList initialData={works} pageCount={pageCount} />
      </section>
    </>
  );
}
