import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBotUrl(courseSlug?: string): string {
  // const baseUrl = "https://t.me/korobka_align_bot";

  // // If a courseSlug is provided, it takes priority for start param
  // if (courseSlug && courseSlug.trim().length > 0) {
  //   return `${baseUrl}?start=${encodeURIComponent(courseSlug)}`;
  // }

  // if (typeof window === "undefined") {
  //   return `${baseUrl}?start=landing`;
  // }

  // const urlParams = new URLSearchParams(window.location.search);
  // const utmParams = Array.from(urlParams.entries())
  //   .filter(([key]) => key.startsWith("utm_"))
  //   .map(([, value]) => value);

  // if (utmParams.length > 0) {
  //   return `${baseUrl}?start=${utmParams[0]}`;
  // }

  // return `${baseUrl}?start=landing`;
  return "https://t.me/tribute/app?startapp=sC9M";
  // return "https://t.me/tribute/app?startapp=sC9M";
}

export const COURSE_LEVEL_LABELS = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
} as const;

export type CourseLevelKey = keyof typeof COURSE_LEVEL_LABELS;

export const formatDate = (value: string | null | undefined, locale = "ru-RU") => {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};
