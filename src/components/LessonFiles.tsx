import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessonFilesApi } from "@/utils/lessonFiles";
import { useToast } from "@/hooks/use-toast";

type LessonFilesProps = {
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

export const LessonFiles = ({ lessonId }: LessonFilesProps) => {
  const { toast } = useToast();
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null
  );

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["lesson-files", lessonId],
    queryFn: () => lessonFilesApi.get(lessonId),
    enabled: !!lessonId,
  });

  const handleDownload = async (file: {
    id: string;
    file_path: string;
    original_name: string;
  }) => {
    setDownloadingFileId(file.id);
    try {
      const url = await lessonFilesApi.getUrl(file.file_path);
      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = file.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скачать файл",
        variant: "destructive",
      });
    } finally {
      setDownloadingFileId(null);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center gap-2 text-sm text-muted-foreground">
  //       <Loader2 className="h-4 w-4 animate-spin" />
  //       Загрузка файлов...
  //     </div>
  //   );
  // }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          📁 Материалы для скачивания
        </h3>
        <p className="text-sm text-muted-foreground">Файлы к этому уроку</p>
      </div>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
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
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDownload(file)}
              disabled={downloadingFileId === file.id}
              className="gap-2 flex-shrink-0"
            >
              {downloadingFileId === file.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Скачивание...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Скачать
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
