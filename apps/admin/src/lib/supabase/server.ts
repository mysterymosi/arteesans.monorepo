import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@arteesans/supabase";
import { cookies } from "next/headers";
import { getServiceRoleKey, supabaseAnonKey, supabaseUrl } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Cookie-backed Supabase client for authenticated server components and actions.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component where cookies are read-only.
        }
      },
    },
  });
}

/**
 * Service-role client for server actions and route handlers only.
 * Never import this from a client component.
 */
export function createServiceClient() {
  return createClient<Database>(supabaseUrl, getServiceRoleKey(), {
    auth: { persistSession: false },
  });
}
