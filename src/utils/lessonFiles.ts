import { supabase } from "@/lib/supabaseClient";

export type LessonFile = {
  id: string;
  lesson_id: string;
  file_path: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

export const lessonFilesApi = {
  // Загрузка файлов
  upload: async (lessonId: string, files: File[]) => {
    const uploads = files.map(async (file, index) => {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `lessons-files/${lessonId}/${timestamp}-${index}-${safeName}`;

      // 1. Storage
      const { error: uploadError } = await supabase.storage
        .from("lessons-files")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. БД
      const { error: dbError } = await supabase.from("lesson_files").insert({
        lesson_id: lessonId,
        file_path: filePath,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        order_index: index,
      });

      if (dbError) throw dbError;
    });

    return Promise.all(uploads);
  },

  // Получить файлы
  get: async (lessonId: string) => {
    const { data, error } = await supabase
      .from("lesson_files")
      .select("id, original_name, mime_type, size_bytes, order_index, file_path")
      .eq("lesson_id", lessonId)
      .order("order_index");

    if (error) throw error;
    return data as LessonFile[];
  },

  // Удалить файл
  delete: async (fileId: string, filePath: string) => {
    // Удалить из storage
    const { error: storageError } = await supabase.storage
      .from("lessons-files")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Удалить из БД
    const { error: dbError } = await supabase
      .from("lesson_files")
      .delete()
      .eq("id", fileId);

    if (dbError) throw dbError;
  },

  // Изменить порядок файлов
  reorder: async (fileId: string, newOrderIndex: number) => {
    const { error } = await supabase
      .from("lesson_files")
      .update({ order_index: newOrderIndex })
      .eq("id", fileId);

    if (error) throw error;
  },

  // Signed URL
  getUrl: async (filePath: string, expiresIn: number = 3600) => {
    const { data, error } = await supabase.storage
      .from("lessons-files")
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  },
};









