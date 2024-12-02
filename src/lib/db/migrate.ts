// src/lib/db/migrate.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { env } from '../env';

const runMigrate = async () => {
  const sql = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: 'drizzle' });
  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});