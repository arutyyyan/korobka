import { type ReactNode } from "react";
import { CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LessonNode } from "./CoursePlayer.types";

type LessonsNavigationProps = {
  lessons: LessonNode[];
  activeLessonId: string | null;
  completedLessons: Set<string>;
  onSelect: (lessonId: string) => void;
};

export const LessonsNavigation = ({
  lessons,
  activeLessonId,
  completedLessons,
  onSelect,
}: LessonsNavigationProps) => {
  return (
    <div>
      {lessons.map((lesson) => {
        const isActive = activeLessonId === lesson.id;
        const isDone = completedLessons.has(lesson.id);
        const duration = lesson.duration_minutes ?? 0;

        return (
          <button
            key={lesson.id}
            type="button"
            onClick={() => onSelect(lesson.id)}
            className={`w-full text-left transition-all border-b border-border/30 ${
              isActive
                ? "bg-primary/10 border-l-[3px] border-l-primary pl-4 pr-4 py-4"
                : "hover:bg-gray-50/50 pl-4 pr-4 py-4"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-base ${
                    isActive ? "text-foreground" : "text-foreground"
                  }`}
                >
                  {lesson.title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isDone ? "Завершен" : `${duration} минут`}
                </p>
              </div>
              {isDone && (
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          </button>
        );
      })}
      {lessons.length === 0 ? (
        <div className="p-4 text-sm text-muted-foreground text-center">
          Уроки скоро появятся
        </div>
      ) : null}
    </div>
  );
};

type PlaceholderStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: ReactNode;
};

export const PlaceholderState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: PlaceholderStateProps) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
    <div className="space-y-3 max-w-xl">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon ?? <BookOpen className="h-6 w-6" />}
      </div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Button onClick={onAction}>{actionLabel}</Button>
  </div>
);

export const CoursePageSkeleton = () => (
  <div className="container mx-auto px-4 py-12 space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Skeleton className="h-[420px] rounded-3xl" />
      <Skeleton className="h-[420px] rounded-3xl" />
    </div>
  </div>
);
