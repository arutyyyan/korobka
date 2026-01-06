import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getUserRoadmap, type RoadmapStep } from "@/api/roadmap";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/use-auth";

type CourseFromDB = {
  slug: string;
  title: string;
  subtitle: string | null;
  hero_image_url: string | null;
  description: string | null;
};

const MyLearningRoadmap = () => {
  const { user } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { data: roadmap, isLoading: roadmapLoading } = useQuery({
    queryKey: ["user-roadmap"],
    queryFn: getUserRoadmap,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch course details for all course slugs
  const allCourseSlugs =
    roadmap?.steps.flatMap((step) => step.courses.map((c) => c.slug)) ?? [];
  const uniqueSlugs = Array.from(new Set(allCourseSlugs));

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses-for-roadmap", uniqueSlugs],
    queryFn: async () => {
      if (uniqueSlugs.length === 0) return [];
      const { data, error } = await supabase
        .from("courses")
        .select("slug, title, subtitle, hero_image_url, description")
        .in("slug", uniqueSlugs);

      if (error) throw error;
      return (data ?? []) as CourseFromDB[];
    },
    enabled: uniqueSlugs.length > 0,
  });

  const coursesMap = new Map(
    (coursesData ?? []).map((course) => [course.slug, course])
  );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Auto-expand current group
  if (roadmap?.currentGroupId && !expandedGroups.has(roadmap.currentGroupId)) {
    setExpandedGroups(new Set([roadmap.currentGroupId]));
  }

  if (roadmapLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-lg">
          Загружаем ваш персональный роадмап...
        </p>
      </div>
    );
  }

  if (!roadmap || roadmap.steps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Роадмап пока пуст</h2>
          <p className="text-muted-foreground">
            Пройдите онбординг, чтобы получить персональный роадмап обучения
          </p>
        </div>
      </div>
    );
  }

  const getStepStatus = (step: RoadmapStep, isCurrent: boolean) => {
    if (step.progress.total === 0) return "empty";
    if (isCurrent) return "current";
    if (step.progress.completed === step.progress.total) return "completed";
    return "upcoming";
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit">
              Мой роадмап
            </Badge>
            <h1 className="text-4xl font-bold">Ваш путь обучения</h1>
            <p className="text-muted-foreground text-lg">
              Персональный план курсов на основе ваших целей и уровня
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.steps.map((step, index) => {
              const isCurrent = step.groupId === roadmap.currentGroupId;
              const isExpanded = expandedGroups.has(step.groupId);
              const status = getStepStatus(step, isCurrent);
              const progressPercent =
                step.progress.total > 0
                  ? (step.progress.completed / step.progress.total) * 100
                  : 0;

              return (
                <Card key={step.groupId} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleGroup(step.groupId)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 mt-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroup(step.groupId);
                            }}
                          >
                            {!isCurrent &&
                              (!isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              ))}
                          </Button>
                          <div className="flex-1 flex flex-col  gap-1">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-2xl text-[#111827] underline-offset-4 hover:underline">
                                Шаг {index + 1}: {step.title}
                              </CardTitle>

                              {step.progress.total > 0 && (
                                <Badge
                                  variant={
                                    status === "completed"
                                      ? "default"
                                      : status === "current"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {status === "completed" && "Завершён"}
                                  {status === "current" && "Текущий"}
                                  {status === "upcoming" && "Следующий"}
                                  {status === "empty" && "Пусто"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              {step.outcome && (
                                <CardTitle className="text-base text-muted-foreground">
                                  Результат: {step.outcome}
                                </CardTitle>
                              )}
                              {step.progress.total > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  Прогресс: {step.progress.completed} /{" "}
                                  {step.progress.total}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      {step.courses.length === 0 ? (
                        <p className="text-muted-foreground text-sm pl-8">
                          Курсы в этой группе пока не добавлены
                        </p>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-8">
                          {step.courses.map((courseItem) => {
                            const course = coursesMap.get(courseItem.slug);
                            if (!course) {
                              return (
                                <Card
                                  key={courseItem.slug}
                                  className="animate-pulse"
                                >
                                  <div className="aspect-video bg-muted" />
                                  <CardContent className="p-4 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                  </CardContent>
                                </Card>
                              );
                            }

                            return (
                              <Card
                                key={courseItem.slug}
                                className="group overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <Link to={`/learn/${courseItem.slug}`}>
                                  <div className="aspect-video bg-muted relative overflow-hidden">
                                    {course.hero_image_url ? (
                                      <img
                                        src={course.hero_image_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <BookOpen className="h-12 w-12" />
                                      </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                      {courseItem.status === "completed" && (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 bg-white rounded-full" />
                                      )}
                                      {courseItem.status === "in_progress" && (
                                        <PlayCircle className="h-5 w-5 text-blue-500 bg-white rounded-full" />
                                      )}
                                    </div>
                                  </div>
                                  <CardContent className="p-4 space-y-2">
                                    {course.subtitle && (
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        {course.subtitle}
                                      </p>
                                    )}
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                      {course.title}
                                    </h3>
                                    {course.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {course.description}
                                      </p>
                                    )}
                                    <div className="pt-2">
                                      <Button
                                        variant={
                                          courseItem.status === "completed"
                                            ? "outline"
                                            : courseItem.status ===
                                              "in_progress"
                                            ? "default"
                                            : "default"
                                        }
                                        className="w-full"
                                        size="sm"
                                      >
                                        {courseItem.status === "completed" && (
                                          <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Завершён
                                          </>
                                        )}
                                        {courseItem.status ===
                                          "in_progress" && (
                                          <>
                                            <PlayCircle className="h-4 w-4 mr-2" />
                                            Продолжить
                                          </>
                                        )}
                                        {courseItem.status ===
                                          "not_started" && (
                                          <>
                                            <PlayCircle className="h-4 w-4 mr-2" />
                                            Начать
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Link>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearningRoadmap;
