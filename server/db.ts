import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to add Supabase credentials?",
  );
}

// Extract database connection details from Supabase URL
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project reference from Supabase URL
const projectRef = supabaseUrl.split('://')[1].split('.')[0];

// Create connection string for Supabase database
const connectionString = `postgresql://postgres.${projectRef}:${supabaseKey}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`;

console.log('Connecting to Supabase database...');
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });