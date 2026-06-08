export const LEARN_CATEGORIES = [
  'Fashion Design',
  'Fashion Illustration',
  'Fashion Sketching',
  'Pattern Making',
  'Sewing & Garment Construction',
  'Textile Design',
  'Fashion Business',
  'Fashion Marketing',
  'Fashion Branding',
  'Fashion Photography',
  'Fashion Videography',
  'Fashion Styling',
  'Fashion Journalism',
  'Luxury Fashion',
  'Streetwear Design',
  'Fashion Technology',
  'Fashion E-commerce',
  'Tattoo Design',
  'Tattoo Techniques',
  'Piercing Fundamentals',
  'Creative Drawing',
  'Digital Illustration',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Fashion Portfolio Building',
  'AI for Fashion Creators',
] as const;

export type LearnCategory = (typeof LEARN_CATEGORIES)[number];

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;
export type CourseLevel = (typeof COURSE_LEVELS)[number];

export const CATEGORY_GRADIENTS: Record<string, string> = {
  'Fashion Design':              'from-rose-100 to-pink-50',
  'Fashion Illustration':        'from-purple-100 to-violet-50',
  'Fashion Sketching':           'from-amber-100 to-yellow-50',
  'Pattern Making':              'from-teal-100 to-cyan-50',
  'Sewing & Garment Construction': 'from-orange-100 to-amber-50',
  'Textile Design':              'from-lime-100 to-green-50',
  'Fashion Business':            'from-blue-100 to-indigo-50',
  'Fashion Marketing':           'from-pink-100 to-rose-50',
  'Fashion Branding':            'from-indigo-100 to-blue-50',
  'Fashion Photography':         'from-neutral-100 to-stone-50',
  'Fashion Videography':         'from-slate-100 to-gray-50',
  'Fashion Styling':             'from-fuchsia-100 to-pink-50',
  'Fashion Journalism':          'from-sky-100 to-blue-50',
  'Luxury Fashion':              'from-yellow-100 to-amber-50',
  'Streetwear Design':           'from-zinc-100 to-neutral-50',
  'Fashion Technology':          'from-cyan-100 to-teal-50',
  'Fashion E-commerce':          'from-emerald-100 to-green-50',
  'Tattoo Design':               'from-stone-100 to-neutral-50',
  'Tattoo Techniques':           'from-red-100 to-rose-50',
  'Piercing Fundamentals':       'from-gray-100 to-slate-50',
  'Creative Drawing':            'from-orange-100 to-red-50',
  'Digital Illustration':        'from-violet-100 to-purple-50',
  'Adobe Photoshop':             'from-blue-100 to-sky-50',
  'Adobe Illustrator':           'from-amber-100 to-orange-50',
  'Fashion Portfolio Building':  'from-rose-100 to-fuchsia-50',
  'AI for Fashion Creators':     'from-teal-100 to-emerald-50',
};

export function generateCourseSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Math.random().toString(36).slice(2, 7);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).toUpperCase().slice(2, 10);
  return `OPH-${year}-${rand}`;
}

export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export interface ExternalCourse {
  id: string;
  title: string;
  provider: 'Coursera' | 'Skillshare' | 'Udemy' | 'MasterClass' | 'LinkedIn Learning';
  instructor: string;
  thumbnail: string;
  category: string;
  level: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  isFree: boolean;
  url: string;
  description: string;
}

export const EXTERNAL_COURSES: ExternalCourse[] = [
  {
    id: 'ext-1',
    title: 'Fashion Design Fundamentals: From Sketch to Garment',
    provider: 'Coursera',
    instructor: 'Parsons School of Design',
    thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Design',
    level: 'Beginner',
    rating: 4.8,
    students: 24500,
    duration: '6 weeks',
    price: 49,
    isFree: false,
    url: 'https://www.coursera.org/learn/fashion-design',
    description: 'Learn the fundamentals of fashion design including sketching, color theory, and garment construction techniques from industry professionals.',
  },
  {
    id: 'ext-2',
    title: 'Fashion Illustration: Drawing the Clothed Figure',
    provider: 'Skillshare',
    instructor: 'Brooke Hagel',
    thumbnail: 'https://images.unsplash.com/photo-1531913223931-b0d3198229ee?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Illustration',
    level: 'Beginner',
    rating: 4.9,
    students: 18200,
    duration: '4 hours',
    price: 0,
    isFree: true,
    url: 'https://www.skillshare.com/en/classes/fashion-illustration',
    description: 'Master fashion illustration techniques to bring your design ideas to life with confidence and style.',
  },
  {
    id: 'ext-3',
    title: 'Professional Sewing & Garment Construction',
    provider: 'Udemy',
    instructor: 'Lauren Dahl',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=640&q=80&auto=format&fit=crop',
    category: 'Sewing & Garment Construction',
    level: 'Beginner',
    rating: 4.7,
    students: 32100,
    duration: '12 hours',
    price: 19,
    isFree: false,
    url: 'https://www.udemy.com/course/sewing-garment-construction',
    description: 'Complete guide to sewing from cutting fabric to finishing techniques, suitable for beginners and intermediate sewers.',
  },
  {
    id: 'ext-4',
    title: 'Fashion Photography Masterclass',
    provider: 'MasterClass',
    instructor: 'Annie Leibovitz',
    thumbnail: 'https://images.unsplash.com/photo-1490481653865-9c845b945831?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Photography',
    level: 'Intermediate',
    rating: 4.9,
    students: 56000,
    duration: '3.5 hours',
    price: 120,
    isFree: false,
    url: 'https://www.masterclass.com/classes/annie-leibovitz-teaches-photography',
    description: 'World-renowned photographer shares her creative process, visual storytelling, and how to make powerful fashion images.',
  },
  {
    id: 'ext-5',
    title: 'Adobe Illustrator for Fashion Designers',
    provider: 'Udemy',
    instructor: 'Elena Vasilyeva',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=640&q=80&auto=format&fit=crop',
    category: 'Adobe Illustrator',
    level: 'Intermediate',
    rating: 4.6,
    students: 21300,
    duration: '8.5 hours',
    price: 24,
    isFree: false,
    url: 'https://www.udemy.com/course/illustrator-fashion-design',
    description: 'Learn to create technical fashion flats, mood boards, and presentations using Adobe Illustrator.',
  },
  {
    id: 'ext-6',
    title: 'Fashion Branding & Identity Design',
    provider: 'Coursera',
    instructor: 'Central Saint Martins',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Branding',
    level: 'Intermediate',
    rating: 4.7,
    students: 14800,
    duration: '8 weeks',
    price: 79,
    isFree: false,
    url: 'https://www.coursera.org/learn/fashion-branding',
    description: 'Develop a compelling fashion brand identity, from logo design to brand story and visual language.',
  },
  {
    id: 'ext-7',
    title: 'Fashion Styling: Curating Looks & Editorials',
    provider: 'Skillshare',
    instructor: 'Micaela Erlanger',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Styling',
    level: 'All Levels',
    rating: 4.8,
    students: 28400,
    duration: '3 hours',
    price: 0,
    isFree: true,
    url: 'https://www.skillshare.com/en/classes/fashion-styling',
    description: 'Learn professional styling techniques, how to build a client wardrobe, and create stunning editorial looks.',
  },
  {
    id: 'ext-8',
    title: 'Luxury Fashion Business Strategy',
    provider: 'Coursera',
    instructor: 'HEC Paris',
    thumbnail: 'https://images.unsplash.com/photo-1490481653865-9c845b945831?w=640&q=80&auto=format&fit=crop',
    category: 'Luxury Fashion',
    level: 'Advanced',
    rating: 4.9,
    students: 9200,
    duration: '10 weeks',
    price: 99,
    isFree: false,
    url: 'https://www.coursera.org/learn/luxury-fashion',
    description: 'Deep dive into the business model of luxury fashion houses, brand positioning, and heritage management.',
  },
  {
    id: 'ext-9',
    title: 'Pattern Making for Fashion Designers',
    provider: 'Udemy',
    instructor: 'Susan Khalje',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80&auto=format&fit=crop',
    category: 'Pattern Making',
    level: 'Intermediate',
    rating: 4.7,
    students: 16700,
    duration: '10 hours',
    price: 29,
    isFree: false,
    url: 'https://www.udemy.com/course/pattern-making-fashion',
    description: 'Master flat pattern drafting and draping techniques to create perfectly fitting garments.',
  },
  {
    id: 'ext-10',
    title: 'Streetwear Design: From Concept to Culture',
    provider: 'Skillshare',
    instructor: 'Don C',
    thumbnail: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=640&q=80&auto=format&fit=crop',
    category: 'Streetwear Design',
    level: 'All Levels',
    rating: 4.8,
    students: 19500,
    duration: '5 hours',
    price: 0,
    isFree: true,
    url: 'https://www.skillshare.com/en/classes/streetwear-design',
    description: 'Learn how to design streetwear that resonates with culture, community, and contemporary aesthetics.',
  },
  {
    id: 'ext-11',
    title: 'Digital Illustration for Fashion',
    provider: 'Skillshare',
    instructor: 'Kathryn Zaremba',
    thumbnail: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=640&q=80&auto=format&fit=crop',
    category: 'Digital Illustration',
    level: 'Beginner',
    rating: 4.6,
    students: 11400,
    duration: '3.5 hours',
    price: 0,
    isFree: true,
    url: 'https://www.skillshare.com/en/classes/digital-illustration-fashion',
    description: 'Create stunning digital fashion illustrations using Procreate and other digital tools.',
  },
  {
    id: 'ext-12',
    title: 'Fashion E-commerce: Building Your Online Store',
    provider: 'Udemy',
    instructor: 'Shopify Academy',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion E-commerce',
    level: 'Beginner',
    rating: 4.5,
    students: 22800,
    duration: '7 hours',
    price: 19,
    isFree: false,
    url: 'https://www.udemy.com/course/fashion-ecommerce',
    description: 'Build and launch your fashion brand online with photography, copywriting, and marketing strategies.',
  },
  {
    id: 'ext-13',
    title: 'Tattoo Art Fundamentals',
    provider: 'Skillshare',
    instructor: 'Dr. Woo',
    thumbnail: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=640&q=80&auto=format&fit=crop',
    category: 'Tattoo Design',
    level: 'Beginner',
    rating: 4.7,
    students: 13600,
    duration: '4 hours',
    price: 0,
    isFree: true,
    url: 'https://www.skillshare.com/en/classes/tattoo-art',
    description: 'Learn tattoo design fundamentals, line work, shading, and how to develop your unique artistic style.',
  },
  {
    id: 'ext-14',
    title: 'AI for Fashion Creators: Generative Design',
    provider: 'LinkedIn Learning',
    instructor: 'Adobe',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=640&q=80&auto=format&fit=crop',
    category: 'AI for Fashion Creators',
    level: 'Intermediate',
    rating: 4.5,
    students: 8900,
    duration: '2.5 hours',
    price: 39,
    isFree: false,
    url: 'https://www.linkedin.com/learning/ai-fashion-design',
    description: 'Harness AI tools like Midjourney, Firefly, and ChatGPT to accelerate your fashion design workflow.',
  },
  {
    id: 'ext-15',
    title: 'Fashion Portfolio Building: Land Your Dream Job',
    provider: 'Coursera',
    instructor: 'FIT — Fashion Institute of Technology',
    thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Portfolio Building',
    level: 'All Levels',
    rating: 4.8,
    students: 17300,
    duration: '4 weeks',
    price: 49,
    isFree: false,
    url: 'https://www.coursera.org/learn/fashion-portfolio',
    description: 'Build a compelling fashion portfolio that showcases your skills and lands interviews at top fashion houses.',
  },
  {
    id: 'ext-16',
    title: 'Textile Design & Surface Pattern',
    provider: 'Skillshare',
    instructor: 'Bonnie Christine',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80&auto=format&fit=crop',
    category: 'Textile Design',
    level: 'Intermediate',
    rating: 4.9,
    students: 25600,
    duration: '6 hours',
    price: 0,
    isFree: true,
    url: 'https://www.skillshare.com/en/classes/textile-design',
    description: 'Create beautiful repeating patterns and surface designs for fabric, wallpaper, and home goods.',
  },
  {
    id: 'ext-17',
    title: 'Fashion Marketing in the Digital Age',
    provider: 'Coursera',
    instructor: 'University of the Arts London',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=640&q=80&auto=format&fit=crop',
    category: 'Fashion Marketing',
    level: 'Intermediate',
    rating: 4.6,
    students: 12100,
    duration: '7 weeks',
    price: 69,
    isFree: false,
    url: 'https://www.coursera.org/learn/fashion-marketing',
    description: 'Learn digital marketing strategies specific to fashion brands, from social media to influencer partnerships.',
  },
  {
    id: 'ext-18',
    title: 'Adobe Photoshop for Fashion Editing',
    provider: 'Udemy',
    instructor: 'Phil Steele',
    thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=640&q=80&auto=format&fit=crop',
    category: 'Adobe Photoshop',
    level: 'All Levels',
    rating: 4.7,
    students: 41200,
    duration: '9 hours',
    price: 24,
    isFree: false,
    url: 'https://www.udemy.com/course/photoshop-fashion',
    description: 'Master Photoshop retouching, color grading, and compositing techniques specifically for fashion photography.',
  },
];

export const PROVIDER_COLORS: Record<string, { bg: string; text: string }> = {
  Coursera:          { bg: 'bg-blue-100',   text: 'text-blue-700' },
  Skillshare:        { bg: 'bg-green-100',  text: 'text-green-700' },
  Udemy:             { bg: 'bg-purple-100', text: 'text-purple-700' },
  MasterClass:       { bg: 'bg-neutral-900', text: 'text-white' },
  'LinkedIn Learning': { bg: 'bg-sky-100',  text: 'text-sky-700' },
};
