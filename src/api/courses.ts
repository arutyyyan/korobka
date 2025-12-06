import { supabase } from "@/lib/supabaseClient";
import type { Course } from "@/config/courses";
import align1 from "@/assets/align1.webp";
import align2 from "@/assets/align2.webp";
import align3 from "@/assets/align3.webp";

export type CourseFromDB = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
  cover_image_url: string | null;
  level: string | null;
  is_published: boolean;
  lessons_label: string | null;
  result: string | null;
  duration: string | null;
  difficulty: string | null;
  tools: string[] | null;
  skills: string[] | null;
  summary: string | null;
  program: string[] | null;
  external_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const getCoverImage = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return "";
  }
  
  // If it's a Supabase storage URL or any full URL, return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  // Map known asset paths to imports
  const assetMap: Record<string, string> = {
    "align1.webp": align1,
    "align2.webp": align2,
    "align3.webp": align3,
  };
  
  // If it's a known asset, use the import
  if (assetMap[imageUrl]) {
    return assetMap[imageUrl];
  }
  
  // If it starts with /, it's a public path
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }
  
  // Otherwise, assume it's a relative path or full URL
  return imageUrl;
};

export const mapCourseFromDB = (dbCourse: CourseFromDB): Course => {
  const coverImage = dbCourse.cover_image_url ?? dbCourse.hero_image_url;
  
  return {
    slug: dbCourse.slug,
    title: dbCourse.title,
    subtitle: dbCourse.subtitle ?? undefined,
    description: dbCourse.description ?? "",
    result: dbCourse.result ?? "",
    cover: getCoverImage(coverImage),
    skills: dbCourse.skills ?? [],
    program: dbCourse.program ?? undefined,
    url: dbCourse.external_url ?? undefined,
    difficulty: dbCourse.difficulty ?? undefined,
    duration: dbCourse.duration ?? undefined,
    tools: dbCourse.tools ?? undefined,
    summary: dbCourse.summary ?? undefined,
    lessons: dbCourse.lessons_label ?? undefined,
  };
};

export const fetchPublishedCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch courses:", error);
    throw error;
  }

  return (data as CourseFromDB[]).map(mapCourseFromDB);
};

export const fetchCourseBySlug = async (slug: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Failed to fetch course:", error);
    throw error;
  }

  return mapCourseFromDB(data as CourseFromDB);
};

