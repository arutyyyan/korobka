import { supabase } from "@/lib/supabaseClient";

/**
 * Generate a one-time token for Telegram account linking
 * @returns The token string
 */
export const generateTelegramLinkToken = async (): Promise<string> => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session?.user) {
    throw new Error("Пользователь не авторизован");
  }

  const userId = session.session.user.id;

  // Generate a random token
  const token = crypto.randomUUID();

  // Store the token in login_links table with expiration (1 hour)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  const { error } = await supabase.from("login_links").insert({
    token,
    user_id: userId,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Failed to create login link", error);
    throw new Error("Не удалось создать ссылку для подключения");
  }

  return token;
};

/**
 * Generate a one-time token for Telegram account linking with origin path
 * @param originPath - The current path where user initiated the action (e.g., "/courses/123/lessons/2", "/pricing")
 * @returns The token string
 */
export const generateTelegramLinkTokenWithPath = async (
  originPath: string
): Promise<string> => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session?.user) {
    throw new Error("Пользователь не авторизован");
  }

  const userId = session.session.user.id;

  // Generate a random token
  const token = crypto.randomUUID();

  // Store the token in login_links table with expiration (1 hour)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  const { error } = await supabase.from("login_links").insert({
    token,
    user_id: userId,
    origin_path: originPath,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Failed to create login link", error);
    throw new Error("Не удалось создать ссылку для подключения");
  }

  return token;
};

/**
 * @deprecated Use generateTelegramLinkTokenWithPath instead
 * Generate a one-time token for Telegram account linking with course/lesson context
 * @param courseId - The course ID
 * @param lessonId - The lesson ID
 * @returns The token string
 */
export const generateCourseLessonLinkToken = async (
  courseId: string,
  lessonId: string
): Promise<string> => {
  // For backward compatibility, construct path from course/lesson
  // This assumes the URL structure matches /learn/{courseSlug}/{lessonId}
  // But we'll use the new function with origin_path
  const originPath = window.location.pathname + window.location.search;
  return generateTelegramLinkTokenWithPath(originPath);
};

/**
 * Get the Telegram deep link URL
 */
export const getTelegramLinkUrl = (token: string): string => {
  return `https://t.me/korobka_login_bot?start=${token}`;
};
