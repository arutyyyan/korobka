import { useEffect } from "react";

/**
 * Hook to ensure body scroll is restored when dialog state might be inconsistent
 */
export const useDialogScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) {
      // Small delay to ensure Radix has cleaned up
      const timer = setTimeout(() => {
        if (document.body.style.overflow === "hidden") {
          document.body.style.overflow = "";
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
};
