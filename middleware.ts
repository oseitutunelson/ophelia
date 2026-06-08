import { authMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/edgestore/(.*)',
    '/api/users/(.*)/stats',
    '/api/job',
    '/api/work',
    '/api/profile',
    '/api/profile/(.*)',
    // Payment webhooks — called by Paystack/Stripe servers, no session
    '/api/subscription/paystack/webhook',
    '/api/subscription/stripe/webhook',
    // Go Pro page and success page — accessible before sign-in
    '/go-pro',
    '/go-pro/(.*)',
    // Blog — readable by anyone, write actions require auth
    '/blog',
    '/blog/(.*)',
    '/api/blog',
    '/api/blog/(.*)',
    // Advertise landing page — publicly viewable
    '/advertise',
    // Ads feed — publicly readable
    '/api/ads',
    // Learning platform — browsable without auth; enrolled routes require auth
    '/learn',
    '/learn/(.*)',
    '/teach',
    '/api/courses',
    '/api/courses/(.*)',
    '/api/courses/external',
    // External instructor profile — publicly readable
    '/api/instructor',
    // About page and public stats
    '/about',
    '/api/public/(.*)'
  ]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
