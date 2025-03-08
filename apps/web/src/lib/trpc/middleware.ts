import { TRPCError } from '@trpc/server';
import { Context } from '#/lib/trpc/context';
import { initTRPC } from '@trpc/server';

// Re-create the tRPC instance for middleware
// Note: This is a simplified version and we should ideally import directly from server/trpc.ts
const t = initTRPC.context<Context>().create();

/**
 * Middleware to check if user is authenticated
 * Provides better error messages than the default enforceUserAuth middleware
 */
export const authMiddleware = t.middleware(({ ctx, next }) => {
  // If no session exists, throw a friendly unauthorized error
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to access this resource',
    });
  }

  // Continue with the request with the user session
  return next({
    ctx: {
      ...ctx,
      // Ensure session is available to the resolver
      session: { ...ctx.session },
    },
  });
});
