import { Control, useFieldArray } from "react-hook-form";
import { X, Plus, Loader2, Upload, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { COURSE_LEVEL_LABELS } from "@/lib/utils";
import type { CourseFormValues, CourseDetails, LessonSummary } from "./CourseDetailsPage.types";

type DynamicArrayFieldProps = {
  control: Control<CourseFormValues>;
  name: "tools" | "skills" | "program";
  label: string;
  placeholder: string;
  addButtonLabel: string;
  maxItems?: number;
};

export const DynamicArrayField = ({
  control,
  name,
  label,
  placeholder,
  addButtonLabel,
  maxItems,
}: DynamicArrayFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between mb-2">
            <FormLabel>{label}</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!maxItems || fields.length < maxItems) {
                  append("");
                }
              }}
              disabled={maxItems !== undefined && fields.length >= maxItems}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> {addButtonLabel}
            </Button>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`${name}.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder={placeholder} {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
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
  );
};

type CourseHeaderProps = {
  course: CourseDetails;
  lessonsCount: number;
};

export const CourseHeader = ({ course, lessonsCount }: CourseHeaderProps) => {
  return (
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
      {course.level && (
        <Badge variant="secondary">
          {COURSE_LEVEL_LABELS[course.level]}
        </Badge>
      )}
      <Badge variant="outline" className="font-mono text-xs">
        Slug: {course.slug}
      </Badge>
      <div className="ml-auto text-xs text-muted-foreground">
        Создан {formatDate(course.created_at)} • {lessonsCount} уроков
      </div>
    </div>
  );
};

type CourseLessonsListProps = {
  course: CourseDetails;
  lessons: LessonSummary[];
};

export const CourseLessonsList = ({
  course,
  lessons,
}: CourseLessonsListProps) => {
  const navigate = useNavigate();

  if (lessons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Уроков пока нет. Нажмите кнопку "Добавить урок", чтобы создать первый.
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {lessons.map((lesson, index) => {
        const order = (lesson.order_index ?? index) + 1;
        return (
          <li key={lesson.id}>
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/courses/${course.id}/lessons/${lesson.id}`
                )
              }
              className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition hover:border-primary hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {order.toString().padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Создан {formatDate(lesson.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {lesson.video_url ? (
                  <Badge variant="outline">Видео</Badge>
                ) : null}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

type CoverImageUploadProps = {
  control: Control<CourseFormValues>;
  coverPreview: string | null;
  uploadingCover: boolean;
  onCoverUpload: (file: File) => void;
  onCoverRemove: () => void;
};

export const CoverImageUpload = ({
  control,
  coverPreview,
  uploadingCover,
  onCoverUpload,
  onCoverRemove,
}: CoverImageUploadProps) => {
  return (
    <FormField
      control={control}
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
                    if (file) onCoverUpload(file);
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
                      onCoverRemove();
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
  );
};









