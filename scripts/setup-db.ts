import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Please set your local PostgreSQL connection string.');
    console.log('Example: DATABASE_URL=postgresql://username:password@localhost:5432/your_database');
    process.exit(1);
  }

  try {
    console.log('Connecting to local PostgreSQL database...');
    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client, { schema });

    console.log('Setting up database schema...');
    
    // Enable UUID extension
    await client`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    console.log('Database setup completed successfully!');
    console.log('You can now run: npm run db:generate');
    console.log('Then: npm run db:push');
    
    await client.end();
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

main(); 