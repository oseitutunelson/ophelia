import db from '@/lib/db';
import WorkCard from '@/components/work-card';
import SponsoredBadge from '@/components/sponsored-badge';

export default async function SponsoredWorksSection() {
  const now = new Date();

  // Fetch active design campaigns
  const campaigns = await db.adCampaign.findMany({
    where: {
      type: 'design',
      status: 'active',
      paymentStatus: 'paid',
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  if (campaigns.length === 0) return null;

  const workIds = campaigns.map((c) => c.contentId).filter(Boolean);
  if (workIds.length === 0) return null;

  const works = await db.work.findMany({
    where: { id: { in: workIds } },
  });

  if (works.length === 0) return null;

  // Preserve campaign order
  const workMap = new Map(works.map((w) => [w.id, w]));
  const orderedWorks = workIds.map((id) => workMap.get(id)).filter(Boolean) as typeof works;

  return (
    <section className='w-full px-5 lg:px-16 xl:px-20 pt-6 pb-2'>
      {/* Section header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <SponsoredBadge variant='light' />
          <span className='text-xs text-lux-muted'>Promoted work</span>
        </div>
        <div className='h-px flex-1 mx-4 bg-lux-border' />
      </div>

      {/* Works grid — same layout as main discover grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8'>
        {orderedWorks.map((work) => (
          <WorkCard key={work.id} work={work} isSponsored />
        ))}
      </div>

      {/* Bottom divider */}
      <div className='mt-8 h-px bg-lux-border' />
    </section>
  );
}
