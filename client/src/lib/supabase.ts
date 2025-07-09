import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://udjwjoymlofdocclufxv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkandqb3ltbG9mZG9jY2x1Znh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDkwMzYsImV4cCI6MjA2MTUyNTAzNn0.mN9DM5QJGysbPOplOBSS7WH1qhPk4Y67JMd2gafzEog';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);