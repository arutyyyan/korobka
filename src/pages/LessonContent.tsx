import { memo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Loader2,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import "@uiw/react-markdown-preview/markdown.css";

import { Button } from "@/components/ui/button";
import { LessonFiles } from "@/components/LessonFiles";
import { getVideoEmbed } from "@/lib/video";
import type { LessonNode, PublicCourse } from "./CoursePlayer.types";

type LessonContentProps = {
  lesson: LessonNode;
  course: PublicCourse;
  lessonsCount: number;
  activeLessonCompleted: boolean;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  prevLesson: LessonNode | null;
  nextLesson: LessonNode | null;
  onToggleLesson: (lessonId: string) => Promise<{ courseCompleted: boolean }>;
  onNavigateToLesson: (lessonId: string) => void;
  onCourseCompleted?: () => void;
  progressSaving: boolean;
  canViewContent: boolean;
};

export const LessonContent = memo(
  ({
    lesson,
    course,
    lessonsCount,
    activeLessonCompleted,
    isFirstLesson,
    isLastLesson,
    prevLesson,
    nextLesson,
    onToggleLesson,
    onNavigateToLesson,
    onCourseCompleted,
    progressSaving,
    canViewContent,
  }: LessonContentProps) => {
    const videoEmbed = getVideoEmbed(lesson.video_url);

    return (
      <div
        className="flex-1 flex flex-col min-h-0 max-w-[1000px] w-full mx-auto"
        key={lesson.id}
      >
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
          {/* Video Player */}
          {videoEmbed ? (
            <div className="overflow-hidden rounded-xl bg-black">
              <div
                style={{
                  padding: "56.25% 0 0 0",
                  position: "relative",
                }}
              >
                <iframe
                  src={videoEmbed.src}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  title="Video player"
                />
              </div>
            </div>
          ) : (
            <div
              className="relative w-full rounded-xl bg-black"
              style={{ paddingTop: "56.25%" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <button className="mx-auto h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </button>
                  <div className="text-white">
                    <p className="font-medium">Видео пока не добавлено</p>
                    <p className="text-sm text-white/70 mt-1">
                      Как только куратор прикрепит ссылку, вы сможете смотреть
                      урок прямо здесь.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          {lesson.content_md?.trim().length ? (
            <div
              className="rounded-lg bg-white border border-border p-6"
              data-color-mode="light"
            >
              <MDEditor.Markdown
                source={lesson.content_md}
                rehypePlugins={[[rehypeSanitize]]}
              />
            </div>
          ) : null}

          {/* Lesson Files */}
          {canViewContent && <LessonFiles lessonId={lesson.id} />}

          {/* Complete Lesson Button or Status with Navigation */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2">
              {!isFirstLesson && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (prevLesson) {
                      onNavigateToLesson(prevLesson.id);
                    }
                  }}
                  disabled={!prevLesson}
                  className="h-11 w-11 flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {activeLessonCompleted ? (
                <div className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    Урок завершен
                  </span>
                </div>
              ) : (
                <Button
                  onClick={async () => {
                    const result = await onToggleLesson(lesson.id);
                    // Auto-navigate to next lesson after completion
                    if (result.courseCompleted) {
                      onCourseCompleted?.();
                    } else if (nextLesson) {
                      setTimeout(() => {
                        onNavigateToLesson(nextLesson.id);
                      }, 300);
                    } else {
                      // No next lesson - course is completed
                      onCourseCompleted?.();
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
              {!isLastLesson && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (nextLesson) {
                      onNavigateToLesson(nextLesson.id);
                    }
                  }}
                  disabled={!nextLesson}
                  className="h-11 w-11 flex-shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LessonContent.displayName = "LessonContent";
