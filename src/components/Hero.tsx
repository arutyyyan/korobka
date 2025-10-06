import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ai.jpg";
import logoBox from "@/assets/logo-box.png";
import { getBotUrl } from "@/lib/utils";
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm">
            <span className="gradient-text font-semibold">
              Уже первые ученики проходят обучение и делятся результатами
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            <span>Все ИИ-курсы в одной</span>{" "}
            <span className="gradient-text inline-flex items-center gap-2 md:gap-3">
              Коробке
              <img src={logoBox} alt="Коробка" className="mt-2 w-12 h-12 md:w-16 md:h-16 inline-block" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ChatGPT, ИИ-фотосессии, видео-генерация, автоматизация и монетизация— всё, что нужно, чтобы зарабатывать и
            оставаться востребованным в эпоху ИИ в одной Telegram-подписке.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              size="lg"
              variant="hero"
              className="text-sm sm:text-base md:text-lg px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto"
              onClick={() => window.open(getBotUrl(), "_blank")}
            >
              🎁 Получить доступ за 20€/мес
            </Button>
            <p className="text-sm text-muted-foreground">
              Один Telegram-доступ. Десятки практических курсов. Новые уроки каждую неделю.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
};
export default Hero;
