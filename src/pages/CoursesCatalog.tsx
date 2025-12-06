import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { type Course } from "@/config/courses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseEnrollment } from "@/hooks/use-course-enrollment";
import { useCourses } from "@/hooks/use-courses";

const matchSearch = (course: Course, term: string) => {
  if (!term) {
    return true;
  }
  const haystack = [
    course.title,
    course.description,
    course.summary,
    course.result,
    course.skills.join(" "),
    course.tools?.join(" ") ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
};

const CoursesCatalog = () => {
  const [search, setSearch] = useState("");
  const { openEnrollment, enrollmentDialog, isEnrolled, enrollmentLoading } = useCourseEnrollment();
  const { data: courses = [], isLoading, isError } = useCourses();

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => matchSearch(course, search));
  }, [courses, search]);

  return (
    <>
      <div className="min-h-screen bg-muted/20">
      <section className="container mx-auto px-4 py-8 md:py-12 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Подберите нужный курс
        </h1>

        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по названию, навыку или инструменту"
            className="pl-10 h-11"
          />
        </div>


        {isLoading ? (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-3xl border border-border/40 bg-card/80 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center">
            <p className="text-destructive font-semibold mb-2">Не удалось загрузить курсы</p>
            <p className="text-sm text-muted-foreground">Попробуйте обновить страницу</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course);
            const isEnrollDisabled = Boolean(enrollmentLoading && !enrolled);
            return (
              <article
                key={course.slug ?? course.title}
                className="flex flex-col rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
              <div className="relative h-40 w-full bg-muted/40">
                <img
                  src={course.cover}
                  alt={course.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                  {course.summary && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {course.summary}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-2">
                  <Button
                    className="w-full"
                    variant={enrolled ? "outline" : "default"}
                    onClick={() => openEnrollment(course)}
                    disabled={isEnrollDisabled}
                    size="sm"
                  >
                    {enrolled ? "Продолжить обучение" : "Записаться"}
                  </Button>
                </div>
              </div>
            </article>
            );
          })}
          </div>
        )}

      </section>
      </div>
      {enrollmentDialog}
    </>
  );
};

export default CoursesCatalog;

