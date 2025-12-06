import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminLayout from "@/components/admin/AdminLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { COURSE_LEVEL_LABELS, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { uploadCourseCover } from "@/lib/storage";
import { Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const courseUpdateSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  slug: z.string().min(3, "Минимум 3 символа").regex(/^[a-z0-9\-]+$/, "Только строчные буквы, цифры и дефис"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroImageUrl: z.union([z.string().url("Укажите корректный URL"), z.literal("")]).optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  isPublished: z.boolean(),
});

const lessonCreateSchema = z.object({
  title: z.string().min(1, "Название урока обязательно"),
  videoUrl: z.union([z.string().url("Укажите корректный URL"), z.literal("")]).optional(),
  contentMd: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseUpdateSchema>;
type LessonFormValues = z.infer<typeof lessonCreateSchema>;

type CourseDetails = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
  cover_image_url: string | null;
  level: keyof typeof COURSE_LEVEL_LABELS | null;
  is_published: boolean;
  created_at: string | null;
};

type LessonSummary = {
  id: string;
  title: string;
  order_index: number | null;
  video_url: string | null;
  created_at: string | null;
};

const fetchCourseDetails = async (courseId: string) => {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id,title,slug,subtitle,description,hero_image_url,cover_image_url,level,is_published,created_at")
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
    },
  });

  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      contentMd: "",
    },
  });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
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
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/courses")}>
            Все курсы
          </Button>
        }
      >
        <Alert>
          <AlertTitle>Нет курса</AlertTitle>
          <AlertDescription>Пожалуйста, вернитесь к списку курсов и выберите нужный.</AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  const course = data?.course ?? null;
  const lessons = data?.lessons ?? [];
  const subtitle = course?.subtitle ?? course?.description ?? "Курс без описания";
  const heroImage = course?.cover_image_url ?? course?.hero_image_url;
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
        description: "Обложка успешно загружена. Не забудьте сохранить изменения.",
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить обложку",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCourseSubmit = async (values: CourseFormValues) => {
    if (!courseId) {
      return;
    }
    setSavingCourse(true);
    const coverUrl = values.heroImageUrl && values.heroImageUrl.trim().length > 0 ? values.heroImageUrl.trim() : null;
    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      subtitle: values.subtitle?.trim() || null,
      description: values.description?.trim() || null,
      cover_image_url: coverUrl,
      hero_image_url: coverUrl, // Keep for backward compatibility
      level: values.level,
      is_published: values.isPublished,
    };
    const { error: updateError } = await supabase.from("courses").update(payload).eq("id", courseId);
    setSavingCourse(false);
    if (updateError) {
      toast({
        title: "Не удалось сохранить курс",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Курс обновлён", description: "Изменения успешно сохранены." });
    void queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
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
        ? Math.max(...lessons.map((lesson) => (typeof lesson.order_index === "number" ? lesson.order_index : -1))) + 1
        : 0;

    const { error: insertError } = await supabase.from("lessons").insert({
      course_id: course.id,
      title: values.title.trim(),
      video_url: values.videoUrl && values.videoUrl.length > 0 ? values.videoUrl : null,
      content_md: values.contentMd ?? null,
      order_index: nextOrder,
    });
    setCreatingLesson(false);
    if (insertError) {
      toast({
        title: "Не удалось добавить урок",
        description: insertError.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Урок добавлен", description: "Новый урок появился в списке." });
    lessonForm.reset({
      title: "",
      videoUrl: "",
      contentMd: "",
    });
    setIsAddLessonDialogOpen(false);
    void queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
    void refetch();
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
              {error instanceof Error ? error.message : "Попробуйте обновить страницу немного позже."}
            </AlertDescription>
          </Alert>
        ) : null}

        {isLoading && !course ? (
          <CourseDetailsSkeleton />
        ) : course ? (
          <>
            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-6">
              {/* Status badges - more compact */}
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
                <Badge
                  className={
                    course.is_published
                      ? "border-0 bg-emerald-100 text-emerald-700"
                      : "border-0 bg-amber-100 text-amber-700"
                  }
                >
                  {course.is_published ? "Опубликован" : "Черновик"}
                </Badge>
                {course.level && <Badge variant="secondary">{COURSE_LEVEL_LABELS[course.level]}</Badge>}
                <Badge variant="outline" className="font-mono text-xs">Slug: {course.slug}</Badge>
                <div className="ml-auto text-xs text-muted-foreground">
                  Создан {formatDate(course.created_at)} • {lessonsCount} уроков
                </div>
              </div>

              <Form {...courseForm}>
                <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4">
                  {/* Basic Info - Compact Grid */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={courseForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Название курса</FormLabel>
                          <FormControl>
                            <Input placeholder="Вводный курс по AI" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={courseForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="ai-intro" {...field} className="font-mono text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={courseForm.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подзаголовок</FormLabel>
                          <FormControl>
                            <Input placeholder="Короткое описание" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={courseForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Уровень</FormLabel>
                          <FormControl>
                            <select
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                              {...field}
                            >
                              <option value="beginner">Начальный</option>
                              <option value="intermediate">Средний</option>
                              <option value="advanced">Продвинутый</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={courseForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Расскажите подробнее о программе..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cover Image - Simplified */}
                  <FormField
                    control={courseForm.control}
                    name="heroImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Обложка курса</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <label
                                htmlFor="cover-upload"
                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-input rounded-md bg-background hover:bg-accent cursor-pointer transition-colors disabled:opacity-50"
                              >
                                {uploadingCover ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                                {uploadingCover ? "Загрузка..." : "Загрузить"}
                              </label>
                              <Input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingCover}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleCoverUpload(file);
                                }}
                              />
                              <Input
                                placeholder="Или вставьте URL изображения"
                                {...field}
                                className="flex-1 text-sm"
                              />
                            </div>
                            {coverPreview && (
                              <div className="relative rounded-md border overflow-hidden">
                                <img
                                  src={coverPreview}
                                  alt="Preview"
                                  className="w-full h-32 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCoverPreview(null);
                                    field.onChange("");
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-background/90 hover:bg-background rounded border shadow-sm"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          Рекомендуемый размер: 1200x630px
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Publish Toggle - Inline */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <FormLabel className="text-base">Публикация</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Сделайте курс доступным студентам
                      </p>
                    </div>
                    <FormField
                      control={courseForm.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
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

              {lessonsCount > 0 ? (
                <ol className="space-y-2">
                  {lessons.map((lesson, index) => {
                    const order = (lesson.order_index ?? index) + 1;
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/courses/${course.id}/lessons/${lesson.id}`)}
                          className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition hover:border-primary hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">{order.toString().padStart(2, "0")}</span>
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Создан {formatDate(lesson.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.video_url ? <Badge variant="outline">Видео</Badge> : null}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Уроков пока нет. Нажмите кнопку "Добавить урок", чтобы создать первый.
                </div>
              )}
            </section>

            {/* Add Lesson Dialog */}
            <Dialog open={isAddLessonDialogOpen} onOpenChange={setIsAddLessonDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Добавить урок</DialogTitle>
                  <DialogDescription>
                    Заполните форму и урок появится в списке ниже.
                  </DialogDescription>
                </DialogHeader>
                <Form {...lessonForm}>
                  <form onSubmit={lessonForm.handleSubmit(handleLessonSubmit)} className="space-y-4">
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
                          <FormLabel>Видео (Kinescope или YouTube)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://kinescope.io/..." {...field} />
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
                              height={260}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddLessonDialogOpen(false)}
                      >
                        Отмена
                      </Button>
                      <Button type="submit" disabled={creatingLesson}>
                        {creatingLesson ? "Добавляем..." : "Добавить урок"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Alert>
            <AlertTitle>Курс не найден</AlertTitle>
            <AlertDescription>Возможно, курс был удалён. Вернитесь к списку и попробуйте снова.</AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
};

const CourseDetailsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-64 w-full rounded-2xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
    <Skeleton className="h-32 w-full rounded-2xl" />
  </div>
);

export default CourseDetailsPage;


