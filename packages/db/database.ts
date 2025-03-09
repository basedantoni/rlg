import 'dotenv/config';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Determine if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize the database client based on environment
export const db: LibSQLDatabase<typeof schema> = (() => {
  // For production environment, use Turso
  if (process.env.NODE_ENV === 'production') {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, { schema });
  }

  // For development environment
  // In browser, use WebSocket connection
  if (isBrowser) {
    const client = createClient({
      url: process.env.NEXT_PUBLIC_LIBSQL_URL || 'libsql://localhost:8080',
    });
    return drizzle(client, { schema });
  }

  // On server in development, use file-based SQLite
  const client = createClient({
    url: 'file:local.db',
  });
  return drizzle(client, { schema });
})();
