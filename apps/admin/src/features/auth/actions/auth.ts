"use server";

import { redirect } from "next/navigation";
import { loginSchema, type ActionState, type LoginInput } from "@arteesans/shared";
import { signInAdmin, signOutAdmin } from "@/features/auth/services/auth.service";

export type AuthActionState = ActionState;

export async function signIn(input: LoginInput): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
  }

  const result = await signInAdmin(parsed.data);
  if (result.error) {
    return result;
  }

  redirect("/");
}

export async function signOut() {
  await signOutAdmin();
  redirect("/login");
}
