export type { AuthResult, SignInResult, SignUpResult, UserProfile } from "./types";
export { getPostAuthRoute, isProfileComplete, resolvePostAuthRoute } from "./lib/auth-routing";
export {
  useCompleteProfileMutation,
  useResendOtpMutation,
  useSignInMutation,
  useSignUpMutation,
  useVerifyOtpMutation,
} from "./hooks/use-auth-mutations";
