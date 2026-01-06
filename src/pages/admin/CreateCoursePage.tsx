import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircle, Plus, Save, X, Upload, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { uploadCourseCoverBySlug } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/admin/AdminLayout";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

const lessonSchema = z.object({
  title: z.string().min(1, "Название урока обязательно"),
  videoUrl: z
    .string()
    .url("Укажите корректный URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  contentMd: z.string().optional(),
});

const courseSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  slug: z
    .string()
    .min(3, "Минимум 3 символа")
    .regex(/^[a-z0-9\\-]+$/, "Только строчные буквы, цифры и дефис"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroImageUrl: z
    .string()
    .url("Укажите корректный URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  isPublished: z.boolean().default(false),
  result: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  tools: z.array(z.string()).default([]),
  skills: z.array(z.string()).max(3, "Максимум 3 пункта").default([]),
  program: z.array(z.string()).default([]),
  lessons: z.array(lessonSchema).min(1, "Добавьте хотя бы один урок"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const defaultLesson = {
  title: "",
  videoUrl: "",
  contentMd: "",
};

const CreateCoursePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
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
      lessons: [defaultLesson],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lessons",
  });

  const {
    fields: toolsFields,
    append: appendTool,
    remove: removeTool,
  } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: programFields,
    append: appendProgram,
    remove: removeProgram,
  } = useFieldArray({
    control: form.control,
    name: "program",
  });

  const slugValue = form.watch("slug");
  const titleValue = form.watch("title");

  useMemo(() => {
    if (!slugValue && titleValue) {
      const slugified = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\\s-]/g, "")
        .replace(/\\s+/g, "-")
        .replace(/-+/g, "-");
      form.setValue("slug", slugified);
    }
  }, [titleValue, slugValue, form]);

  const onSubmit = async (values: CourseFormValues) => {
    if (!user) {
      toast({
        title: "Нет доступа",
        description: "Авторизуйтесь как администратор.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: values.title,
        slug: values.slug,
        subtitle: values.subtitle,
        description: values.description,
        hero_image_url: values.heroImageUrl,
        level: values.level,
        is_published: values.isPublished,
        result: values.result || null,
        duration: values.duration || null,
        difficulty: values.difficulty || null,
        tools: values.tools.filter((t) => t.trim().length > 0),
        skills: values.skills.filter((s) => s.trim().length > 0),
        program: values.program.filter((p) => p.trim().length > 0),
        created_by: user.id,
      })
      .select("id")
      .single();

    if (courseError || !course) {
      setSubmitting(false);
      toast({
        title: "Не удалось создать курс",
        description: courseError?.message ?? "Попробуйте снова",
        variant: "destructive",
      });
      return;
    }

    const lessonsPayload = values.lessons.map((lesson, index) => ({
      course_id: course.id,
      title: lesson.title,
      video_url: lesson.videoUrl,
      content_md: lesson.contentMd,
      order_index: index,
    }));

    const { error: lessonsError } = await supabase
      .from("lessons")
      .insert(lessonsPayload);

    setSubmitting(false);
    void queryClient.invalidateQueries({ queryKey: ["admin-courses"] });

    if (lessonsError) {
      toast({
        title: "Курс создан, но уроки не добавлены",
        description: lessonsError.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Курс создан", description: "Уроки успешно добавлены." });
    setCoverPreview(null);
    form.reset({
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
      lessons: [defaultLesson],
    });
  };

  const handleCoverUpload = async (
    file: File,
    onChange: (url: string) => void
  ) => {
    const slug = form.getValues("slug");
    if (!slug) {
      toast({
        title: "Сначала укажите slug курса",
        description: "Slug необходим для загрузки обложки",
        variant: "destructive",
      });
      return;
    }

    setUploadingCover(true);
    try {
      const publicUrl = await uploadCourseCoverBySlug(file, slug);
      setCoverPreview(publicUrl);
      onChange(publicUrl);
      toast({
        title: "Обложка загружена",
        description: "Обложка успешно загружена в Supabase Storage",
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

  const handleCoverRemove = (onChange: (url: string) => void) => {
    setCoverPreview(null);
    onChange("");
  };

  return (
    <AdminLayout
      title="Создать курс"
      description="Опишите курс и добавьте уроки."
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
      <div className="max-w-5xl mx-auto py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Основная информация</h2>
                <p className="text-sm text-muted-foreground">
                  То, что увидят студенты на странице курса.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название курса</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Например, AI для маркетинга"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="ai-marketing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробности для страницы курса"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="heroImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Обложка курса</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div>
                            <label
                              htmlFor="cover-upload"
                              className={cn(
                                "flex items-center justify-center gap-2 w-full px-3 py-2 text-sm border border-input rounded-md bg-background transition-colors",
                                uploadingCover || !slugValue
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-accent cursor-pointer"
                              )}
                            >
                              {uploadingCover ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Загрузка...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  Загрузить изображение
                                </>
                              )}
                            </label>
                            <Input
                              id="cover-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingCover || !slugValue}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                  handleCoverUpload(file, field.onChange);
                                // Reset input value to allow re-uploading the same file
                                e.target.value = "";
                              }}
                            />
                          </div>
                          {(coverPreview || field.value) && (
                            <div className="relative rounded-md border overflow-hidden">
                              <img
                                src={coverPreview || field.value || ""}
                                alt="Preview"
                                className="w-full h-32 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  handleCoverRemove(field.onChange);
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
                        Рекомендуемый размер: 1200x630px. Максимальный размер:
                        5MB
                      </p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Уровень</FormLabel>
                      <FormControl>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          {...field}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>Опубликовать курс</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Доступен ли курс студентам сразу.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Маркетинг курса</h2>
                <p className="text-sm text-muted-foreground">
                  Информация для карточек курса и страницы.
                </p>
              </div>

              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Результат курса</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Быстро собирать MVP без кода"
                        rows={2}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Длительность</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="3 часа 10 минут"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сложность</FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) =>
                          field.onChange(
                            value ? parseInt(value, 10) : undefined
                          )
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите сложность" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">
                            Очень легко (🟢⚪️⚪️⚪️⚪️)
                          </SelectItem>
                          <SelectItem value="2">
                            Легко (🟢🟢⚪️⚪️⚪️)
                          </SelectItem>
                          <SelectItem value="3">
                            Средне (🟢🟢🟢⚪️⚪️)
                          </SelectItem>
                          <SelectItem value="4">
                            Сложно (🟢🟢🟢🟢⚪️)
                          </SelectItem>
                          <SelectItem value="5">
                            Очень сложно (🟢🟢🟢🟢🟢)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tools"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel>Инструменты</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTool("")}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" /> Добавить инструмент
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {toolsFields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`tools.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Make, OpenAI, Telegram"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTool(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel>Вы научитесь (до 3 пунктов)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (skillsFields.length < 3) {
                            appendSkill("");
                          }
                        }}
                        disabled={skillsFields.length >= 3}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" /> Добавить пункт
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {skillsFields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`skills.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Проектировать MVP"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSkill(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel>Программа курса (уроки/модули)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendProgram("")}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" /> Добавить урок
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {programFields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`program.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Введение, Поиск проблемы..."
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeProgram(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="rounded-2xl border bg-background p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Уроки</h2>
                  <p className="text-sm text-muted-foreground">
                    Добавьте уроки с видео или текстом.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(defaultLesson)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Добавить урок
                </Button>
              </div>

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-xl border p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Урок {index + 1}</p>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name={`lessons.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название</FormLabel>
                          <FormControl>
                            <Input placeholder="Название урока" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`lessons.${index}.videoUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Видео (URL)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`lessons.${index}.contentMd`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Текст (Markdown)</FormLabel>
                          <FormControl>
                            <MarkdownEditor
                              value={field.value ?? ""}
                              onChange={(val) => field.onChange(val ?? "")}
                              placeholder="Материалы урока..."
                              height={240}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </section>

            <div
              className={cn(
                "flex justify-end gap-3",
                submitting && "opacity-70 pointer-events-none"
              )}
            >
              <Button type="submit" className="gap-2" disabled={submitting}>
                <Save className="h-4 w-4" />
                Сохранить курс
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default CreateCoursePage;
