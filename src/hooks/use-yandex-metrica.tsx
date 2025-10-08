import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ANALYTICS_CONFIG } from "@/config/constants";

declare global {
  interface Window {
    ym: (counterId: number, method: string, ...args: any[]) => void;
  }
}

// Функция для проверки, что мы не на localhost
const isProduction = () => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  return (
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    !hostname.startsWith("192.168.")
  );
};

export const useYandexMetrica = () => {
  const location = useLocation();

  useEffect(() => {
    // Проверяем, что мы в продакшене и Яндекс.Метрика доступна
    if (isProduction() && typeof window !== "undefined" && window.ym) {
      window.ym(
        Number(ANALYTICS_CONFIG.YANDEX_METRICA_ID),
        "hit",
        window.location.href
      );
    }
  }, [location]);
};
