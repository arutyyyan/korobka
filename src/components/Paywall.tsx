import { Button } from "@/components/ui/button";
import { MessageSquare, Lock } from "lucide-react";
import { generateTelegramLinkTokenWithPath, getTelegramLinkUrl } from "@/api/telegram";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type PaywallProps = {
  courseId?: string;
  lessonId?: string;
  courseTitle?: string;
  lessonTitle?: string;
};

export const Paywall = ({ courseId, lessonId, courseTitle, lessonTitle }: PaywallProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Get current path with search params
      const originPath = window.location.pathname + window.location.search;
      const token = await generateTelegramLinkTokenWithPath(originPath);
      const telegramUrl = getTelegramLinkUrl(token);
      window.open(telegramUrl, "_blank", "noopener,noreferrer");
      toast({
        title: "Откройте Telegram",
        description: "В Telegram нажмите Start, чтобы привязать аккаунт и оплатить.",
      });
    } catch (error) {
      console.error("Failed to generate Telegram link", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать ссылку для подключения",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-2xl border border-border shadow-xl text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Доступ по подписке</h3>
          <p className="text-muted-foreground">
            Смотрите первый урок бесплатно. Остальные — по подписке.
          </p>
          <p className="text-sm text-muted-foreground">
            Оплата и управление подпиской проходят в Telegram.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            size="lg"
            className="w-full gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            {loading ? "Подключение..." : "Оформить подписку в Telegram"}
          </Button>
        </div>
      </div>
    </div>
  );
};

