import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../src/shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Please set your local PostgreSQL connection string.');
    process.exit(1);
  }

  try {
    console.log('Connecting to local PostgreSQL database...');
    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client, { schema });

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Migration completed successfully!');
    await client.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 