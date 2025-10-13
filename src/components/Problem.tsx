import lovableIcon from "@/assets/lovable.webp";
import chatgptIcon from "@/assets/chatgpt.webp";
import makeIcon from "@/assets/make.webp";
import soraIcon from "@/assets/sora.webp";
import { getBotUrl } from "@/lib/utils";

const Problem = () => {

  const handleClick = () => {
    // Отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_start");
    }
    // Открываем Telegram-бот
    window.open(getBotUrl(), "_blank");
  };


  return (
    <section className="py-10 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm backdrop-blur-sm mb-6">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className=" gradient-text font-semibold">Реальность рынка</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 max-w-2xl mx-auto">
            ИИ уже меняет <span className="gradient-text">рынок</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Компании сокращают людей, и активно нанимают тех, кто умеет использовать ИИ-инструменты
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Problem Side */}
          <div className="space-y-8">
            <div className="relative">
              {/* Problem Card */}
              <div className="rounded-3xl p-6 border border-red-100 relative overflow-hidden" 
                   style={{
                     backgroundImage: "url('/problem_bg.webp')",
                     backgroundSize: "cover",
                     backgroundPosition: "center top",
                     backgroundRepeat: "no-repeat"
                   }}>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/20 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6 flex-col">
                    <div className="w-16 h-16 bg-[#EB6147] rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/40">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Пока ты просто смотришь рилсы про ИИ</h3>
                      <p className="text-gray-600">
                        Слышишь про новые нейросети, но не пробуешь их на практике
                      </p>
                    </div>
                  </div>

                   {/* Problem Examples */}
              <div className="mt-6 space-y-3">
                {[
                  { text: "Смотришь TikTok про ChatGPT" },
                  { text: "Читаешь новости про ИИ" },
                  { text: "Думаешь «когда-нибудь попробую»" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-100">
                    <div className="w-5 h-5 flex-shrink-0">
                      <img src="/cancel.svg" alt="Cancel" className="w-full h-full" />
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
                  
                 
                </div>
              </div>

             
            </div>
          </div>

          {/* Solution Side */}
          <div className="space-y-8">
            <div className="relative">
              {/* Solution Card */}
              <div className="rounded-3xl p-6 border border-primary/20 relative overflow-hidden"
                   style={{
                     backgroundImage: "url('/solution_bg.webp')",
                     backgroundSize: "cover",
                     backgroundPosition: "center top",
                     backgroundRepeat: "no-repeat"
                   }}>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl"></div>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Другие уже зарабатывают</h3>
                      <p className="text-gray-600">
                        Используют ИИ для автоматизации и масштабирования бизнеса
                      </p>
                    </div>
                  </div>

                   {/* Benefits Grid */}
              <div className="mt-6 grid gap-4">
                {[
                  { 
                    icon: lovableIcon, 
                    title: "Создают сайты", 
                    desc: "за пару часов вместо недель разработки",
                    color: "bg-primary text-white"
                  },
                  { 
                    icon: chatgptIcon, 
                    title: "Генерируют контент", 
                    desc: "месячный объем за один вечер",
                    color: "bg-primary text-white"
                  },
                  { 
                    icon: makeIcon, 
                    title: "Автоматизируют продажи", 
                    desc: "через Telegram-ботов",
                    color: "bg-primary text-white"
                  },
                  { 
                    icon: soraIcon, 
                    title: "Делают видео", 
                    desc: "без камеры и монтажера",
                    color: "bg-primary text-white"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center border-primary/30 gap-4 py-4 px-5 bg-[#fafafa] rounded-2xl border border-gray-100 ">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                      <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
                  
                 
                
                </div>
              </div>

             
            </div>
          </div>
        </div>

        {/* CV/Resume CTA Block */}
        <div className="mt-16">
          <div className="bg-primary rounded-3xl p-8  relative overflow-hidden">
            {/* Background Pattern */}
            
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* CV Visual */}
                <div className="order-2 lg:order-1 rotate-[-2deg]">
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200  mx-auto">
                    {/* CV Header */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Руслан Арманов</h4>
                        <p className="text-sm text-gray-600">Маркетолог</p>
                      </div>
                    </div>
                    
                    {/* Skills Section */}
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Навыки</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Настройка рекламы</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <span className="text-sm font-semibold text-primary">ИИ-навыки</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Контент-маркетинг</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Content */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Будущее уже здесь
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                      Через год <span className="text-white/90">ИИ-опыт</span> будет в каждом резюме
                    </h3>
                    <p className="text-lg text-white/80 mb-6">
                      И вопрос будет не <em>«зачем учить ИИ»</em>, а <em className="text-white font-semibold">«почему ты до сих пор не умеешь?»</em>
                    </p>
          </div>

                 

                  <button onClick={handleClick} className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-4 rounded-2xl transition-colors shadow-lg">
                    Начать обучение
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Problem;