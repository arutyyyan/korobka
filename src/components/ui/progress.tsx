import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = {
  value?: number; // 0–100
  className?: string;
};

export const Progress: React.FC<ProgressProps> = ({ value = 0, className }) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("relative h-2 w-full rounded-full bg-secondary", className)}
    >
      <div
        className="h-full bg-primary transition-[width] duration-300 ease-out rounded-full"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
