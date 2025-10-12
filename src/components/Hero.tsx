import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getBotUrl } from "@/lib/utils";
import { useState } from "react";
const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    // отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_access"); // <-- имя цели
    }
    // открываем Telegram-бот
    window.open(getBotUrl(), "_blank");
  };

  const handleFreeLessonClick = () => {
    // отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_free_lesson");
    }
    setIsModalOpen(true);
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      {/* AI Tools Background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto px-8">
            {/* Popular AI Tools */}
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-green-300 shadow-lg backdrop-blur-sm">
                GPT
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/30 border border-orange-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-orange-300 shadow-lg backdrop-blur-sm">
                Claude
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-purple-300 shadow-lg backdrop-blur-sm">
                MJ
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-blue-300 shadow-lg backdrop-blur-sm">
                Lovable
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-pink-500/30 to-pink-600/30 border border-pink-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-pink-300 shadow-lg backdrop-blur-sm">
                Runway
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-cyan-300 shadow-lg backdrop-blur-sm">
                Pika
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-red-500/30 to-red-600/30 border border-red-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-red-300 shadow-lg backdrop-blur-sm">
                Sora
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-indigo-300 shadow-lg backdrop-blur-sm">
                Gemini
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-teal-500/30 to-teal-600/30 border border-teal-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-teal-300 shadow-lg backdrop-blur-sm">
                Make
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 border border-yellow-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-yellow-300 shadow-lg backdrop-blur-sm">
                Zapier
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-emerald-300 shadow-lg backdrop-blur-sm">
                Perplexity
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-600/30 border border-violet-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-violet-300 shadow-lg backdrop-blur-sm">
                DALL-E
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-rose-500/30 to-rose-600/30 border border-rose-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-rose-300 shadow-lg backdrop-blur-sm">
                Framer
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-amber-300 shadow-lg backdrop-blur-sm">
                Bolt
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-lime-500/30 to-lime-600/30 border border-lime-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-lime-300 shadow-lg backdrop-blur-sm">
                ElevenLabs
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 border border-sky-500/20 flex items-center justify-center text-xs md:text-sm font-bold text-sky-300 shadow-lg backdrop-blur-sm">
                Align Code
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle accent lines */}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-primary/50 to-transparent" />
      <div className="absolute bottom-1/4 right-0 w-48 h-px bg-gradient-to-l from-secondary/50 to-transparent" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-10 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="bg-white inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm backdrop-blur-sm mb-8 hover:border-primary/50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Новые уроки каждую неделю</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
            <span className="block text-foreground">Все ИИ-навыки</span>
            <span className="block gradient-text">в одном месте</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
          Одна подписка на все актуальные знания по нейросетям в одном месте
          </p>

          {/* CTA Section */}
          <div className="flex flex-col  items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              variant="hero"
              className="text-lg px-8 py-4 h-auto min-w-[280px] font-semibold group"
              onClick={handleClick}
            >
              <span className="flex items-center gap-3">
                <span>Начать обучение</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>20€/мес • Отменить в любой момент</span>
            </div>
          </div>

          {/* Free Lesson Image */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div 
              className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]"
              onClick={handleFreeLessonClick}
            >
              <img
                src="/free_lesson.webp"
                alt="Бесплатный пробный урок"
                className="w-full h-auto object-cover"
              />
              
              
              
              {/* Free Lesson Badge */}
              <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold border border-gray-200">
                Вводный урок
              </div>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Course Card */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl text-left font-bold text-gray-900 mb-1">100+ </h3>
                  <p className="text-sm text-gray-600">практических уроков</p>
                </div>
              </div>
            </div>

            {/* Access Card */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-left font-bold text-gray-900 mb-1">Еженедельно</h3>
                  <p className="text-sm text-gray-600">выходят новые уроки</p>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl  text-left font-bold text-gray-900 mb-1">24/7 поддержка</h3>
                  <p className="text-sm text-gray-600">сообщества экспертов</p>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};
export default Hero;
