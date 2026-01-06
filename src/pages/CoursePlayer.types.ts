export type PublicCourse = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
  level: string | null;
};

export type LessonNode = {
  id: string;
  title: string;
  duration_minutes: number | null;
  video_url?: string | null;
  content_md?: string | null;
};
