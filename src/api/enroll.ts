import { supabase } from "@/lib/supabaseClient";

export const ENROLLMENTS_TABLE = "course_enrollments";

export type EnrollmentStatus = "in_progress" | "completed";

export type EnrollmentRecord = {
  id: string;
  user_id: string;
  course_slug: string;
  status: EnrollmentStatus;
  progress?: number | null;
  created_at?: string;
  updated_at?: string;
};

export const fetchUserEnrollments = async (userId: string) => {
  const { data, error } = await supabase
    .from(ENROLLMENTS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as EnrollmentRecord[];
};

export const enrollInCourse = async (userId: string, courseSlug: string) => {
  const payload = {
    user_id: userId,
    course_slug: courseSlug,
    status: "in_progress" as EnrollmentStatus,
    progress: 0,
  };

  const { data, error } = await supabase
    .from(ENROLLMENTS_TABLE)
    .upsert(payload, {
      onConflict: "user_id,course_slug",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as EnrollmentRecord;
};

export const completeCourse = async (userId: string, courseSlug: string) => {
  const { error } = await supabase
    .from(ENROLLMENTS_TABLE)
    .update({
      status: "completed" as EnrollmentStatus,
      progress: 100,
    })
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);

  if (error) {
    throw error;
  }
};



