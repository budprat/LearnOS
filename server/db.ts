import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Get database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

// Validate required environment variable
if (!connectionString) {
  throw new Error('Missing required environment variable: DATABASE_URL. Please check your .env file.');
}

console.log('Connecting to database...');
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });