import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminLayout from "@/components/admin/AdminLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/utils";
import { getVideoEmbed } from "@/lib/video";
import { MarkdownPreview, MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type LessonDetails = {
  id: string;
  title: string;
  video_url: string | null;
  content_md: string | null;
  order_index: number | null;
  course_id: string;
  created_at: string | null;
};

type CourseSummary = {
  id: string;
  title: string;
};

const lessonUpdateSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  videoUrl: z.union([z.string().url("Укажите корректный URL"), z.literal("")]).optional(),
  contentMd: z.string().optional(),
});

type LessonFormValues = z.infer<typeof lessonUpdateSchema>;

const fetchLessonDetails = async (lessonId: string) => {
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id,title,video_url,content_md,order_index,course_id,created_at")
    .eq("id", lessonId)
    .single();

  if (lessonError) {
    throw lessonError;
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id,title")
    .eq("id", lesson.course_id)
    .single();

  if (courseError) {
    throw courseError;
  }

  return {
    lesson: lesson as LessonDetails,
    course: course as CourseSummary,
  };
};

const LessonDetailsPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["admin-lesson", lessonId],
    queryFn: () => fetchLessonDetails(lessonId!),
    enabled: Boolean(lessonId),
  });

  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonUpdateSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      contentMd: "",
    },
  });

  if (!lessonId) {
    return (
      <AdminLayout
        title="Урок не выбран"
        description="Вернитесь к курсу и выберите нужный урок."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/courses")}>
            Все курсы
          </Button>
        }
      >
        <Alert>
          <AlertTitle>Нет урока</AlertTitle>
          <AlertDescription>Сначала выберите урок в списке.</AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  const lesson = data?.lesson ?? null;
  const course = data?.course ?? null;
  const parentCourseId = courseId ?? lesson?.course_id ?? "";
  const orderLabel = useMemo(() => {
    if (!lesson) return "--";
    return ((lesson.order_index ?? 0) + 1).toString().padStart(2, "0");
  }, [lesson]);
  const videoEmbed = useMemo(() => getVideoEmbed(lesson?.video_url), [lesson?.video_url]);

  useEffect(() => {
    if (lesson) {
      lessonForm.reset({
        title: lesson.title ?? "",
        videoUrl: lesson.video_url ?? "",
        contentMd: lesson.content_md ?? "",
      });
    }
  }, [lesson, lessonForm]);

  const handleLessonSave = async (values: LessonFormValues) => {
    if (!lesson) return;
    setSaving(true);
    const payload = {
      title: values.title.trim(),
      video_url: values.videoUrl && values.videoUrl.length > 0 ? values.videoUrl : null,
      content_md: values.contentMd ?? null,
    };
    const { error: updateError } = await supabase.from("lessons").update(payload).eq("id", lesson.id);
    setSaving(false);
    if (updateError) {
      toast({
        title: "Не удалось сохранить урок",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Урок обновлён", description: "Изменения сохранены." });
    setEditing(false);
    void refetch();
  };

  return (
    <AdminLayout
      title={lesson?.title ?? "Загрузка урока..."}
      description={course ? `Курс: ${course.title}` : "Детали урока"}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/courses/${parentCourseId}`)}
            disabled={!parentCourseId}
          >
            К курсу
          </Button>
          <Button size="sm" onClick={() => navigate("/admin/courses")}>
            Все курсы
          </Button>
          {lesson && !editing ? (
            <Button size="sm" onClick={() => setEditing(true)}>
              Редактировать урок
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="space-y-6">
        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Не удалось загрузить урок</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Попробуйте обновить страницу чуть позже."}
            </AlertDescription>
          </Alert>
        ) : null}

        {isLoading && !lesson ? (
          <LessonDetailsSkeleton />
        ) : lesson ? (
          <>
            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">Урок {orderLabel}</Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  ID: {lesson.id}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>Создан {formatDate(lesson.created_at)}</span>
                {course ? <span>Курс: {course.title}</span> : null}
              </div>
              {videoEmbed ? (
                <div className="overflow-hidden rounded-xl border bg-black/40">
                  <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      src={videoEmbed.src}
                      title={videoEmbed.title ?? "Video player"}
                      allow={videoEmbed.allow}
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Видео не добавлено. Укажите ссылку на Kinescope или YouTube в настройках урока.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading || isRefetching}
                >
                  Обновить
                </Button>
                {lesson.video_url ? (
                  <Button asChild size="sm" variant="secondary">
                    <a href={lesson.video_url} target="_blank" rel="noopener noreferrer">
                      Открыть оригинальную ссылку
                    </a>
                  </Button>
                ) : null}
              </div>
            </section>

            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Содержимое урока</h2>
                <p className="text-sm text-muted-foreground">
                  Текст в формате Markdown. Отобразите его студентам в приложении.
                </p>
              </div>
              {editing ? (
                <Form {...lessonForm}>
                  <form onSubmit={lessonForm.handleSubmit(handleLessonSave)} className="space-y-4">
                    <FormField
                      control={lessonForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название</FormLabel>
                          <FormControl>
                            <Input placeholder="Например, Модуль 1. Введение" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={lessonForm.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Видео (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={lessonForm.control}
                      name="contentMd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Текст (Markdown)</FormLabel>
                          <FormControl>
                            <MarkdownEditor
                              value={field.value ?? ""}
                              onChange={(val) => field.onChange(val ?? "")}
                              placeholder="Конспект, ссылки, задания..."
                              height={320}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                        Отмена
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? "Сохраняем..." : "Сохранить изменения"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : lesson.content_md && lesson.content_md.trim().length > 0 ? (
                <MarkdownPreview value={lesson.content_md} className="p-4" />
              ) : (
                <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                  Материалы ещё не добавлены.
              </div>
              )}
            </section>
          </>
        ) : (
          <Alert>
            <AlertTitle>Урок не найден</AlertTitle>
            <AlertDescription>Возможно, урок был удалён. Вернитесь к курсу и попробуйте выбрать другой.</AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
};

const LessonDetailsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-36 w-full rounded-2xl" />
    <Skeleton className="h-48 w-full rounded-2xl" />
  </div>
);

export default LessonDetailsPage;


