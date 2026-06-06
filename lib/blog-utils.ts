export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function calculateReadTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export function generateExcerpt(htmlContent: string, maxLength = 160): string {
  const text = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? text.substring(0, maxLength).replace(/\s\S*$/, '') + '...' : text;
}

export const BLOG_CATEGORIES = [
  'All',
  'Fashion News',
  'Fashion Trends',
  'Streetwear',
  'Luxury Fashion',
  'Designer Stories',
  'Fashion Business',
  'Sustainability',
  'Fashion Technology',
  'Fashion Week',
  'Celebrity Style',
  'Beauty',
  'Accessories',
  'Editorials',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
