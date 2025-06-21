import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../src/shared/schema";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a database connection
const client = postgres(process.env.DATABASE_URL);

// Create a Drizzle ORM instance with the schema
export const db = drizzle(client, { schema });