import type { SignUpInput } from "@arteesans/shared";
import { supabase } from "@/lib/supabase";
import type { AuthResult, SignInResult, SignUpResult } from "@/features/auth/types";
import { persistProfileFromMetadata } from "@/features/auth/services/profile.service";

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        location: input.location,
        latitude: input.latitude,
        longitude: input.longitude,
        role: input.role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    const persistError = await persistProfileFromMetadata();
    if (persistError) return { error: persistError };
    return { verified: true, userId: data.session.user.id };
  }

  return { verified: false };
}

export async function verifySignUpOtp(email: string, token: string): Promise<AuthResult> {
  let { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" });

  if (error) {
    const retry = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (retry.error) {
      return { error: error.message };
    }
  }

  const persistError = await persistProfileFromMetadata();
  if (persistError) return { error: persistError };

  return {};
}

export async function resendSignUpOtp(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) {
    return { error: error.message };
  }
  return {};
}

export async function signInWithPassword(email: string, password: string): Promise<SignInResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("not confirmed")) {
      await supabase.auth.resend({ type: "signup", email });
      return { needsVerification: true };
    }
    return { error: error.message };
  }

  return {};
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
