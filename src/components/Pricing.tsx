import { Button } from "@/components/ui/button";
import { getBotUrl } from "@/lib/utils";
import { useState, useEffect } from "react";

const Pricing = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const coursePrices = [
    { title: "Skillbox ИИ", price: "₽89,900", image: "/skillfatory.png" },
    { title: "Нетология ИИ", price: "₽99,000", image: "/netology.png" },
    { title: "GeekBrains ИИ", price: "₽79,990", image: "/yandeh.png" },
    { title: "Coursera ИИ", price: "$2,940", image: "/eduson.png" },
    { title: "Udemy ИИ", price: "$199", image: "/skillfatory.png" },
    { title: "EdX ИИ", price: "$1,500", image: "/netology.png" }
  ];

  const negativeFeatures = [
    { text: "Устаревает через 2 месяца", icon: "/cancel.svg" },
    { text: "Доступ к будущим курсам платный", icon: "/cancel.svg" },
    { text: "Переплата 300-500€", icon: "/cancel.svg" }
  ];

  const positiveFeatures = [
    { text: "Обновляется каждую неделю", icon: "/oi_reload.svg" },
    { text: "Учишь все ИИ-направления", icon: "/many_ai.svg" },
    { text: "Поддержка сообщества 24/7", icon: "/community.svg" }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % coursePrices.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [coursePrices.length]);

  const handleClick = () => {
    // Отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_start");
    }
    // Открываем Telegram-бот
    window.open(getBotUrl(), "_blank");
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>

            <span className=" gradient-text font-semibold">Экономия до 90%</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 max-w-2xl mx-auto">
            Все ИИ-навыки <br />
            <span className="gradient-text">по одной подписке</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Посмотри реальные цены на ИИ-курсы в других школах и пойми, насколько выгодна Коробка
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* Regular Course - Bad Option */}
          <div className="bg-white rounded-3xl p-8 pb-0 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Обычный курс <br /> по нейросетям</h3>
              
              {/* Price Display */}
              <div className="mb-4">
                <div className="md:text-6xl text-5xl font-black text-[#D24424] mb-1">300-500€</div>
                <p className="text-gray-600 text-lg">за один курс</p>
              </div>
              
         
              
              {/* Carousel Section */}
              <div className="rounded-3xl py-2 px-2 mb-2 bg-gray-100">
                {/* <div className="flex items-center justify-center  mb-1">
                  <h4 className="text-lg  text-gray-600">
                    Реальные цены в других школах:
                  </h4>
                </div> */}
                
                  <div className="relative">
                    <div className="bg-white rounded-xl relative">
                      <div className="w-full h-28 rounded overflow-hidden relative">
                        <img 
                          src={coursePrices[currentSlide].image}
                          alt={`${coursePrices[currentSlide].title} pricing`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  
                  {/* Navigation Dots */}
                  <div className="flex justify-center mt-3 gap-1">
                    {coursePrices.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide ? 'bg-[#D24424] w-6' : 'bg-[#D24424]/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Negative Features */}
            <div className="space-y-3 mb-0">
              {negativeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-red-100 p-1 rounded-sm flex items-center justify-center">
                    <img src={feature.icon} alt="Cancel" className="w-full h-full" />
                  </div>
                  <span className="text-gray-700 text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* Money Go Illustration */}
            <div className="flex justify-center">
              <img 
                src="/money_go.webp" 
                alt="Money going away" 
                className="w-74 object-contain"
              />
            </div>
          </div>

          {/* Korobka - Best Option */}
          <div className="bg-primary rounded-3xl p-8 text-white overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-4">Коробка <br /> AI-навыков</h3>
              
              {/* Price Display */}
              <div className="mb-4">
                <div className="md:text-6xl text-5xl font-black mb-1">20€/мес</div>
                <p className="text-white/80 text-lg">за все курсы</p>
              </div>
            </div>
            
            {/* Positive Features */}
            <div className="space-y-3 mb-6">
              {positiveFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white p-[6px] rounded-sm flex items-center justify-center">
                    <img src={feature.icon} alt={feature.text} className="w-full h-full" />
                  </div>
                  <span className="text-white text-xl font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <button onClick={handleClick} className="mb-8 flex items-center justify-center  gap-2 bg-white text-primary  font-semibold px-10 py-5 rounded-2xl transition-all text-xl transform w-full">
             Начать за 20€/мес
            </button>
            
            {/* Box Icon Illustration */}
            <div className="flex justify-center mb-[-100px]">
              <img 
                src="/box_icon.webp" 
                alt="AI Skills Box" 
                className="w-78 h-78 object-contain"
              />
            </div>
           
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;