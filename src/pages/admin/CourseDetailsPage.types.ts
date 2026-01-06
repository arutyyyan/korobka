import { z } from "zod";
import { COURSE_LEVEL_LABELS } from "@/lib/utils";

export const courseUpdateSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  slug: z
    .string()
    .min(3, "Минимум 3 символа")
    .regex(/^[a-z0-9\-]+$/, "Только строчные буквы, цифры и дефис"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroImageUrl: z
    .union([z.string().url("Укажите корректный URL"), z.literal("")])
    .optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  isPublished: z.boolean(),
  result: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z
    .union([z.number().int().min(1).max(5), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(z.number().int().min(1).max(5).optional()),
  tools: z.array(z.string()).default([]),
  skills: z.array(z.string()).max(3, "Максимум 3 пункта").default([]),
  program: z.array(z.string()).default([]),
});

export const lessonCreateSchema = z.object({
  title: z.string().min(1, "Название урока обязательно"),
  videoUrl: z
    .union([z.string().url("Укажите корректный URL"), z.literal("")])
    .optional(),
  contentMd: z.string().optional(),
  durationMinutes: z
    .union([z.number().int().min(0), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return isNaN(num) || num < 0 ? undefined : num;
    })
    .pipe(z.number().int().min(0).optional()),
});

export type CourseFormValues = z.infer<typeof courseUpdateSchema>;
export type LessonFormValues = z.infer<typeof lessonCreateSchema>;

export type CourseDetails = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
  cover_image_url: string | null;
  level: keyof typeof COURSE_LEVEL_LABELS | null;
  is_published: boolean;
  result: string | null;
  duration: string | null;
  difficulty: number | null;
  tools: string[] | null;
  skills: string[] | null;
  program: string[] | null;
  created_at: string | null;
};

export type LessonSummary = {
  id: string;
  title: string;
  order_index: number | null;
  video_url: string | null;
  created_at: string | null;
};

