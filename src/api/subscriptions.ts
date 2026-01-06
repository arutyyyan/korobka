import { supabase } from "@/lib/supabaseClient";

export type SubscriptionStatus = "active" | "cancelled";

export type Subscription = {
  id: number;
  user_id: string;
  telegram_user_id: string | null;
  subscription_id: number;
  status: SubscriptionStatus;
  access_until: string;
  plan_name: string | null;
  period: string | null;
  currency: string | null;
  amount: number | null;
  created_at: string;
  updated_at: string;
};

/**
 * Check if current user has pro access
 * Uses user_access table - the single source of truth for PRO access
 *
 * IMPORTANT:
 * - Does NOT use .eq("user_id", userId) - RLS automatically filters by auth.uid()
 * - user_access is server-computed and protected by RLS
 * - This is the ONLY allowed way to check PRO access
 */
export async function checkIsPro(): Promise<boolean> {
  const { data: access, error } = await supabase
    .from("user_access")
    .select("is_pro")
    .single();

  if (error) {
    console.error("Failed to load user access", error);
    return false;
  }

  return Boolean(access?.is_pro);
}

