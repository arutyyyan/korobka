import { supabase } from "@/lib/supabaseClient";

export type LessonProgressRecord = {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: string;
  completed_at: string;
};

const PROGRESS_TABLE = "lesson_progress";
const ENROLL_TABLE = "course_enrollments";

export const fetchLessonProgress = async (userId: string, courseSlug: string) => {
  const { data, error } = await supabase
    .from(PROGRESS_TABLE)
    .select("lesson_id,completed_at")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);

  if (error) {
    throw error;
  }

  return (data ?? []) as Pick<LessonProgressRecord, "lesson_id" | "completed_at">[];
};

export const saveLessonProgress = async (userId: string, courseSlug: string, lessonId: string) => {
  const payload = {
    user_id: userId,
    course_slug: courseSlug,
    lesson_id: lessonId,
    completed_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from(PROGRESS_TABLE)
    .upsert(payload, { onConflict: "user_id,lesson_id" });

  if (error) {
    throw error;
  }
};

export const removeLessonProgress = async (userId: string, courseSlug: string, lessonId: string) => {
  const { error } = await supabase
    .from(PROGRESS_TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("lesson_id", lessonId);

  if (error) {
    throw error;
  }
};

export const updateEnrollmentProgress = async (userId: string, courseSlug: string, progress: number) => {
  const { error } = await supabase
    .from(ENROLL_TABLE)
    .update({ progress })
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);

  if (error) {
    throw error;
  }
};


