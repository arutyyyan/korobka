import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Paywall } from "@/components/Paywall";
import { supabase } from "@/lib/supabaseClient";

import { useCourse, useLessons, useLessonProgress } from "./CoursePlayer.hooks";
import {
  LessonsNavigation,
  PlaceholderState,
  CoursePageSkeleton,
} from "./CoursePlayer.components";
import { LessonContent } from "./LessonContent";
import type { PublicCourse, LessonNode } from "./CoursePlayer.types";

const CoursePlayer = () => {
  const { courseSlug, lessonId } = useParams<{
    courseSlug: string;
    lessonId?: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isPro } = useAuth();
  const [mobileLessonsOpen, setMobileLessonsOpen] = useState(false);
  const [showCourseComplete, setShowCourseComplete] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);

  // Fetch data using custom hooks
  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
    error: courseErrorObj,
  } = useCourse(courseSlug, user?.id);

  const {
    data: lessons = [],
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useLessons(course?.id, user?.id, isPro);

  const {
    data: completedLessonIds = [],
    isLoading: progressLoading,
    error: progressError,
  } = useLessonProgress(user?.id, courseSlug);

  // Local navigation logic
  const fallbackLessonId = lessons.length > 0 ? lessons[0].id : undefined;
  const activeLessonId = lessonId ?? fallbackLessonId;
  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? null;
  const currentIndex = activeLesson
    ? lessons.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const completedLessons = useMemo(
    () => new Set(completedLessonIds),
    [completedLessonIds]
  );

  // Calculate course completion status
  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const courseCompleted = totalLessons > 0 && completedCount === totalLessons;

  const activeLessonCompleted = activeLesson
    ? completedLessons.has(activeLesson.id)
    : false;

  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === lessons.length - 1;
  const canViewContent = isPro || isFirstLesson;

  // Navigate to active lesson if URL doesn't match
  useEffect(() => {
    if (activeLessonId && courseSlug && lessonId !== activeLessonId) {
      navigate(`/learn/${courseSlug}/${activeLessonId}`, { replace: true });
    }
  }, [activeLessonId, courseSlug, lessonId, navigate]);

  const goToLesson = (id: string) => {
    if (courseSlug) {
      navigate(`/learn/${courseSlug}/${id}`);
      setMobileLessonsOpen(false);
    }
  };

  const markLessonCompleted = async (lessonId: string) => {
    if (!user || !courseSlug) return;

    // Optimistic update of local progress cache
    queryClient.setQueryData<string[] | undefined>(
      ["lesson-progress", user.id, courseSlug],
      (prev) => {
        const current = prev ?? [];
        if (current.includes(lessonId)) return current;
        return [...current, lessonId];
      }
    );

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        course_slug: courseSlug,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    if (error) {
      console.error("Failed to save lesson progress:", error);
      // On error, reload progress from server
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", user.id, courseSlug],
      });
    } else {
      // Update roadmap
      queryClient.invalidateQueries({ queryKey: ["user-roadmap"] });
    }
  };

  const handleToggleLesson = async (lessonId: string) => {
    if (!courseSlug || !user) return { courseCompleted: false };
    setProgressSaving(true);
    try {
      await markLessonCompleted(lessonId);

      const total = lessons.length;
      const completed = new Set(completedLessonIds);
      completed.add(lessonId);
      const isCourseDone = total > 0 && completed.size === total;

      return { courseCompleted: isCourseDone };
    } finally {
      setProgressSaving(false);
    }
  };

  const handleCourseCompleted = () => {
    setShowCourseComplete(true);
  };

  // Early returns for error states
  if (!courseSlug) {
    return (
      <PlaceholderState
        title="Курс не найден"
        description="Мы не смогли определить курс. Вернитесь к каталогу и попробуйте снова."
        actionLabel="Каталог курсов"
        onAction={() => navigate("/courses")}
      />
    );
  }

  if (!user) {
    return (
      <PlaceholderState
        title="Нужен вход в аккаунт"
        description="Авторизуйтесь, чтобы открыть уроки и сохранить прогресс."
        actionLabel="Перейти в Моё обучение"
        onAction={() => navigate("/learn")}
      />
    );
  }

  const isLoading = courseLoading || lessonsLoading || progressLoading;
  const isError = courseError || lessonsError || progressError;
  const error = courseErrorObj || lessonsError || progressError;

  if (isLoading) {
    return <CoursePageSkeleton />;
  }

  if (isError || !course) {
    return (
      <PlaceholderState
        title="Не удалось загрузить курс"
        description={
          error instanceof Error
            ? error.message
            : "Попробуйте обновить страницу."
        }
        actionLabel="К списку курсов"
        onAction={() => navigate("/learn")}
        icon={<ShieldAlert className="h-8 w-8 text-destructive" />}
      />
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-[calc(100dvh-50px)]">
        <div className="flex-1 grid lg:grid-cols-[320px_1fr] gap-0 min-h-0">
          {/* Left Sidebar - Course Modules */}
          <aside
            className="hidden lg:flex flex-col border-r border-border/40"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <div className="p-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">
                {course.title}
              </h1>
              <button className="text-muted-foreground hover:text-foreground">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LessonsNavigation
                lessons={lessons}
                activeLessonId={activeLessonId}
                completedLessons={completedLessons}
                onSelect={goToLesson}
              />
            </div>
          </aside>

          {/* Right Main Content */}
          <section className="flex flex-col min-h-0 bg-white relative">
            {activeLesson ? (
              <>
                <LessonContent
                  lesson={activeLesson}
                  course={course}
                  lessonsCount={lessons.length}
                  activeLessonCompleted={activeLessonCompleted}
                  isFirstLesson={isFirstLesson}
                  isLastLesson={isLastLesson}
                  prevLesson={prevLesson}
                  nextLesson={nextLesson}
                  onToggleLesson={handleToggleLesson}
                  onNavigateToLesson={goToLesson}
                  onCourseCompleted={handleCourseCompleted}
                  progressSaving={progressSaving}
                  canViewContent={canViewContent} 
                />
                {/* Show paywall for lessons beyond first if not pro */}
                {!isPro && currentIndex > 0 && <Paywall />}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground p-8">
                <BookOpen className="h-10 w-10" />
                <p className="text-lg font-semibold">Нет доступных уроков</p>
                <p className="text-sm">
                  Как только уроки появятся, вы увидите их здесь.
                </p>
              </div>
            )}
            {/* Mobile Lessons Button */}
            {lessons.length > 0 ? (
              <div className="lg:hidden px-6 py-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileLessonsOpen(true)}
                >
                  Открыть содержание курса
                </Button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
      <Sheet open={mobileLessonsOpen} onOpenChange={setMobileLessonsOpen}>
        <SheetContent side="left" className="w-[320px]">
          <SheetHeader>
            <SheetTitle>{course.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <LessonsNavigation
              lessons={lessons}
              activeLessonId={activeLessonId}
              completedLessons={completedLessons}
              onSelect={goToLesson}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Course Completion Modal */}
      <AlertDialog
        open={showCourseComplete}
        onOpenChange={setShowCourseComplete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Курс «{course?.title}» завершён</AlertDialogTitle>
            <AlertDialogDescription>
              Вы завершили все уроки этого курса. Можете вернуться к роадмапу и
              продолжить обучение.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/learn")}>
              Вернуться к роадмапу
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoursePlayer;
