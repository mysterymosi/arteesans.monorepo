import { useMutation } from "@tanstack/react-query";
import type { ProfileCompletion, SignUpInput } from "@arteesans/shared";
import { useAuthActions } from "@/providers/auth-provider";

export function useSignUpMutation() {
  const { signUp } = useAuthActions();
  return useMutation({ mutationFn: (input: SignUpInput) => signUp(input) });
}

export function useSignInMutation() {
  const { signInWithPassword } = useAuthActions();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInWithPassword(email, password),
  });
}

export function useVerifyOtpMutation() {
  const { verifySignUpOtp } = useAuthActions();
  return useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      verifySignUpOtp(email, token),
  });
}

export function useResendOtpMutation() {
  const { resendSignUpOtp } = useAuthActions();
  return useMutation({ mutationFn: (email: string) => resendSignUpOtp(email) });
}

export function useCompleteProfileMutation() {
  const { completeProfile } = useAuthActions();
  return useMutation({
    mutationFn: (input: ProfileCompletion) => completeProfile(input),
  });
}
