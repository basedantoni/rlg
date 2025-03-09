import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import 'dotenv/config';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_SIGNING_SECRET: z.string().min(1),
    BASE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_SIGNING_SECRET: process.env.CLERK_SIGNING_SECRET,
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});
