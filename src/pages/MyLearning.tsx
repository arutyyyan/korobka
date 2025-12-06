import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";

import AuthButton from "@/components/Auth/AuthButton";
import { Badge } from "@/components/ui/badge";
import { useEnrollments } from "@/hooks/use-enrollments";
import { supabase } from "@/lib/supabaseClient";

type CourseSummary = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
};

const MyLearning = () => {
  const { user, enrollments, loading } = useEnrollments();
  const enrolledSlugs = useMemo(
    () => enrollments.map((record) => record.course_slug).filter(Boolean),
    [enrollments],
  );

  const {
    data: courseList = [],
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: ["my-learning-courses", enrolledSlugs],
    queryFn: () => fetchCoursesBySlugs(enrolledSlugs),
    enabled: enrolledSlugs.length > 0,
    staleTime: 1000 * 60,
  });

  const combinedLoading = loading || coursesLoading;

  const courseMap = useMemo(() => {
    return courseList.reduce<Record<string, CourseSummary>>((acc, course) => {
      if (course.slug) {
        acc[course.slug] = course;
      }
      return acc;
    }, {});
  }, [courseList]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="space-y-3 max-w-xl">
          <Badge variant="secondary" className="mx-auto">
            Моё обучение
          </Badge>
          <h1 className="text-4xl font-semibold">Войдите, чтобы увидеть свои курсы</h1>
          <p className="text-muted-foreground">
            Мы сохраним ваш прогресс на всех устройствах. Авторизация займёт не больше минуты.
          </p>
        </div>
        <AuthButton size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit">
              Моё обучение
            </Badge>
            <h1 className="text-3xl font-bold">Продолжить обучение</h1>
          </div>

          {combinedLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-card animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет курсов</h3>
              <p className="text-muted-foreground mb-4">
                Вы ещё не записались ни на один курс. Выберите курс из каталога, чтобы начать обучение.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((record) => {
                const course = courseMap[record.course_slug];
                if (!course) return null;

                return (
                  <Link
                    key={record.id}
                    to={`/learn/${record.course_slug}`}
                    className="group rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {course.hero_image_url ? (
                        <img
                          src={course.hero_image_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <BookOpen className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      {course.subtitle && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{course.subtitle}</p>
                      )}
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const fetchCoursesBySlugs = async (slugs: string[]) => {
  if (slugs.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("courses")
    .select("id,title,slug,subtitle,description,hero_image_url")
    .in("slug", slugs);

  if (error) {
    throw error;
  }

  return (data ?? []) as CourseSummary[];
};

export default MyLearning;

