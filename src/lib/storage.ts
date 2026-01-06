import { supabase } from "./supabaseClient";

const COURSE_COVERS_BUCKET = "course-covers";

/**
 * Upload a course cover image to Supabase storage
 * @param file - The image file to upload
 * @param courseId - The ID of the course
 * @returns The public URL of the uploaded image
 */
export const uploadCourseCover = async (
  file: File,
  courseId: string
): Promise<string> => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${courseId}-${Date.now()}.${fileExt}`;
  const filePath = `${courseId}/${fileName}`;

  // Upload the file
  const { data, error } = await supabase.storage
    .from(COURSE_COVERS_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(COURSE_COVERS_BUCKET).getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Delete a course cover image from Supabase storage
 * @param url - The public URL of the image to delete
 */
export const deleteCourseCover = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf(COURSE_COVERS_BUCKET);
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      throw new Error("Invalid URL format");
    }

    const filePath = pathParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from(COURSE_COVERS_BUCKET)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Failed to delete course cover:", error);
    // Don't throw - deletion is not critical
  }
};

/**
 * Get the public URL for a course cover
 * @param path - The storage path of the image
 * @returns The public URL
 */
export const getCourseCoverUrl = (path: string): string => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(COURSE_COVERS_BUCKET).getPublicUrl(path);
  return publicUrl;
};

/**
 * Upload a course cover image to Supabase storage by course slug
 * @param file - The image file to upload
 * @param slug - The slug of the course
 * @returns The public URL of the uploaded image
 */
export const uploadCourseCoverBySlug = async (
  file: File,
  slug: string
): Promise<string> => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${slug}-${Date.now()}.${fileExt}`;
  const filePath = `${slug}/${fileName}`;

  // Upload the file
  const { data, error } = await supabase.storage
    .from(COURSE_COVERS_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(COURSE_COVERS_BUCKET).getPublicUrl(filePath);

  return publicUrl;
};



