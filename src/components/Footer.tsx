import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="py-20 px-4 border-t border-border/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Готов стать востребованным специалистом?
          </h2>
          <p className="text-xl text-muted-foreground">
            Присоединяйся к Коробке и начни учиться ИИ на практике уже сегодня
          </p>
          <Button 
            size="lg" 
            variant="hero" 
            className="text-lg px-8 py-6 h-auto"
            onClick={() => window.open('https://tribute.to/korobka', '_blank')}
          >
            🎁 Получить доступ за 20€/мес
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
