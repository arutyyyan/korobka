import { Button } from "@/components/ui/button";

const Footer = () => {
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
            className="text-lg px-8 py-6 h-auto"
            onClick={() => window.open('https://tribute.to/korobka', '_blank')}
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
