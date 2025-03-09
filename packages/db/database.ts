import 'dotenv/config';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient, Client } from '@libsql/client';
import * as schema from './schema';

export const createDatabase: (
  client: Client
) => LibSQLDatabase<typeof schema> = (client) => {
  return drizzle(client, { schema });
};

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
    return createDatabase(client);
  }

  // For development environment
  // In browser, use WebSocket connection
  if (isBrowser) {
    const client = createClient({
      url: process.env.NEXT_PUBLIC_LIBSQL_URL || 'libsql://localhost:8080',
    });
    return createDatabase(client);
  }

  // On server in development, use file-based SQLite
  const client = createClient({
    url: 'file:local.db',
  });
  return createDatabase(client);
})();
