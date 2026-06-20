"use server";

import { redirect } from "next/navigation";
import { loginSchema, type ActionState } from "@arteesans/shared";
import { signInAdmin, signOutAdmin } from "@/features/admin/services/auth.service";

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
