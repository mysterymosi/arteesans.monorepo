"use server";

import { redirect } from "next/navigation";
import type { Tables } from "@arteesans/supabase";
import { loginSchema, type ActionState } from "@arteesans/shared";
import { createAuthClient } from "@/lib/supabase/server";

export type AuthActionState = ActionState;

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
  }

  const supabase = await createAuthClient();
  const { error: signInError } = await supabase.auth.signInWithPassword(
    parsed.data,
  );

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

  redirect("/");
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/login");
}
