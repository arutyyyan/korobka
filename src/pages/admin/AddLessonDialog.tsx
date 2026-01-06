import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Upload, X, File, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { lessonFilesApi } from "@/utils/lessonFiles";
import { useToast } from "@/hooks/use-toast";
import type { LessonFormValues } from "./CourseDetailsPage.types";
import { useEffect } from "react";
import { useDialogScrollLock } from "@/hooks/use-dialog-scroll-lock";

type AddLessonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<LessonFormValues>;
  onSubmit: (values: LessonFormValues) => Promise<string | undefined>; // Returns lessonId
  submitting: boolean;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
};

/**
 * Hook to ensure body scroll is restored when dialog state might be inconsistent
 */
// export const useDialogScrollLock = (isOpen: boolean) => {
//   useEffect(() => {
//     if (!isOpen) {
//       // Small delay to ensure Radix has cleaned up
//       const timer = setTimeout(() => {
//         if (document.body.style.overflow === "hidden") {
//           document.body.style.overflow = "";
//         }
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);
// };

export const AddLessonDialog = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  submitting,
}: AddLessonDialogProps) => {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  useDialogScrollLock(open);
  // Cleanup effect to restore scroll if component unmounts while dialog is "open"
  useEffect(() => {
    return () => {
      // Restore body scroll when component unmounts
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: LessonFormValues) => {
    const lessonId = await onSubmit(values);

    // Upload files if lesson was created and files are selected
    if (lessonId && selectedFiles.length > 0) {
      setUploadingFiles(true);
      try {
        await lessonFilesApi.upload(lessonId, selectedFiles);
        toast({
          title: "Файлы загружены",
          description: `Загружено файлов: ${selectedFiles.length}`,
        });
        setSelectedFiles([]);
        // Use handleDialogClose instead of onOpenChange directly
        handleDialogClose(false);
      } catch (error) {
        toast({
          title: "Урок создан, но файлы не загружены",
          description:
            error instanceof Error
              ? error.message
              : "Не удалось загрузить файлы",
          variant: "destructive",
        });
      } finally {
        setUploadingFiles(false);
      }
    } else if (lessonId) {
      // Use handleDialogClose instead of onOpenChange directly
      handleDialogClose(false);
    }
  };

  const handleDialogClose = (newOpen: boolean) => {
    // Don't prevent closing if we're trying to close - always allow closing
    // Only prevent closing if we're trying to open during submission
    if (newOpen && (submitting || uploadingFiles)) {
      return;
    }

    if (!newOpen) {
      setSelectedFiles([]);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-y-auto ">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Добавить урок</DialogTitle>
          <DialogDescription>
            Заполните форму и урок появится в списке ниже.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 flex-1 pr-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например, Модуль 1. Введение"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Длительность (минуты)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15"
                      value={
                        field.value !== undefined && field.value !== null
                          ? String(field.value)
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value.trim() === "") {
                          field.onChange(undefined);
                        } else {
                          const numValue = parseInt(value, 10);
                          field.onChange(
                            isNaN(numValue) ? undefined : numValue
                          );
                        }
                      }}
                      min="0"
                      step="1"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Укажите длительность урока в минутах (необязательно)
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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

            {/* Files Section */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>📁 Файлы урока</FormLabel>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Файлы будут загружены после создания урока (
                    {selectedFiles.length})
                  </p>
                </div>
                <label htmlFor="lesson-files-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      Выбрать файлы
                    </span>
                  </Button>
                  <input
                    id="lesson-files-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={submitting || uploadingFiles}
                  />
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 p-2 rounded-md border bg-background"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        disabled={submitting || uploadingFiles}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </Form>
        <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogClose(false)}
            disabled={submitting || uploadingFiles}
          >
            Отмена
          </Button>
          <Button
            type="button"
            disabled={submitting || uploadingFiles}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {uploadingFiles ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка файлов...
              </>
            ) : submitting ? (
              "Добавляем..."
            ) : (
              "Добавить урок"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
