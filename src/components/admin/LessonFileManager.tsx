import { useState, useCallback } from "react";
import { Upload, X, File, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { lessonFilesApi, type LessonFile } from "@/utils/lessonFiles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LessonFileManagerProps = {
  lessonId: string;
};

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "Неизвестно";
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
};

const getFileIcon = (mimeType: string | null) => {
  if (!mimeType) return <File className="h-4 w-4" />;
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "📦";
  if (mimeType.includes("video")) return "🎥";
  if (mimeType.includes("audio")) return "🎵";
  return <File className="h-4 w-4" />;
};

export const LessonFileManager = ({ lessonId }: LessonFileManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const {
    data: files = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["lesson-files", lessonId],
    queryFn: () => lessonFilesApi.get(lessonId),
    enabled: !!lessonId,
  });

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      setUploading(true);
      try {
        await lessonFilesApi.upload(lessonId, Array.from(selectedFiles));
        toast({
          title: "Файлы загружены",
          description: `Загружено файлов: ${selectedFiles.length}`,
        });
        await refetch();
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description:
            error instanceof Error
              ? error.message
              : "Не удалось загрузить файлы",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        // Reset input
        event.target.value = "";
      }
    },
    [lessonId, refetch, toast]
  );

  const handleDelete = async (file: LessonFile) => {
    setDeletingFileId(file.id);
    try {
      await lessonFilesApi.delete(file.id, file.file_path);
      toast({
        title: "Файл удалён",
        description: `Файл "${file.original_name}" удалён`,
      });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["lesson-files", lessonId] });
    } catch (error) {
      toast({
        title: "Ошибка удаления",
        description:
          error instanceof Error ? error.message : "Не удалось удалить файл",
        variant: "destructive",
      });
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleDownload = async (file: LessonFile) => {
    try {
      const url = await lessonFilesApi.getUrl(file.file_path);
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ссылку на файл",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">📁 Файлы урока</h3>
          <p className="text-sm text-muted-foreground">
            Загрузите файлы для скачивания студентами ({files.length})
          </p>
        </div>
        <label htmlFor={`file-upload-${lessonId}`} className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            className="gap-2"
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Загрузить файлы
                </>
              )}
            </span>
          </Button>
          <input
            id={`file-upload-${lessonId}`}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Загрузка файлов...</div>
      ) : files.length > 0 ? (
        <div className="space-y-2 border rounded-lg p-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 text-lg">
                  {getFileIcon(file.mime_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {file.original_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size_bytes)}
                    {file.mime_type && ` • ${file.mime_type}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="h-8"
                >
                  Скачать
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingFileId(file.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
          Файлы ещё не загружены. Нажмите "Загрузить файлы", чтобы добавить
          материалы для скачивания.
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deletingFileId !== null}
        onOpenChange={(open) => !open && setDeletingFileId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить файл?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить файл "
              {files.find((f) => f.id === deletingFileId)?.original_name}"? Это
              действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const file = files.find((f) => f.id === deletingFileId);
                if (file) handleDelete(file);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
