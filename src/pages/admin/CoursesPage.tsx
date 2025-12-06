import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { COURSE_LEVEL_LABELS, formatDate } from "@/lib/utils";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  level: keyof typeof COURSE_LEVEL_LABELS | null;
  is_published: boolean;
  created_at: string | null;
};

const fetchCourses = async (): Promise<CourseRow[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("id,title,slug,subtitle,description,level,is_published,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: fetchCourses,
  });

  const hasCourses = useMemo(() => courses.length > 0, [courses.length]);

  return (
    <AdminLayout
      title="Курсы"
      description="Все курсы, созданные администраторами."
      actions={
        <Button onClick={() => navigate("/admin/courses/new")} size="sm">
          Создать курс
        </Button>
      }
    >
      <div className="space-y-6">
        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Не удалось загрузить курсы</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Попробуйте обновить страницу чуть позже."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-2xl border bg-background shadow-sm">
          <div className="flex flex-col gap-2 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Все курсы</p>
              <p className="text-sm text-muted-foreground">Всего: {courses.length}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
            >
              Обновить
            </Button>
          </div>

          <div className="p-4">
            {isLoading ? (
              <CoursesTableSkeleton />
            ) : !hasCourses ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-base font-medium">Курсов пока нет</p>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  Создайте свой первый курс, чтобы начать заполнять библиотеку.
                </p>
                <Button className="mt-6" onClick={() => navigate("/admin/courses/new")}>
                  Добавить курс
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Курс</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Уровень</TableHead>
                    <TableHead className="text-right">Создан</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow
                      key={course.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/admin/courses/${course.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigate(`/admin/courses/${course.id}`);
                        }
                      }}
                      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <TableCell>
                        <div className="font-medium">{course.title}</div>
                        <p className="text-xs text-muted-foreground">
                          {course.subtitle || course.description || "Нет описания"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs">{course.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            course.is_published
                              ? "border-0 bg-emerald-100 text-emerald-700"
                              : "border-0 bg-amber-100 text-amber-700"
                          }
                        >
                          {course.is_published ? "Опубликован" : "Черновик"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {course.level ? (
                          <Badge variant="secondary" className="capitalize">
                            {COURSE_LEVEL_LABELS[course.level]}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatDate(course.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const CoursesTableSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-5">
          <div className="sm:col-span-2 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24 sm:justify-self-end" />
        </div>
      ))}
    </div>
  );
};

export default CoursesPage;


