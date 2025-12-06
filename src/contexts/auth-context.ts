import { createContext } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
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
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<AuthError | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

