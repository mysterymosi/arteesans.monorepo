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
import type { Tables } from "@arteesans/supabase";
import type { ProfileCompletion, SignUpInput } from "@arteesans/shared";
import { supabase } from "@/lib/supabase";

export type UserProfile = Tables<"users">;

type AuthResult = { error?: string };
type SignUpResult = AuthResult & { verified?: boolean };
type SignInResult = AuthResult & { needsVerification?: boolean };

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

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

async function persistProfileFromMetadata(): Promise<string | undefined> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return authError?.message ?? "You are not signed in.";
  }

  const metadata = user.user_metadata ?? {};
  const role = metadata.role === "artisan" ? "artisan" : "customer";

  const { error: userError } = await supabase.from("users").upsert({
    id: user.id,
    role,
    first_name: metadata.first_name ?? null,
    last_name: metadata.last_name ?? null,
    phone: metadata.phone ?? null,
    email: user.email ?? null,
  });

  if (userError) {
    return userError.message;
  }

  if (role === "customer") {
    const { error } = await supabase
      .from("customer_profiles")
      .upsert({ user_id: user.id }, { onConflict: "user_id" });
    if (error) return error.message;
  } else {
    const { error } = await supabase
      .from("artisan_profiles")
      .upsert({ user_id: user.id, address: metadata.location ?? null }, { onConflict: "user_id" });
    if (error) return error.message;
  }

  return undefined;
}

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
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          location: input.location,
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

      const nextProfile = await fetchProfile(data.session.user.id);
      setProfile(nextProfile);
      setIsProfileLoading(false);
      return { verified: true };
    }

    return { verified: false };
  }, []);

  const verifySignUpOtp = useCallback(async (email: string, token: string): Promise<AuthResult> => {
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
  }, []);

  const resendSignUpOtp = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.toLowerCase().includes("not confirmed")) {
          await supabase.auth.resend({ type: "signup", email });
          return { needsVerification: true };
        }
        return { error: error.message };
      }

      console.log("data", data);

      return {};
    },
    [],
  );

  const completeProfile = useCallback(async (input: ProfileCompletion): Promise<AuthResult> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: authError?.message ?? "You are not signed in." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        role: input.role,
      },
    });

    if (updateError) {
      return { error: updateError.message };
    }

    const persistError = await persistProfileFromMetadata();
    if (persistError) return { error: persistError };

    const nextProfile = await fetchProfile(user.id);
    setProfile(nextProfile);
    setIsProfileLoading(false);
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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
      verifySignUpOtp,
      resendSignUpOtp,
      signInWithPassword,
      completeProfile,
      signOut,
    }),
    [signUp, verifySignUpOtp, resendSignUpOtp, signInWithPassword, completeProfile, signOut],
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
