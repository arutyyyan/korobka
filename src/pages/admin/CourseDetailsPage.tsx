import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";

import {
  courseUpdateSchema,
  lessonCreateSchema,
  type CourseFormValues,
  type LessonFormValues,
  type CourseDetails,
  type LessonSummary,
} from "./CourseDetailsPage.types";
import {
  CourseHeader,
  CourseLessonsList,
} from "./CourseDetailsPage.components";
import { CourseBasicInfoForm } from "./CourseBasicInfoForm";
import { CourseMarketingForm } from "./CourseMarketingForm";
import { AddLessonDialog } from "./AddLessonDialog";
import { uploadCourseCover } from "@/lib/storage";

const fetchCourseDetails = async (courseId: string) => {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      "id,title,slug,subtitle,description,hero_image_url,cover_image_url,level,is_published,result,duration,difficulty,tools,skills,program,created_at"
    )
    .eq("id", courseId)
    .single();

  if (courseError) {
    throw courseError;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id,title,order_index,video_url,created_at")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (lessonsError) {
    throw lessonsError;
  }

  return {
    course: course as CourseDetails,
    lessons: (lessons ?? []) as LessonSummary[],
  };
};

const CourseDetailsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-64 w-full rounded-2xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
    <Skeleton className="h-32 w-full rounded-2xl" />
  </div>
);

const CourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [savingCourse, setSavingCourse] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);

  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseUpdateSchema),
    defaultValues: {
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      heroImageUrl: "",
      level: "beginner",
      isPublished: false,
      result: "",
      duration: "",
      difficulty: undefined,
      tools: [],
      skills: [],
      program: [],
    },
  });

  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      contentMd: "",
      durationMinutes: undefined,
    },
  });

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["admin-course", courseId],
    queryFn: () => fetchCourseDetails(courseId!),
    enabled: Boolean(courseId),
  });

  if (!courseId) {
    return (
      <AdminLayout
        title="Курс не выбран"
        description="Выберите курс из списка, чтобы посмотреть детали."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/courses")}
          >
            Все курсы
          </Button>
        }
      >
        <Alert>
          <AlertTitle>Нет курса</AlertTitle>
          <AlertDescription>
            Пожалуйста, вернитесь к списку курсов и выберите нужный.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  const course = data?.course ?? null;
  const lessons = data?.lessons ?? [];
  const subtitle =
    course?.subtitle ?? course?.description ?? "Курс без описания";
  const lessonsCount = useMemo(() => lessons.length, [lessons]);

  useEffect(() => {
    if (course) {
      const coverUrl = course.cover_image_url ?? course.hero_image_url ?? "";
      courseForm.reset({
        title: course.title ?? "",
        slug: course.slug ?? "",
        subtitle: course.subtitle ?? "",
        description: course.description ?? "",
        heroImageUrl: coverUrl,
        level: (course.level ?? "beginner") as CourseFormValues["level"],
        isPublished: Boolean(course.is_published),
        result: course.result ?? "",
        duration: course.duration ?? "",
        difficulty:
          course.difficulty !== null && course.difficulty !== undefined
            ? Number(course.difficulty)
            : undefined,
        tools: course.tools ?? [],
        skills: course.skills ?? [],
        program: course.program ?? [],
      });
      setCoverPreview(coverUrl || null);
    }
  }, [course, courseForm]);

  const handleCoverUpload = async (file: File) => {
    if (!courseId) {
      return;
    }
    setUploadingCover(true);
    try {
      const publicUrl = await uploadCourseCover(file, courseId);
      setCoverPreview(publicUrl);
      courseForm.setValue("heroImageUrl", publicUrl);
      toast({
        title: "Обложка загружена",
        description:
          "Обложка успешно загружена. Не забудьте сохранить изменения.",
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить обложку",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverRemove = () => {
    setCoverPreview(null);
    courseForm.setValue("heroImageUrl", "");
  };

  const handleCourseSubmit = async (values: CourseFormValues) => {
    if (!courseId) {
      return;
    }
    setSavingCourse(true);
    const coverUrl =
      values.heroImageUrl && values.heroImageUrl.trim().length > 0
        ? values.heroImageUrl.trim()
        : null;
    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      subtitle: values.subtitle?.trim() || null,
      description: values.description?.trim() || null,
      cover_image_url: coverUrl,
      hero_image_url: coverUrl, // Keep for backward compatibility
      level: values.level,
      is_published: values.isPublished,
      result: values.result?.trim() || null,
      duration: values.duration?.trim() || null,
      difficulty: values.difficulty || null,
      tools: values.tools.filter((t) => t.trim().length > 0),
      skills: values.skills.filter((s) => s.trim().length > 0),
      program: values.program.filter((p) => p.trim().length > 0),
    };
    const { error: updateError } = await supabase
      .from("courses")
      .update(payload)
      .eq("id", courseId);
    setSavingCourse(false);
    if (updateError) {
      toast({
        title: "Не удалось сохранить курс",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Курс обновлён",
      description: "Изменения успешно сохранены.",
    });
    void queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    void queryClient.invalidateQueries({
      queryKey: ["admin-course", courseId],
    });
    void refetch();
  };

  const handleLessonSubmit = async (values: LessonFormValues) => {
    if (!course) {
      toast({
        title: "Курс не найден",
        description: "Обновите страницу и попробуйте снова.",
        variant: "destructive",
      });
      return;
    }
    setCreatingLesson(true);
    const nextOrder =
      lessons.length > 0
        ? Math.max(
            ...lessons.map((lesson) =>
              typeof lesson.order_index === "number" ? lesson.order_index : -1
            )
          ) + 1
        : 0;

    const { data: newLesson, error: insertError } = await supabase
      .from("lessons")
      .insert({
        course_id: course.id,
        title: values.title.trim(),
        video_url:
          values.videoUrl && values.videoUrl.length > 0
            ? values.videoUrl
            : null,
        content_md: values.contentMd ?? null,
        duration_minutes: values.durationMinutes ?? null,
        order_index: nextOrder,
      })
      .select("id")
      .single();

    setCreatingLesson(false);
    if (insertError || !newLesson) {
      toast({
        title: "Не удалось добавить урок",
        description: insertError?.message || "Попробуйте снова",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Урок добавлен",
      description: "Новый урок появился в списке.",
    });

    lessonForm.reset({
      title: "",
      videoUrl: "",
      contentMd: "",
      durationMinutes: undefined,
    });

    void queryClient.invalidateQueries({
      queryKey: ["admin-course", courseId],
    });
    void refetch();

    // Return lesson ID for file upload
    return newLesson.id;
  };

  return (
    <AdminLayout
      title={course?.title ?? "Загрузка курса..."}
      description={subtitle}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate("/admin/courses/new")}>
            Создать курс
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Не удалось загрузить курс</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Попробуйте обновить страницу немного позже."}
            </AlertDescription>
          </Alert>
        ) : null}

        {isLoading && !course ? (
          <CourseDetailsSkeleton />
        ) : course ? (
          <>
            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-6">
              <CourseHeader course={course} lessonsCount={lessonsCount} />

              <Form {...courseForm}>
                <form
                  onSubmit={courseForm.handleSubmit(handleCourseSubmit)}
                  className="space-y-4"
                >
                  <CourseBasicInfoForm
                    control={courseForm.control}
                    coverPreview={coverPreview}
                    uploadingCover={uploadingCover}
                    onCoverUpload={handleCoverUpload}
                    onCoverRemove={handleCoverRemove}
                  />

                  <CourseMarketingForm control={courseForm.control} />

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={savingCourse} size="sm">
                      {savingCourse ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        "Сохранить изменения"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </section>

            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Уроки курса</h2>
                  <p className="text-sm text-muted-foreground">
                    {lessonsCount > 0
                      ? "Выберите урок, чтобы посмотреть содержимое."
                      : "Добавьте первый урок, нажав кнопку ниже."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsAddLessonDialogOpen(true)}
                    size="sm"
                  >
                    Добавить урок
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading || isRefetching}
                  >
                    Обновить
                  </Button>
                </div>
              </div>

              <CourseLessonsList course={course} lessons={lessons} />
            </section>

            <AddLessonDialog
              open={isAddLessonDialogOpen}
              onOpenChange={setIsAddLessonDialogOpen}
              form={lessonForm}
              onSubmit={handleLessonSubmit}
              submitting={creatingLesson}
            />
          </>
        ) : (
          <Alert>
            <AlertTitle>Курс не найден</AlertTitle>
            <AlertDescription>
              Возможно, курс был удалён. Вернитесь к списку и попробуйте снова.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
};

export default CourseDetailsPage;
