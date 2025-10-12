import { Button } from "@/components/ui/button";
import { getBotUrl } from "@/lib/utils";

const FreeLesson = () => {
  const handleClick = () => {
    // Отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_continue"); // 👈 цель для кнопки "Продолжить обучение"
    }
    // Открываем Telegram-бот
    window.open(getBotUrl(), "_blank");
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Бесплатный урок
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Попробуй прямо <span className="text-primary">сейчас</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Посмотри реальный урок из модуля "ChatGPT для контента" и пойми, насколько просто создавать контент с ИИ
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Video Section */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-2 shadow-lg">
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/AGF1k0tqitc"
                  title="ChatGPT для контента - Как сделать контент-план за 5 минут"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Как сделать контент-план за 5 минут
                  </h3>
                  <p className="text-gray-600">
                    Урок из модуля "ChatGPT для контента"
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Создаешь контент-план за 5 минут вместо часов",
                  "Автоматизируешь весь процесс планирования",
                  "Получаешь готовые идеи для постов",
                  "Экономишь время на креативе"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={handleClick}
                  className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 font-semibold px-8 py-4 rounded-2xl transition-all text-lg hover:scale-105 transform shadow-lg w-full sm:w-auto"
                >
                  🚀 Продолжить обучение в Коробке
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Полный доступ ко всем курсам за 20€/мес
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm text-gray-600">курсов доступно</div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-600">поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeLesson;
