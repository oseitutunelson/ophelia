import { Metadata, ResolvingMetadata } from 'next';

import db from '@/lib/db';
import WorkList from '@/components/work-list';
import FilterNav from '@/components/filter-nav';
import SearchHeader from '@/components/search-header';
import SearchResultsGrid from '@/components/search-results-grid';
import FashionHero from '@/components/fashion-hero';

type Props = {
  searchParams: { search?: string; category?: string; sort?: string };
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
  searchParams: { search?: string; category?: string; sort?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search, category, sort } = searchParams;

  const titleContains  = typeof search   === 'string' ? search   : undefined;
  const categoryFilter = typeof category === 'string' ? decodeURIComponent(category) : undefined;
  const isFiltered     = titleContains !== undefined || categoryFilter !== undefined;

  const where = {
    title: { contains: titleContains, mode: 'insensitive' as const },
    ...(categoryFilter && { category: { equals: categoryFilter, mode: 'insensitive' as const } }),
    ...(sort === 'trending' && {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
  };

  let works;
  let totalWorks: number;

  if (sort === 'popular') {
    const [worksWithCounts, count] = await db.$transaction([
      db.work.findMany({
        take: 24,
        where,
        include: { _count: { select: { likes: true } } }
      }),
      db.work.count({ where })
    ]);
    works = worksWithCounts
      .sort((a, b) => b._count.likes - a._count.likes)
      .slice(0, 12)
      .map(({ _count: _c, ...w }) => w);
    totalWorks = count;
  } else {
    [works, totalWorks] = await db.$transaction([
      db.work.findMany({
        take: 12,
        where,
        orderBy: { createdAt: 'desc' }
      }),
      db.work.count({ where })
    ]);
  }

  const pageCount = Math.ceil(totalWorks / 12);

  return (
    <>
      {/* Fashion hero — only on unfiltered home */}
      {!isFiltered && <FashionHero />}

      {/* Search header — only when a search/category filter is active */}
      <SearchHeader search={titleContains} />

      {isFiltered ? (
        /* ── Dribbble-style masonry search results ── */
        <section className='px-5 lg:px-16 xl:px-20 py-8'>
          <SearchResultsGrid
            initialData={works}
            pageCount={pageCount}
            search={titleContains}
            category={categoryFilter}
            sort={sort}
          />
        </section>
      ) : (
        /* ── Standard discover grid ── */
        <section className='flex flex-col items-center lg:px-16 xl:px-20 py-8 px-5'>
          <FilterNav />
          <WorkList initialData={works} pageCount={pageCount} />
        </section>
      )}
    </>
  );
}
