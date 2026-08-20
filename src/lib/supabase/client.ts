import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client. Safe to use in Client Components — the anon key
 * is publishable; Row Level Security enforces data access.
 *
 * Returns a singleton so repeated calls share the same auth state.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
