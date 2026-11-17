/**
 * Supabase client singleton.
 *
 * Reads credentials from Vite env vars so the same module works in both
 * SSR (server-side) and browser contexts.
 *
 * Required .env variables:
 *   VITE_SUPABASE_URL  – your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY – your project's anon/public key
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
      "Add them to your .env file for Supabase features to work."
  );
}

/**
 * Single shared Supabase client instance.
 * Import this wherever you need database or storage access.
 */
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
