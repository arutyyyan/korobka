import { useQuery } from "@tanstack/react-query";
import { fetchPublishedCourses, fetchCourseBySlug, type Course } from "@/api/courses";

export const useCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchPublishedCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (slug: string | undefined) => {
  return useQuery<Course | null>({
    queryKey: ["course", slug],
    queryFn: () => (slug ? fetchCourseBySlug(slug) : Promise.resolve(null)),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
};


