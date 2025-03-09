import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

let config = defineConfig({
  out: './migrations',
  schema: './schema',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:local.db',
  },
});

if (process.env.NODE_ENV === 'production') {
  config = defineConfig({
    out: './migrations',
    schema: './schema',
    dialect: 'turso',
    dbCredentials: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });
}

export default config;
