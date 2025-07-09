import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use the working database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_YCUAQ37aVuDg@ep-frosty-surf-ad5xxcb9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

console.log('Connecting to database...');
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });