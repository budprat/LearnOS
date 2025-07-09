import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to add Supabase credentials?",
  );
}

// Extract database URL from Supabase URL
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create connection string for Supabase database
const dbUrl = supabaseUrl.replace('https://', '').replace('http://', '');
const projectRef = dbUrl.split('.')[0];
const connectionString = `postgresql://postgres.${projectRef}:${supabaseKey}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });