import type { Tables } from "@arteesans/supabase";
import { createAuthClient } from "@/lib/supabase/server";

export async function signInAdmin(input: { email: string; password: string }) {
  const supabase = await createAuthClient();
  const { error: signInError } = await supabase.auth.signInWithPassword(input);

  if (signInError) {
    return { error: signInError.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unable to establish a session" };
  }

  const { data } = await supabase
    .from("users")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as Pick<Tables<"users">, "role" | "status"> | null;

  if (profile?.role !== "admin" || profile?.status !== "active") {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access" };
  }

  return {};
}

export async function signOutAdmin() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
}
