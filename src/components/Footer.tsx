import { Button } from "@/components/ui/button";
import { getBotUrl } from "@/lib/utils";

const Footer = () => {
  const handleClick = () => {
    // Отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_open"); // 👈 название цели в Метрике
    }
    // После этого открываем Telegram-бота
    window.open(getBotUrl(), "_blank");
  };
  return (
    <footer className="py-20 px-4 border-t border-border/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            🔥 Начни применять ИИ <span className="gradient-text">сегодня</span>
          </h2>
          <div className="space-y-4">
            <p className="text-2xl font-semibold">
              Всё обучение — в одной Коробке.
            </p>
            <p className="text-xl text-muted-foreground">
              20€ в месяц. Доступ ко всем курсам. Отмена в один клик.
            </p>
            <p className="text-lg text-muted-foreground">
              Не нужно ждать «подходящего момента». Он уже прошёл.
            </p>
          </div>
          <Button
            size="lg"
            variant="hero"
            className="text-sm sm:text-base md:text-lg px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto"
            onClick={handleClick}
          >
            🎁 Открыть Коробку и получить доступ
          </Button>

          <div className="pt-12 mt-12 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              © 2025 Коробка. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
