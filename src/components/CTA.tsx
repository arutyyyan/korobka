import { getBotUrl } from "@/lib/utils";

const CTA = () => {
  const handleClick = () => {
    // Отправляем событие в Яндекс.Метрику
    if (window.ym) {
      window.ym(104427792, "reachGoal", "click_start_learning_skidka'");
    }
    // Открываем Telegram-бот
    window.open(getBotUrl(), "_blank");
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Text Content (2/5) */}
            <div className="lg:w-2/4 p-8 md:p-12 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 w-fit">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Ограниченное предложение
              </div>

              {/* Main Heading */}
              <h3 className="text-4xl  md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Научись
                <br />
                применять ИИ
                <br />
                <span className="text-gray-900">уже сегодня</span>
              </h3>

              {/* Discount Text */}
              <p className="text-xl sm:text-2xl text-gray-700 mb-4 font-medium">
                Получи скидку 30%
              </p>
              <p className="text-lg text-primary font-semibold mb-8">
                Промокод: CHAT
              </p>

              {/* CTA Button */}
              <button
                onClick={handleClick}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-4 w-full rounded-2xl transition-all text-lg hover:scale-105 transform "
              >
                Начать обучение со скидкой
              </button>
            </div>

            {/* Right Section - Image (3/5) */}
            <div className="lg:w-2/4 relative mb-[-60px] lg:mb-0 lg:mt-[-60px] ">
              <img
                src="/mobile_banner.webp"
                alt="Mobile Banner"
                className=" object-cover object-top min-h-[200px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
