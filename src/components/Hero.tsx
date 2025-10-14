import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getBotUrl } from "@/lib/utils";
import { useState } from "react";
import saleImage from "@/assets/30sale.webp";
import blueBoxIcon from "@/assets/blue_box_icon.webp";
import { Play, Volume2, Settings, Maximize } from "lucide-react";
const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    window.open(getBotUrl(), "_blank");
  };

  const handleFreeLessonClick = () => {
    setIsModalOpen(true);
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-full border border-primary/20 px-1 py-1 text-sm mb-8 hover:border-primary/40 transition-colors relative overflow-visible">
            <img 
              src={saleImage} 
              alt="30% Sale" 
              className="w-10 h-10 mt-[-15px] object-contain animate-bounce"
              
            />
            <span className="text-primary font-medium">
              Промокод на скидку внизу
            </span>
            <span className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary font-semibold">
              -30%
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

          {/* CTA Section */}
          {/* <div className="flex flex-col  items-center justify-center gap-4 mb-6">
            <Button
              size="lg"
              variant="hero"
              className="text-lg px-8 py-4 h-auto min-w-[280px] font-semibold group"
              onClick={handleClick}
            >
              <span className="flex items-center gap-3">
                <span>Начать обучение</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>20€/мес • Можно отменить в любой момент</span>
            </div>
          </div> */}

          {/* Free Lesson Card */}
          <div className="relative max-w-4xl mx-auto mb-16">

            <div
              className="group relative bg-white border border-border rounded-3xl p-2  md:p-3 hover:shadow-2xl transition-all duration-300 cursor-pointer w-full"
              onClick={handleFreeLessonClick}
            >
              <div className=" w-full">
                {/* <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold tracking-tight">Вводный видеоурок</h3>
                </div> */}
                
              
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/free_lesson.webp"
                  alt="Бесплатный пробный урок"
                  className="w-full h-auto object-cover"
                />

                {/* Free Lesson Badge */}
                <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold border border-gray-200">
                  Вводный урок
                </div>

                {/* Duration Chip */}
                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md shadow">
                  12:03
                </div>

               
                {/* Bottom Controls Bar */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                  {/* Controls Row */}
                  <div className="mt-2 flex items-center justify-between text-white">
                    <div className="text-xs sm:text-sm font-medium">0:00 / 12:03</div>
                    <div className="flex items-center gap-3 opacity-90">
                      {/* Volume */}
                      <Volume2 className="w-5 h-5" />
                      {/* Settings */}
                      <Settings className="w-5 h-5" />
                      {/* Fullscreen */}
                      <Maximize className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="w-full mt-2 px-3  text-sm sm:text-base text-muted-foreground text-center">
                  Посмотрите первый урок по основам ChatGPT и решите, подходит ли вам формат обучения
                </p>

              
            </div>
          </div>

          {/* YouTube Video Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/AGF1k0tqitc"
                  title="ChatGPT для контента - Как сделать контент-план за 5 минут"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </DialogContent>
          </Dialog>

          {/* Call to Action Block */}
          <div className="bg-white rounded-3xl border border-gray-100  max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Text and Buttons */}
              <div className="md:p-10 p-6">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-left">
                  Понравился урок?
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed text-left">
                  Оформи подписку на обучение по всем направлениям ИИ: ChatGPT, Вайб-кодинг, Make, Bolt, Sora
                </p>

                {/* Price */}
                <div className="mb-10 text-left">
                  <span className="text-lg font-semibold ext-left">Цена: 20€/месяц</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4 h-auto min-w-[200px] font-semibold rounded-xl"
                    onClick={handleClick}
                  >
                    Купить подписку
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="secondary"
                    className="border-gray-300 text-primary  bg-gray-100 text-lg px-8 py-4 h-auto min-w-[200px] font-semibold rounded-xl"
                    onClick={() => {
                      const coursesSection = document.getElementById('courses');
                      if (coursesSection) {
                        coursesSection.scrollIntoView({ behavior: 'smooth' });
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
