import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { CourseFormValues } from "./CourseDetailsPage.types";
import { CoverImageUpload } from "./CourseDetailsPage.components";

type CourseBasicInfoFormProps = {
  control: Control<CourseFormValues>;
  coverPreview: string | null;
  uploadingCover: boolean;
  onCoverUpload: (file: File) => void;
  onCoverRemove: () => void;
};

export const CourseBasicInfoForm = ({
  control,
  coverPreview,
  uploadingCover,
  onCoverUpload,
  onCoverRemove,
}: CourseBasicInfoFormProps) => {
  return (
    <>
      {/* Basic Info - Compact Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={control}
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
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="ai-intro"
                  {...field}
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="Расскажите подробнее о программе..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Cover Image */}
      <CoverImageUpload
        control={control}
        coverPreview={coverPreview}
        uploadingCover={uploadingCover}
        onCoverUpload={onCoverUpload}
        onCoverRemove={onCoverRemove}
      />

      {/* Publish Toggle */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div>
          <FormLabel className="text-base">Публикация</FormLabel>
          <p className="text-xs text-muted-foreground mt-0.5">
            Сделайте курс доступным студентам
          </p>
        </div>
        <FormField
          control={control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};








