import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/lib/trpc/context';
import { appRouter } from '@/lib/server/routers/_app';

const handler = (req: Request) =>
        fetchRequestHandler({
                endpoint: '/api/trpc',
                req,
                router: appRouter,
                createContext: createTRPCContext,
        });
export { handler as GET, handler as POST };