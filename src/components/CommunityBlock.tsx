import { Button } from "@/components/ui/button";
import { getBotUrl } from "@/lib/utils";
import communityImage from "@/assets/community.webp";

const CommunityBlock = () => {
  const handleClick = () => {
    window.open(getBotUrl(), "_blank");
  };

  return (
    <section className="px-4 mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden bg-white rounded-3xl border border-gray-200 px-1 pt-6 md:px-16 md:pb-0 md:pr-16 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-3 md:space-y-6 px-4 md:px-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 md:gap-4 rounded-full border border-border/60 bg-white px-4 py-2  text-sm backdrop-blur-sm">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.76 8.76 0 01-3.78-.84L2 17l.967-3.63A6.854 6.854 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zm-9-3a1 1 0 100 2 1 1 0 000-2zm1 8a5 5 0 005-5h-2a3 3 0 01-3 3v2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="gradient-text font-semibold">Сообщество</span>
              </div>
              
              <h2 className="text-4xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Смотришь курсы, но вопросы задать некому?
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                Помимо уроков, у нас живое комьюнити с постоянной поддержкой и ответами на все ваши вопросы
              </p>
              
              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 h-auto font-semibold rounded-2xl transition-colors"
                  onClick={handleClick}
                >
                  Купить подписку
                </Button>
              </div>
            </div>

            {/* Right Side - Community Image */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={communityImage}
                alt="Сообщество поддержки"
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityBlock;
