import { createClient } from "@supabase/supabase-js";
import type { Database } from "@arteesans/supabase";

/**
 * Service-role client for server actions and route handlers only.
 * Never import this from a client component.
 */
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
