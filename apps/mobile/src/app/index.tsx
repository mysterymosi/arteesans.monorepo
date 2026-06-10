import { Redirect } from "expo-router";

/**
 * Entry gate. Phase 1 will check the Supabase session and user role,
 * then route to (customer) or (artisan). Until then, start at auth.
 */
export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
