import AuthButton from "@/components/Auth/AuthButton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import MyLearningRoadmap from "./MyLearningRoadmap";

const MyLearning = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="space-y-3 max-w-xl">
          <Badge variant="secondary" className="mx-auto">
            Моё обучение
          </Badge>
          <h1 className="text-4xl font-semibold">
            Войдите, чтобы увидеть свои курсы
          </h1>
          <p className="text-muted-foreground">
            Мы сохраним ваш прогресс на всех устройствах. Авторизация займёт не
            больше минуты.
          </p>
        </div>
        <AuthButton size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit">
              Моё обучение
            </Badge>
            <h1 className="text-3xl font-bold">Продолжить обучение</h1>
          </div>

          <MyLearningRoadmap />
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
