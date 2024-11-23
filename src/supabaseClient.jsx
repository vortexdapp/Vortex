// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables.");
}

// Create a single supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
