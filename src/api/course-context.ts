import { supabase } from "@/lib/supabaseClient";

export type LessonNode = {
  id: string;
  title: string;
  duration_minutes: number | null;
  video_url?: string | null;
  content_md?: string | null;
};

export type NavigationInfo = {
  inRoadmap: boolean;
  isFirstRoadmapCourse: boolean;
  isLastRoadmapCourse: boolean;
  prevCourseSlug: string | null;
  nextCourseSlug: string | null;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  hidePrevArrow: boolean;
  hideNextArrow: boolean;
  canGoPrevLesson: boolean;
  canGoNextLesson: boolean;
  canGoPrevCourse: boolean;
  canGoNextCourse: boolean;
};

export type CourseContextResponse = {
  course: {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    hero_image_url: string | null;
    level: string | null;
  };
  lessons: LessonNode[];
  completedLessonIds: string[];
  activeLessonId: string;
  navigation: NavigationInfo;
};

export const getCourseContext = async (
  courseSlug: string,
  lessonId: string | null
): Promise<CourseContextResponse> => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session) {
    throw new Error("Не авторизован");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const url = new URL(`${supabaseUrl}/functions/v1/get-course-context`);
  url.searchParams.set("course_slug", courseSlug);
  if (lessonId) {
    url.searchParams.set("lesson_id", lessonId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Не удалось загрузить контекст курса");
  }

  return response.json();
};
