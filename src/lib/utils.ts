import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBotUrl(): string {
  const baseUrl = "https://t.me/korobka_align_bot";
  
  if (typeof window === "undefined") {
    return baseUrl;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = Array.from(urlParams.entries())
    .filter(([key]) => key.startsWith("utm_"))
    .map(([, value]) => value);
  
  if (utmParams.length > 0) {
    return `${baseUrl}?start=${utmParams[0]}`;
  }
  
  return baseUrl;
}
