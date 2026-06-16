import type { Tables } from "@arteesans/supabase";

export type UserProfile = Tables<"users">;

export type AuthResult = { error?: string };
export type SignUpResult = AuthResult & { verified?: boolean; userId?: string };
export type SignInResult = AuthResult & { needsVerification?: boolean };
