import 'server-only'; // <-- ensure this file cannot be imported from the client

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory } from '#lib/server/trpc';
import { createTRPCContext } from '#lib/trpc/context';
import { makeQueryClient } from './query-client';
import { appRouter } from '#lib/server/routers/_app';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(() =>
  createTRPCContext({ headers: new Headers() })
);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
