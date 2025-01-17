import { db } from "@/db/drizzle";
import { cache } from "react";
import { getUserAuth } from "@/lib/auth/utils";

export const createTRPCContext = cache(async () => {
  const { session } = await getUserAuth();

  return {
    db,
    session,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
