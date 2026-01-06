import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { PublicCourse, LessonNode } from "./CoursePlayer.types";

export const useCourse = (courseSlug: string | undefined, userId: string | undefined) => {
  return useQuery({
    queryKey: ["course", courseSlug],
    enabled: !!courseSlug && !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!courseSlug) throw new Error("Course slug is required");
      
      const { data, error } = await supabase
        .from("courses")
        .select(
          "id, title, slug, subtitle, description, hero_image_url, level, is_published"
        )
        .eq("slug", courseSlug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data as PublicCourse & { id: string };
    },
  });
};

export const useLessons = (
  courseId: string | undefined,
  userId: string | undefined,
  isPro: boolean
) => {
  return useQuery({
    queryKey: ["lessons", courseId, isPro],
    enabled: !!courseId && !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!courseId) return [];

      // For pro users, fetch full lesson data
      // For non-pro users, fetch limited data for all lessons
      if (isPro) {
        const { data, error } = await supabase
          .from("lessons")
          .select(
            "id, title, order_index, duration_minutes, video_url, content_md"
          )
          .eq("course_id", courseId)
          .order("order_index", { ascending: true });

        if (error) throw error;
        return (data ?? []) as LessonNode[];
      } else {
        // Non-pro: fetch all lessons with limited fields
        const { data: allLessons, error: allError } = await supabase
          .from("lessons")
          .select("id, title, order_index, duration_minutes")
          .eq("course_id", courseId)
          .order("order_index", { ascending: true });

        if (allError) throw allError;

        // Fetch full data for first lesson only
        if (allLessons && allLessons.length > 0) {
          const firstLesson = allLessons[0];
          const { data: firstLessonFull, error: firstError } = await supabase
            .from("lessons")
            .select("video_url, content_md")
            .eq("id", firstLesson.id)
            .single();

          if (firstError) throw firstError;

          return allLessons.map((lesson, index) => {
            if (index === 0 && firstLessonFull) {
              return {
                id: lesson.id,
                title: lesson.title,
                duration_minutes: lesson.duration_minutes,
                video_url: firstLessonFull.video_url,
                content_md: firstLessonFull.content_md,
              } as LessonNode;
            }
            return {
              id: lesson.id,
              title: lesson.title,
              duration_minutes: lesson.duration_minutes,
            } as LessonNode;
          });
        }

        return (allLessons ?? []).map(
          (l) =>
            ({
              id: l.id,
              title: l.title,
              duration_minutes: l.duration_minutes,
            } as LessonNode)
        );
      }
    },
  });
};

export const useLessonProgress = (
  userId: string | undefined,
  courseSlug: string | undefined
) => {
  return useQuery({
    queryKey: ["lesson-progress", userId, courseSlug],
    enabled: !!userId && !!courseSlug,
    staleTime: 60_000,
    queryFn: async () => {
      if (!userId || !courseSlug) return [];
      
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", userId)
        .eq("course_slug", courseSlug);

      if (error) throw error;
      return data?.map((l) => l.lesson_id) ?? [];
    },
  });
};









