import { supabase } from "@/lib/supabaseClient";

export type CompleteLessonResponse = {
  courseCompleted: boolean;
};

export const completeLesson = async (
  courseSlug: string,
  lessonId: string
): Promise<CompleteLessonResponse> => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session) {
    throw new Error("Не авторизован");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/complete-lesson`;

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session.access_token}`,
    },
    body: JSON.stringify({
      course_slug: courseSlug,
      lesson_id: lessonId,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Не удалось завершить урок");
  }

  return response.json();
};
