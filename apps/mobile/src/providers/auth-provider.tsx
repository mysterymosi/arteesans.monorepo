import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import type { ProfileCompletion, SignUpInput } from "@arteesans/shared";
import {
  resendSignUpOtp,
  signInWithPassword,
  signOut as signOutService,
  signUp as signUpService,
  verifySignUpOtp,
} from "@/features/auth/services/auth.service";
import {
  completeProfile as completeProfileService,
  fetchProfile,
} from "@/features/auth/services/profile.service";
import type {
  AuthResult,
  SignInResult,
  SignUpResult,
  UserProfile,
} from "@/features/auth/types";
import { supabase } from "@/lib/supabase";

export type { UserProfile };

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
};

type ProfileContextValue = {
  profile: UserProfile | null;
  isProfileLoading: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
};

type AuthActionsContextValue = {
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  verifySignUpOtp: (email: string, token: string) => Promise<AuthResult>;
  resendSignUpOtp: (email: string) => Promise<AuthResult>;
  signInWithPassword: (email: string, password: string) => Promise<SignInResult>;
  completeProfile: (input: ProfileCompletion) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);
const ProfileContext = createContext<ProfileContextValue | null>(null);
const AuthActionsContext = createContext<AuthActionsContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const sessionRef = useRef<Session | null>(null);

  sessionRef.current = session;

  const refreshProfile = useCallback(async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    const userId = currentSession?.user.id ?? sessionRef.current?.user.id;
    if (!userId) {
      setProfile(null);
      return null;
    }

    const nextProfile = await fetchProfile(userId);
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setIsProfileLoading(Boolean(data.session));
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsProfileLoading(Boolean(nextSession));
      if (!nextSession) {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!session?.user.id) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);

    fetchProfile(session.user.id)
      .then((nextProfile) => {
        if (mounted) {
          setProfile(nextProfile);
          setIsProfileLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setProfile(null);
          setIsProfileLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [session?.user.id]);

  const signUp = useCallback(async (input: SignUpInput): Promise<SignUpResult> => {
    const result = await signUpService(input);
    if (result.error || !result.verified || !result.userId) {
      return result;
    }

    const nextProfile = await fetchProfile(result.userId);
    setProfile(nextProfile);
    setIsProfileLoading(false);
    return result;
  }, []);

  const verifySignUpOtpAction = useCallback(
    async (email: string, token: string): Promise<AuthResult> => verifySignUpOtp(email, token),
    [],
  );

  const resendSignUpOtpAction = useCallback(
    async (email: string): Promise<AuthResult> => resendSignUpOtp(email),
    [],
  );

  const signInWithPasswordAction = useCallback(
    async (email: string, password: string): Promise<SignInResult> =>
      signInWithPassword(email, password),
    [],
  );

  const completeProfile = useCallback(async (input: ProfileCompletion): Promise<AuthResult> => {
    const result = await completeProfileService(input);
    if (result.error) {
      return result;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const nextProfile = await fetchProfile(user.id);
      setProfile(nextProfile);
      setIsProfileLoading(false);
    }

    return result;
  }, []);

  const signOut = useCallback(async () => {
    await signOutService();
    setProfile(null);
  }, []);

  const sessionValue = useMemo(() => ({ session, isLoading }), [session, isLoading]);
  const profileValue = useMemo(
    () => ({ profile, isProfileLoading, refreshProfile }),
    [profile, isProfileLoading, refreshProfile],
  );
  const actionsValue = useMemo(
    () => ({
      signUp,
      verifySignUpOtp: verifySignUpOtpAction,
      resendSignUpOtp: resendSignUpOtpAction,
      signInWithPassword: signInWithPasswordAction,
      completeProfile,
      signOut,
    }),
    [
      signUp,
      verifySignUpOtpAction,
      resendSignUpOtpAction,
      signInWithPasswordAction,
      completeProfile,
      signOut,
    ],
  );

  return (
    <SessionContext.Provider value={sessionValue}>
      <ProfileContext.Provider value={profileValue}>
        <AuthActionsContext.Provider value={actionsValue}>{children}</AuthActionsContext.Provider>
      </ProfileContext.Provider>
    </SessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthProvider");
  }
  return context;
}

export function useAuthProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useAuthProfile must be used within AuthProvider");
  }
  return context;
}

export function useAuthActions() {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error("useAuthActions must be used within AuthProvider");
  }
  return context;
}

/** Convenience hook — prefer scoped hooks when only part of auth state is needed. */
export function useAuth() {
  return {
    ...useAuthSession(),
    ...useAuthProfile(),
    ...useAuthActions(),
  };
}
