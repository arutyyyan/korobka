import { useEffect, useMemo, useState, type ReactNode, memo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, PlayCircle, ShieldAlert, Loader2 } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import "@uiw/react-markdown-preview/markdown.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEnrollments } from "@/hooks/use-enrollments";
import { supabase } from "@/lib/supabaseClient";
import { COURSE_LEVEL_LABELS } from "@/lib/utils";
import { getVideoEmbed } from "@/lib/video";
import { useLessonProgress } from "@/hooks/use-lesson-progress";

type PublicCourse = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
  level: keyof typeof COURSE_LEVEL_LABELS | null;
};

type LessonNode = {
  id: string;
  title: string;
  order_index: number | null;
  video_url: string | null;
  content_md: string | null;
  duration_minutes: number | null;
};

const fetchCourseBySlug = async (slug: string) => {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id,title,slug,subtitle,description,hero_image_url,level")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (courseError) {
    throw courseError;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id,title,order_index,video_url,content_md,duration_minutes")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  if (lessonsError) {
    throw lessonsError;
  }

  return {
    course: course as PublicCourse,
    lessons: (lessons ?? []) as LessonNode[],
  };
};

const CoursePlayer = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { enrollmentMap, loading: enrollmentLoading, user, refresh } = useEnrollments();
  const [mobileLessonsOpen, setMobileLessonsOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["course-player", courseSlug],
    queryFn: () => fetchCourseBySlug(courseSlug!),
    enabled: Boolean(courseSlug),
    staleTime: 1000 * 60,
  });

  const course = data?.course ?? null;
  const lessons = useMemo(() => data?.lessons ?? [], [data?.lessons]);
  const isEnrolled = useMemo(() => {
    if (!courseSlug) {
      return false;
    }
    return Boolean(enrollmentMap[courseSlug]);
  }, [courseSlug, enrollmentMap]);

  const { completedLessons, loading: progressLoading, saving: progressSaving, toggleLesson } = useLessonProgress(
    courseSlug ?? null,
    lessons.length,
  );

  // Determine active lesson from URL or default to first lesson
  const activeLessonId = useMemo(() => {
    if (lessonId && lessons.some((l) => l.id === lessonId)) {
      return lessonId;
    }
    if (lessons.length > 0) {
      return lessons[0].id;
    }
    return null;
  }, [lessonId, lessons]);

  // Navigate to first lesson if no lessonId in URL and lessons are loaded
  useEffect(() => {
    if (lessons.length > 0 && !lessonId && courseSlug) {
      navigate(`/learn/${courseSlug}/${lessons[0].id}`, { replace: true });
    }
  }, [lessons, lessonId, courseSlug, navigate]);

  const navigateToLesson = (targetLessonId: string) => {
    if (courseSlug) {
      navigate(`/learn/${courseSlug}/${targetLessonId}`);
      setMobileLessonsOpen(false);
    }
  };

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0] ?? null;
  const currentIndex = activeLesson ? lessons.findIndex((lesson) => lesson.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const activeLessonCompleted = activeLesson ? completedLessons.has(activeLesson.id) : false;

  const handleToggleLesson = async (lessonId: string) => {
    await toggleLesson(lessonId);
    void refresh();
  };

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

  if (enrollmentLoading) {
    return <CoursePageSkeleton />;
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

  if (!isEnrolled) {
    return (
      <PlaceholderState
        title="Запишитесь на курс"
        description="Этот курс недоступен в вашем аккаунте. Добавьте его из каталога и возвращайтесь сюда."
        actionLabel="Открыть каталог"
        onAction={() => navigate(`/courses?focus=${courseSlug}`)}
      />
    );
  }

  if (isLoading) {
    return <CoursePageSkeleton />;
  }

  if (isError || !course) {
    return (
      <PlaceholderState
        title="Не удалось загрузить курс"
        description={error instanceof Error ? error.message : "Попробуйте обновить страницу."}
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
          <aside className="hidden lg:flex flex-col border-r border-border/40" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="p-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
              <button className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LessonsNavigation
                lessons={lessons}
                activeLessonId={activeLessonId}
                completedLessons={completedLessons}
                onSelect={navigateToLesson}
              />
            </div>
          </aside>

          {/* Right Main Content */}
          <section className="flex flex-col min-h-0 bg-white">
            {activeLesson ? (
              <LessonContent
                lesson={activeLesson}
                course={course}
                currentIndex={currentIndex}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                activeLessonCompleted={activeLessonCompleted}
                progressSaving={progressSaving}
                progressLoading={progressLoading}
                onToggleLesson={handleToggleLesson}
                onNavigateToLesson={navigateToLesson}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground p-8">
                <BookOpen className="h-10 w-10" />
                <p className="text-lg font-semibold">Нет доступных уроков</p>
                <p className="text-sm">Как только уроки появятся, вы увидите их здесь.</p>
              </div>
            )}
            {/* Mobile Lessons Button */}
            {lessons.length > 0 ? (
              <div className="lg:hidden px-6 py-4">
                <Button variant="outline" className="w-full" onClick={() => setMobileLessonsOpen(true)}>
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
              onSelect={navigateToLesson}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

type LessonsNavigationProps = {
  lessons: LessonNode[];
  activeLessonId: string | null;
  completedLessons: Set<string>;
  onSelect: (lessonId: string) => void;
};

const LessonsNavigation = ({ lessons, activeLessonId, completedLessons, onSelect }: LessonsNavigationProps) => {
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
                <p className={`font-semibold text-base ${isActive ? "text-foreground" : "text-foreground"}`}>
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

type PlaceholderProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: ReactNode;
};

const PlaceholderState = ({ title, description, actionLabel, onAction, icon }: PlaceholderProps) => (
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

type LessonContentProps = {
  lesson: LessonNode;
  course: PublicCourse;
  currentIndex: number;
  prevLesson: LessonNode | null;
  nextLesson: LessonNode | null;
  activeLessonCompleted: boolean;
  progressSaving: boolean;
  progressLoading: boolean;
  onToggleLesson: (lessonId: string) => Promise<void>;
  onNavigateToLesson: (lessonId: string) => void;
};

const LessonContent = memo(({
  lesson,
  course,
  currentIndex,
  prevLesson,
  nextLesson,
  activeLessonCompleted,
  progressSaving,
  progressLoading,
  onToggleLesson,
  onNavigateToLesson,
}: LessonContentProps) => {
  const videoEmbed = getVideoEmbed(lesson.video_url);

  return (
    <div className="flex-1 flex flex-col min-h-0 max-w-[1000px] w-full mx-auto"  key={lesson.id} >
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">

        {/* Video Player */}
        {videoEmbed ? (
          <div className="overflow-hidden rounded-xl bg-black">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={videoEmbed.src}
                title={videoEmbed.title ?? lesson.title}
                allow={videoEmbed.allow}
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
                key={lesson.id}
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full rounded-xl bg-black" style={{ paddingTop: "56.25%" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <button className="mx-auto h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <PlayCircle className="h-8 w-8 text-white" />
                </button>
                <div className="text-white">
                  <p className="font-medium">Видео пока не добавлено</p>
                  <p className="text-sm text-white/70 mt-1">
                    Как только куратор прикрепит ссылку, вы сможете смотреть урок прямо здесь.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        {lesson.content_md?.trim().length ? (
          <div className="rounded-lg bg-white border border-border p-6" data-color-mode="light">
            <MDEditor.Markdown source={lesson.content_md} rehypePlugins={[[rehypeSanitize]]} />
          </div>
        ) : null}

        {/* Complete Lesson Button or Status with Navigation */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => prevLesson && onNavigateToLesson(prevLesson.id)}
              disabled={!prevLesson}
              className="h-11 w-11 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {activeLessonCompleted ? (
              <div className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Урок завершен</span>
              </div>
            ) : (
              <Button
                onClick={async () => {
                  await onToggleLesson(lesson.id);
                  // Auto-navigate to next lesson after completion
                  if (nextLesson) {
                    setTimeout(() => {
                      onNavigateToLesson(nextLesson.id);
                    }, 300);
                  }
                }}
                disabled={progressSaving}
                className="flex-1 gap-2"
                size="lg"
              >
                {progressSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Завершить урок
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => nextLesson && onNavigateToLesson(nextLesson.id)}
              disabled={!nextLesson}
              className="h-11 w-11 flex-shrink-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

LessonContent.displayName = "LessonContent";

const CoursePageSkeleton = () => (
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

export default CoursePlayer;

