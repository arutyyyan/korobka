import { createContext } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  telegram_user_id: string | null;
  ai_goals: string[];
  ai_context: string | null;
  ai_ai_level: string | null;
  ai_code_level: string | null;
  ai_priority_tracks: string[];
  onboarding_completed: boolean;
  created_at?: string;
};

export type AuthContextValue = {
  loading: boolean;
  profileLoading: boolean;
  profileReady: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isPro: boolean;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<AuthError | null>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
