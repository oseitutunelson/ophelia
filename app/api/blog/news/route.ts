import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
}

const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Valentino's Spring/Summer 2026 Collection Redefines Modern Romance",
    description: "Pierpaolo Piccioli explores the intersection of traditional craftsmanship and contemporary minimalism in a breathtaking Paris runway debut.",
    url: "https://www.vogue.com",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: { name: "Vogue", url: "https://www.vogue.com" },
  },
  {
    title: "Nike x Off-White 2026 'Ghosting' Collection Officially Drops This Season",
    description: "The posthumous collaboration delivers ten new colourways across three silhouettes, celebrating Virgil Abloh's lasting legacy.",
    url: "https://hypebeast.com",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: { name: "Hypebeast", url: "https://hypebeast.com" },
  },
  {
    title: "Paris Fashion Week S/S 2026: Every Major Moment You Need to Know",
    description: "From Chanel's maximalist comeback to Balenciaga's quiet luxury pivot, PFW delivered one of its most memorable seasons in years.",
    url: "https://www.vogue.com",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: { name: "Vogue", url: "https://www.vogue.com" },
  },
  {
    title: "LVMH Reports Record First-Quarter Revenue as Luxury Demand Surges",
    description: "The world's largest luxury group posted €22 billion in revenue, driven by double-digit growth in fashion and leather goods.",
    url: "https://www.businessoffashion.com",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { name: "Business of Fashion", url: "https://www.businessoffashion.com" },
  },
  {
    title: "Stella McCartney Opens First Seoul Flagship, Doubling Down on Sustainability",
    description: "The new 3,000 sq ft concept store in Gangnam features zero-plastic packaging, regenerative materials, and a living moss installation.",
    url: "https://www.businessoffashion.com",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: { name: "Business of Fashion", url: "https://www.businessoffashion.com" },
  },
  {
    title: "The Return of Y2K: How Gen Z Is Rewriting Early 2000s Fashion Rules",
    description: "Low-rise jeans, butterfly clips, and velour tracksuits are back — but this generation's approach to nostalgia is entirely its own.",
    url: "https://www.highsnobiety.com",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    source: { name: "Highsnobiety", url: "https://www.highsnobiety.com" },
  },
  {
    title: "Supreme's Spring Drop Features Unexpected Archival Collaborations",
    description: "This season's Box Logo release includes a surprise partnership with three legacy New York photographers — and sells out in seconds.",
    url: "https://hypebeast.com",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    source: { name: "Hypebeast", url: "https://hypebeast.com" },
  },
  {
    title: "Gucci Welcomes New Creative Director After Sabato De Sarno's Departure",
    description: "The Kering-owned house confirms a major creative reshuffle, with a debut collection expected at Milan Fashion Week in September.",
    url: "https://wwd.com",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    source: { name: "WWD", url: "https://wwd.com" },
  },
  {
    title: "Met Gala 2026 'Gilded Glamour 2.0': The Most Iconic Looks of the Night",
    description: "Stars pulled out all the stops for fashion's biggest evening, from Zendaya's custom Schiaparelli to Bad Bunny's deconstructed suit.",
    url: "https://www.vogue.com",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    source: { name: "Vogue", url: "https://www.vogue.com" },
  },
  {
    title: "African Fashion Designers Take Center Stage at London Fashion Week",
    description: "A record number of African-founded labels debuted on London's runways this season, marking a pivotal shift in global fashion representation.",
    url: "https://wwd.com",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: { name: "WWD", url: "https://wwd.com" },
  },
];

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=fashion+clothing+luxury+streetwear&lang=en&max=10&token=${apiKey}`,
        { next: { revalidate: 3600 } }
      );

      if (res.ok) {
        const data = await res.json();
        const articles: NewsArticle[] = data.articles.map((a: Record<string, unknown>) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          image: a.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop',
          publishedAt: a.publishedAt,
          source: a.source,
        }));
        return NextResponse.json({ articles });
      }
    } catch (err) {
      console.error('[NEWS_FETCH]', err);
    }
  }

  return NextResponse.json({ articles: MOCK_NEWS });
}
