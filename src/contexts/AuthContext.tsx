import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { AuthContextValue, Profile } from "@/contexts/auth-context";

import { supabase } from "@/lib/supabaseClient";
import { AuthContext } from "@/contexts/auth-context";

const ADMIN_EMAILS = ["alish.abdulin@gmail.com"].map((email) => email.toLowerCase());

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (!error) {
        setSession(data.session ?? null);
      } else {
        console.error("Failed to fetch Supabase session", error);
      }
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) {
        return;
      }
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      setProfileReady(true);
      return;
    }
    let abort = false;
    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileReady(false);
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (!abort) {
        if (error) {
          console.error("Failed to load profile", error);
        } else {
          setProfile(data as Profile);
        }
        setProfileLoading(false);
        setProfileReady(true);
      }
    };
    fetchProfile();

    return () => {
      abort = true;
    };
  }, [userId]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ?? null;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ?? null;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return error ?? null;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    return error ?? null;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      profileLoading,
      profileReady,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin:
        Boolean(profile?.is_admin) ||
        Boolean(session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())),
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }),
    [loading, profileLoading, profileReady, session, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


