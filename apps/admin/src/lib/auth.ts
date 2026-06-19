import { redirect } from "next/navigation";
import type { Tables } from "@arteesans/supabase";
import { createAuthClient } from "@/lib/supabase/server";

export type AdminSessionUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

type UserProfile = Pick<
  Tables<"users">,
  "id" | "email" | "first_name" | "last_name" | "role" | "status"
>;

export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, role, status")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as UserProfile | null;

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email ?? user.email ?? "",
    firstName: profile.first_name,
    lastName: profile.last_name,
  };
}

export async function requireAdminSessionUser(): Promise<AdminSessionUser> {
  const user = await getAdminSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function formatUserName(
  firstName: string | null,
  lastName: string | null,
  email: string,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email;
}
