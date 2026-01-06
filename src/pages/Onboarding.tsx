import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/use-auth";
import { getOnboardingConfig, type OnboardingStep } from "@/api/onboarding";
import { OnboardingQuestion } from "@/components/OnboardingQuestion";

type AnswersState = {
  [questionId: string]: string[] | string | null;
};

const Onboarding = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<AnswersState>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();

  // Fetch onboarding config
  const {
    data: config,
    isLoading: configLoading,
    isError: configError,
  } = useQuery({
    queryKey: ["onboarding-config"],
    queryFn: getOnboardingConfig,
  });

  const totalSteps = config?.steps.length || 0;
  const currentStep: OnboardingStep | undefined =
    config?.steps[currentStepIndex];
  const progress =
    totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  // Initialize answers from config
  useEffect(() => {
    if (config) {
      const initialAnswers: AnswersState = {};
      config.steps.forEach((step) => {
        if (step.type === "multi") {
          initialAnswers[step.id] = [];
        } else {
          initialAnswers[step.id] = null;
        }
      });
      setAnswers(initialAnswers);
    }
  }, [config]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const canProceed = (): boolean => {
    if (!currentStep) return false;

    const value = answers[currentStep.id];

    // Single: value !== null
    if (currentStep.type === "single") {
      return value !== null;
    }

    // Multi: array.length > 0 AND ≤ max_answers
    if (currentStep.type === "multi") {
      const arrayValue = Array.isArray(value) ? value : [];
      if (arrayValue.length === 0) return false;
      if (
        currentStep.max_answers !== null &&
        currentStep.max_answers !== undefined
      ) {
        return arrayValue.length <= currentStep.max_answers;
      }
      return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Пользователь не авторизован",
        variant: "destructive",
      });
      return;
    }

    if (!config) {
      toast({
        title: "Ошибка",
        description: "Конфигурация онбординга не загружена",
        variant: "destructive",
      });
      return;
    }

    // Validate all required fields
    for (const step of config.steps) {
      const value = answers[step.id];
      if (!value) {
        toast({
          title: "Заполните все обязательные поля",
          description: "Пожалуйста, ответьте на все вопросы",
          variant: "destructive",
        });
        return;
      }

      if (step.type === "multi") {
        const arrayValue = Array.isArray(value) ? value : [];
        if (arrayValue.length === 0) {
          toast({
            title: "Заполните все обязательные поля",
            description: "Пожалуйста, ответьте на все вопросы",
            variant: "destructive",
          });
          return;
        }
        // Check max_answers constraint
        if (step.max_answers !== null && step.max_answers !== undefined) {
          if (arrayValue.length > step.max_answers) {
            toast({
              title: "Превышен лимит выбора",
              description: `Можно выбрать не более ${step.max_answers} вариантов`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    setSubmitting(true);

    try {
      // Transform answers to match profile columns
      const profileData: Record<string, any> = {
        onboarding_completed: true,
      };

      config.steps.forEach((step) => {
        profileData[step.id] = answers[step.id];
      });

      // Save onboarding data to profile
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Refresh profile to update context
      await refreshProfile();

      toast({
        title: "Отлично!",
        description: "Ваши ответы сохранены. Добро пожаловать!",
      });

      navigate("/learn", { replace: true });
    } catch (error) {
      console.error("Error saving onboarding:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить ответы. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (
    stepId: string,
    newValue: string[] | string | null
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: newValue,
    }));
  };

  if (configLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Загрузка онбординга...</p>
          </div>
        </div>
      </div>
    );
  }

  if (configError || !config || !currentStep) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Ошибка загрузки</h1>
            <p className="text-muted-foreground">
              Не удалось загрузить конфигурацию онбординга. Попробуйте обновить
              страницу.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center">
            Давайте познакомимся
          </h1>
          <p className="text-center text-muted-foreground">
            Ответьте на несколько вопросов, чтобы мы подобрали для вас
            персональный роадмап
          </p>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{currentStep.title}</CardTitle>
              {currentStep.description && (
                <CardDescription>{currentStep.description}</CardDescription>
              )}
              {currentStep.type === "multi" &&
                currentStep.max_answers !== null &&
                currentStep.max_answers !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Можете выбрать до {currentStep.max_answers} вариантов
                  </p>
                )}
            </CardHeader>
            <CardContent>
              <OnboardingQuestion
                step={currentStep}
                value={answers[currentStep.id]}
                onChange={(newValue) =>
                  handleAnswerChange(currentStep.id, newValue)
                }
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-4">
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={submitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className={currentStepIndex === 0 ? "ml-auto" : ""}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : currentStepIndex === totalSteps - 1 ? (
              "Завершить"
            ) : (
              <>
                Далее
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
