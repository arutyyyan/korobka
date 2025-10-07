import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    ym: (counterId: number, method: string, ...args: any[]) => void;
  }
}

const YANDEX_METRICA_ID = 104427792;

export const useYandexMetrica = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(YANDEX_METRICA_ID, 'hit', window.location.href);
    }
  }, [location]);
};
