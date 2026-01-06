import { Button } from "@/components/ui/button";
import { getBotUrl } from "@/lib/utils";
import AuthButton from "@/components/Auth/AuthButton";
import blueBoxIcon from "@/assets/blue_box_icon.webp";

const Hero = () => {

  const handleClick = () => {
    window.open(getBotUrl(), "_blank");
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />

      {/* Subtle accent lines */}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-primary/50 to-transparent" />
      <div className="absolute bottom-1/4 right-0 w-48 h-px bg-gradient-to-l from-secondary/50 to-transparent" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-10 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Special Offer Badge */}
          <div className="pl-2 inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-full border border-primary/20 px-1 py-1 text-sm mb-8 hover:border-primary/40 transition-colors relative overflow-visible">
            {/* <img
              src={saleImage}
              alt="15% Sale"
              className="w-10 h-10 mt-[-15px] object-contain animate-bounce"
            /> */}
            <span className="text-primary font-medium">
              Промокод на скидку внизу
            </span>
            <span className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary font-semibold">
              -10%
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6">
            <span className="block text-foreground">Все ИИ-навыки</span>
            <span className="block gradient-text">в одном месте</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Одна подписка на все актуальные знания по нейросетям и
            AI-инструментам
          </p>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <AuthButton
              initialMode="signup"
              size="lg"
              variant="default"
              showIcon={false}
              className="bg-primary text-white hover:bg-primary/90 text-lg px-6 py-3 h-auto min-w-[200px] font-semibold rounded-xl"
            />
            <AuthButton
              initialMode="signin"
              size="lg"
              variant="outline"
              showIcon={false}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg px-6 py-3 h-auto min-w-[200px] font-semibold rounded-xl"
            />
          </div>

          {/* Call to Action Block */}
          <div className="bg-white rounded-3xl border border-gray-100  max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Text and Buttons */}
              <div className="md:p-10 p-6">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-left">
                  Понравился урок?
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed text-left">
                  Оформи подписку на обучение по всем направлениям ИИ: ChatGPT,
                  Вайб-кодинг, Make, Bolt, Sora
                </p>

                {/* Price */}
                <div className="mb-10 text-left">
                  <span className="text-lg font-semibold ext-left">
                    Цена: 20€/месяц
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-primary text-white hover:bg-primary/20 hover:text-primary/90 text-lg px-8 py-4 h-auto min-w-[200px] font-semibold rounded-xl"
                    onClick={handleClick}
                  >
                    Перейти в Коробку
                  </Button>

                  <Button
                    size="lg"
                    variant="secondary"
                    className="border-gray-300 text-primary  bg-gray-100 text-lg px-8 py-4 h-auto min-w-[200px] font-semibold rounded-xl  hover:text-white"
                    onClick={() => {
                      const coursesSection = document.getElementById("courses");
                      if (coursesSection) {
                        coursesSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Программа курсов
                  </Button>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="flex justify-center lg:justify-end md:mt-[-50px]   md:mr-[-50px]">
                <img
                  src={blueBoxIcon}
                  alt="Korobka Logo"
                  className=" object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
