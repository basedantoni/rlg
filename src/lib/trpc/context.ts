import { db } from "@/db/drizzle";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  return {
    db,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
