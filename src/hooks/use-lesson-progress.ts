import { useCallback, useEffect, useState } from "react";

import {
  fetchLessonProgress,
  removeLessonProgress,
  saveLessonProgress,
  updateEnrollmentProgress,
} from "@/api/lesson-progress";
import { useAuth } from "@/hooks/use-auth";

type UseLessonProgressResult = {
  completedLessons: Set<string>;
  loading: boolean;
  saving: boolean;
  toggleLesson: (lessonId: string) => Promise<void>;
};

export const useLessonProgress = (courseSlug: string | null, totalLessons: number): UseLessonProgressResult => {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId || !courseSlug) {
      setCompletedLessons(new Set());
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchLessonProgress(userId, courseSlug)
      .then((records) => {
        if (cancelled) {
          return;
        }
        const next = new Set(records.map((record) => record.lesson_id));
        setCompletedLessons(next);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, courseSlug]);

  const toggleLesson = useCallback(
    async (lessonId: string) => {
      if (!userId || !courseSlug) {
        return;
      }
      const isCompleted = completedLessons.has(lessonId);
      setSaving(true);
      const nextCompleted = new Set(completedLessons);
      try {
        if (isCompleted) {
          nextCompleted.delete(lessonId);
          await removeLessonProgress(userId, courseSlug, lessonId);
        } else {
          nextCompleted.add(lessonId);
          await saveLessonProgress(userId, courseSlug, lessonId);
        }
        setCompletedLessons(nextCompleted);
        const percent = totalLessons > 0 ? Math.round((nextCompleted.size / totalLessons) * 100) : 0;
        await updateEnrollmentProgress(userId, courseSlug, percent);
      } catch (error) {
        console.error("Failed to update lesson progress", error);
      } finally {
        setSaving(false);
      }
    },
    [completedLessons, courseSlug, totalLessons, userId],
  );

  return {
    completedLessons,
    loading,
    saving,
    toggleLesson,
  };
};

