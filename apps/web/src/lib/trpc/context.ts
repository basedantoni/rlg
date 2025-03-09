import { db } from '#db/config';
import { getUserAuth } from '#lib/auth/utils';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { session } = await getUserAuth();

  return {
    db,
    session,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
