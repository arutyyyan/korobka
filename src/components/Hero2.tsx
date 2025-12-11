import { Button } from "@/components/ui/button";
import { getBotUrl } from "@/lib/utils";
import { useMemo, useState } from "react";
import MobileSnapSlider from "./MobileSnapSlider";

const Hero2 = () => {
  const stories = useMemo(
    () => [
      { id: "mF7EMEjAMwHKDqpM6UsBxb", title: "Что такое Коробка?" },
      { id: "t8h3CTx9oJvaFosAzt1Zrf", title: "В чем цель Коробки?" },
      {
        id: "mCgKmpAPJoYSuhHMuyrhTw",
        title: "Почему курс по ИИ вам не поможет",
      },
      { id: "vicLzrZWRayLD5Ck4YoV42", title: "Постоянное обучение" },
      { id: "pyXRgmXvkmQSinumJzFzui", title: "Заказы" },
      { id: "2FvfqDb8P9ZDzw9stg1vvd", title: "Цена" },
      { id: "aaNftRu1XYZ4m2YYhBQ22h", title: "Мы теряем деньги" },
      { id: "uSaBgxFyz4S6iGjsWpv2da", title: "Вас не заменит ИИ" },
    ],
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrimary = () => {
    window.open(getBotUrl(), "_blank");
  };

  const handleSecondary = () => {
    const coursesSection = document.getElementById("courses");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container relative mx-auto px-4 py-6 sm:py-4 lg:py-6 flex flex-col gap-2 w-full">
        <div className=" w-full flex justify-between items-center gap-6 lg:grid-cols-2 bg-white rounded-3xl p-2 pb-3 max-w-6xl mx-auto border border-gray-200">
          <div className="flex items-center gap-2 mt-1 ml-1">
          <img src="logo-box.png" alt="logo" className="w-8 object-contain" />
          <span className="text-xl font-bold">Korobka</span>
          </div>
          <Button
            size="lg"
            className="button text-[14px] font-semibold h-10 bg-primary rounded-2xl cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#3E8EE5,0_0px_0_0_#D0E4FA]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_4px_0_0_#3E8EE5]
    border-b-[1px] border-[#85C0FF]
  "
            onClick={handlePrimary}
          >
            Начать
          </Button>
        </div>
        <div className="grid items-center gap-6 lg:grid-cols-2 bg-white rounded-3xl p-3 md:p-8 md:px-8 max-w-6xl mx-auto border border-gray-200">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
              100+ учеников
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Начни зарабатывать
                <span className="block gradient-text">на нейросетях</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Готовые практические уроки, поддержка сообщества.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "Новые уроки каждую неделю",
                "Поддержка сообщества",
                "Практика в реальных проектах",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-800 shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className=" mt-4 mb-4 button w-full text-md font-semibold h-14 bg-primary rounded-2xl cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#3E8EE5,0_0px_0_0_#D0E4FA]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_7px_0_0_#3E8EE5,0_12px_0px_0_#D0E4FA]
    border-b-[1px] border-[#85C0FF]
  "
                onClick={handlePrimary}
              >
                Приобрести подписку
              </Button>
              {/* <Button
                variant="secondary"
                size="lg"
                className="h-auto min-w-[200px] rounded-xl border-gray-200 bg-white px-7 py-4 text-lg font-semibold text-primary"
                onClick={handleSecondary}
              >
                Посмотреть программу
              </Button> */}
            </div>

            <div className="hidden md:block">
              <MobileSnapSlider />
            </div>

            <div className="block md:hidden mb-4 flex items-center justify-between text-sm text-center">
              <p>
                Узнайте, что такое Коробка, посмотрев несколько коротких видео
              </p>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            {/* <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/20 blur-xl" /> */}
            <div className="relative w-full max-w-sm">
              {/* Progress dots */}
              <div className="mb-4 flex gap-2">
                {stories.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      idx <= activeIndex ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl bg-black">
                <div
                  className="relative w-full"
                  style={{ paddingTop: "177.78%" }}
                >
                  <iframe
                    key={stories[activeIndex].id}
                    src={`https://kinescope.io/embed/${stories[activeIndex].id}`}
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                    title={stories[activeIndex].title}
                    frameBorder="0"
                    allowFullScreen
                    className="absolute left-0 top-0 h-full w-full"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                {/* <span className="font-semibold text-gray-900">{stories[activeIndex].title}</span> */}
                <div className="flex gap-2 w-full">
                  <Button
                    size="sm"
                    className="text-primary bg-white border w-full h-9"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        prev === 0 ? stories.length - 1 : prev - 1
                      )
                    }
                  >
                    Назад
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-white bg-primary w-full h-9"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        prev === stories.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    Далее
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
