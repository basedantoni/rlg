import 'dotenv/config';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { db } from '../database';
import { migrate } from 'drizzle-orm/libsql/migrator';

// Get current file directory to create absolute paths
const __dirname = dirname(fileURLToPath(import.meta.url));

const runMigrate = async () => {
  console.log('⏳ Running migrations...');

  const start = Date.now();

  // Use absolute path to migrations folder
  const migrationsFolder = join(__dirname, '..', 'migrations');

  await migrate(db, { migrationsFolder });

  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
