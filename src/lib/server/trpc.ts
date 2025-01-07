import { initTRPC } from "@trpc/server";
import { Context } from "@/lib/trpc/context";
import SuperJSON from "superjson";
import { ZodError } from "zod";

/**
 * Initialize tRPC backend
 * Only needed once per backend
 */
const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * TODO: middleware that enforces user authentication
 */

/**
 * TODO: protected procedure for only loggedin users
 */
