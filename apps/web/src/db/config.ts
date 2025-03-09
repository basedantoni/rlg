import { createDatabase } from '@repo/db';
import { createClient } from '@libsql/client';
import { env } from '#lib/env.mjs';

const client =
  env.NODE_ENV === 'production'
    ? createClient({
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
      })
    : createClient({
        url: 'file:local.db',
      });

export const db = createDatabase(client);
