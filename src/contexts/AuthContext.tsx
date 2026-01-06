import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { AuthContextValue, Profile } from "@/contexts/auth-context";

import { supabase } from "@/lib/supabaseClient";
import { AuthContext } from "@/contexts/auth-context";

const ADMIN_EMAILS = ["alish.abdulin@gmail.com"].map((email) =>
  email.toLowerCase()
);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const clearAuthState = () => {
    setSession(null);
    setProfile(null);
    setIsPro(false);
    setProfileLoading(false);
    setProfileReady(true);
  };

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (!error) {
        // Проверяем сессию при инициализации
        if (!data.session) {
          // Если сессии нет - принудительно сбрасываем состояние
          clearAuthState();
        } else {
          setSession(data.session);
        }
      } else {
        console.error("Failed to fetch Supabase session", error);
        // При ошибке тоже сбрасываем состояние
        clearAuthState();
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
      // При изменении состояния аутентификации проверяем сессию
      if (!newSession) {
        // Если сессии нет - сбрасываем состояние
        clearAuthState();
      } else {
        setSession(newSession);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id;

  // Загрузка прав доступа из user_access (ОТДЕЛЬНО от профиля)
  // IMPORTANT: НЕ используем .eq("user_id", userId) - RLS автоматически фильтрует по auth.uid()
  const fetchUserAccess = async (): Promise<boolean> => {
    const { data: access, error } = await supabase
      .from("user_access")
      .select("is_pro")
      .single();

    if (error) {
      console.error("Failed to load user access", error);
      return false;
    }

    return Boolean(access?.is_pro);
  };

  // Загрузка профиля (БЕЗ доступа, только персональные данные)
  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      setProfileReady(true);
      setIsPro(false);
      return;
    }
    setProfileLoading(true);
    setProfileReady(false);

    // Загружаем профиль БЕЗ is_pro
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        email,
        full_name,
        avatar_url,
        is_admin,
        telegram_user_id,
        onboarding_completed,
        ai_goals,
        ai_context,
        ai_ai_level,
        ai_code_level,
        ai_priority_tracks,
        created_at
      `
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to load profile", error);
      setProfile(null);
      setIsPro(false);
    } else {
      setProfile(data as Profile);
      // Загружаем права доступа ОТДЕЛЬНО из user_access
      // RLS автоматически фильтрует по auth.uid(), userId не нужен
      const proAccess = await fetchUserAccess();
      setIsPro(proAccess);
    }
    setProfileLoading(false);
    setProfileReady(true);
  };

  useEffect(() => {
    let abort = false;
    const loadProfile = async () => {
      await fetchProfile();
    };
    if (userId) {
      loadProfile();
    } else {
      setProfile(null);
      setProfileLoading(false);
      setProfileReady(true);
    }

    return () => {
      abort = true;
    };
  }, [userId]);

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error ?? null;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ?? null;
  };

  const signOut = async () => {
    // Вызываем signOut, но игнорируем ошибку - всегда сбрасываем состояние
    await supabase.auth.signOut();

    // ЖЁСТКИЙ RESET - всегда сбрасываем состояние, даже если signOut вернул ошибку
    clearAuthState();

    return null;
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
        Boolean(
          session?.user?.email &&
            ADMIN_EMAILS.includes(session.user.email.toLowerCase())
        ),
      isPro,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      refreshProfile,
      clearAuthState,
    }),
    [loading, profileLoading, profileReady, session, profile, isPro]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
