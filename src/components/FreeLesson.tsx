import { Button } from "@/components/ui/button";

const FreeLesson = () => {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            🎥 Попробуй прямо <span className="gradient-text">сейчас</span>
          </h2>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Video Placeholder */}
          <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center border border-border/50">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎬</div>
              <p className="text-lg text-muted-foreground max-w-md">
                Урок из модуля "ChatGPT для контента": <br />
                <span className="font-semibold text-foreground">Как сделать контент-план за 5 минут</span>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              variant="hero" 
              className="text-xs sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto whitespace-normal leading-tight sm:leading-normal"
              onClick={() => window.open('https://tribute.to/korobka', '_blank')}
            >
              🚀 Продолжить обучение в Коробке
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeLesson;
