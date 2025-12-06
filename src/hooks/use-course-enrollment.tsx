import { useState } from "react";
import type { Course } from "@/config/courses";
import AuthButton from "@/components/Auth/AuthButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

import { useEnrollments } from "@/hooks/use-enrollments";
import { useToast } from "@/hooks/use-toast";
import { getBotUrl } from "@/lib/utils";

type UseCourseEnrollmentResult = {
  openEnrollment: (course: Course) => void;
  enrollmentDialog: JSX.Element;
  isEnrolled: (course: Course | string | null | undefined) => boolean;
  enrollmentLoading: boolean;
  enrollmentSubmitting: boolean;
  userEmail: string | null;
};

const resolveSlug = (course: Course | string | null | undefined) => {
  if (!course) {
    return undefined;
  }
  if (typeof course === "string") {
    return course;
  }
  return course.slug;
};

export const useCourseEnrollment = (): UseCourseEnrollmentResult => {
  const { toast } = useToast();
  const { user, enrollmentMap, loading, enrolling, enroll } = useEnrollments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
  };

  const isEnrolled = (course: Course | string | null | undefined) => {
    const slug = resolveSlug(course);
    if (!slug) {
      return false;
    }
    return Boolean(enrollmentMap[slug]);
  };

  const handleConfirmEnrollment = async () => {
    if (!selectedCourse?.slug) {
      closeDialog();
      return;
    }
    if (!user) {
      toast({
        title: "Войдите в аккаунт",
        description: "Авторизуйтесь, чтобы записаться на курс.",
        variant: "destructive",
      });
      return;
    }
    try {
      await enroll(selectedCourse.slug);
      toast({
        title: "Вы записаны!",
        description: `${selectedCourse.title} появился в разделе «Моё обучение».`,
      });
      closeDialog();
    } catch (error) {
      console.error("Enrollment failed", error);
      toast({
        title: "Не удалось записаться",
        description: error instanceof Error ? error.message : "Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  const openEnrollment = (course: Course) => {
    if (!course.slug) {
      window.open(getBotUrl(), "_blank", "noopener");
      return;
    }
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const enrollmentDialog = (
    <Dialog
      open={dialogOpen}
      onOpenChange={(next) => {
        setDialogOpen(next);
        if (!next) {
          setSelectedCourse(null);
        }
      }}
    >
      <DialogContent className="max-w-xl">
        {selectedCourse ? (
          <>
            <DialogHeader>
              <DialogTitle>Запись на «{selectedCourse.title}»</DialogTitle>
              <DialogDescription>
                Курс станет доступен сразу после подтверждения. Мы пришлём инструкции на {user?.email ?? "почту аккаунта"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-muted/40 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Что входит:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Все уроки и будущие обновления</li>
                  <li>Практические задания и шаблоны</li>
                  <li>Доступ к сообществу и поддержке</li>
                </ul>
              </div>
              {selectedCourse.skills?.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Прокачаете навыки:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.skills.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button variant="outline" onClick={closeDialog} className="w-full sm:w-auto">
                Отмена
              </Button>
              {user ? (
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleConfirmEnrollment}
                  disabled={enrolling || isEnrolled(selectedCourse)}
                >
                  {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEnrolled(selectedCourse) ? "Уже записаны" : "Подтвердить"}
                </Button>
              ) : (
                <div className="w-full space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Авторизуйтесь, чтобы продолжить
                  </p>
                  <AuthButton size="lg" fullWidth />
                </div>
              )}
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );

  return {
    openEnrollment,
    enrollmentDialog,
    isEnrolled,
    enrollmentLoading: loading,
    enrollmentSubmitting: enrolling,
    userEmail: user?.email ?? null,
  };
};

