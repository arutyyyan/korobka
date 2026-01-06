import { supabase } from "@/lib/supabaseClient";

export type CourseStatus = "not_started" | "in_progress" | "completed";

export type RoadmapStep = {
  groupId: string;
  title: string;
  outcome?: string | null;
  directionId: string;
  progress: { completed: number; total: number };
  courses: Array<{
    slug: string;
    status: CourseStatus;
  }>;
};

export type RoadmapResponse = {
  steps: RoadmapStep[];
  currentGroupId: string | null;
};

export const getUserRoadmap = async (): Promise<RoadmapResponse> => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session) {
    throw new Error("Не авторизован");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/get-user-roadmap`;

  const response = await fetch(functionUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Не удалось загрузить роадмап");
  }

  return response.json();
};
