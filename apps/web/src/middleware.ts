import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your middleware
const isAppRoute = createRouteMatcher([
  '/accountability(.*)',
  '/categories(.*)',
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/quests(.*)',
  '/settings(.*)',
]);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes with (app) pattern but exclude ones that also have (auth)
  if (isAppRoute(req) && !isAuthRoute(req)) {
    await auth.protect({ unauthorizedUrl: '/sign-in?unauthorized=true' });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
