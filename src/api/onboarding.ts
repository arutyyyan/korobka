import { supabase } from "@/lib/supabaseClient";

export type OnboardingStep = {
  id: string; // совпадает с колонкой в profiles
  title: string;
  description?: string | null;
  type: "single" | "multi";
  max_answers?: number | null;
  order: number;
  options: Array<{
    id: string; // source_value для direction_weights
    label: string;
    order: number;
  }>;
};

export type OnboardingConfig = {
  steps: OnboardingStep[];
};

/**
 * Get onboarding configuration from edge function
 * Fetches configuration from /functions/v1/get-onboarding-config
 * All data comes from backend - no hardcoded fallbacks
 */
export async function getOnboardingConfig(): Promise<OnboardingConfig> {
  // Public endpoint - no authentication required
  const { data, error } = await supabase.functions.invoke(
    "get-onboarding-config"
  );

  if (error) {
    throw new Error(`Failed to fetch onboarding config: ${error.message}`);
  }

  if (!data || !data.steps) {
    throw new Error("Invalid response from onboarding config endpoint");
  }

  return data as OnboardingConfig;
}
