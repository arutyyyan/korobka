import { useEffect, useState } from "react";
import review1 from "@/assets/reviews/review1.jpeg";
import review2 from "@/assets/reviews/review2.jpeg";
import review3 from "@/assets/reviews/review3.jpeg";
import review4 from "@/assets/reviews/review4.jpeg";
import review5 from "@/assets/reviews/review5.jpeg";
import review6 from "@/assets/reviews/review6.jpeg";
import review7 from "@/assets/reviews/review7.jpeg";
import review8 from "@/assets/reviews/review8.jpeg";
import review9 from "@/assets/reviews/review9.jpg";
import review10 from "@/assets/reviews/review10.jpg";
import review11 from "@/assets/reviews/review11.jpg";

const reviewImages = [
  review1,
  review2,
  review3,
  review4,
  review5,
  review6,
  review7,
  review8,
  review9,
  review10,
  review11,
];

const MobileSnapSlider = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const next = () => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev === null ? null : (prev + 1) % reviewImages.length));
  };
  const prev = () => {
    if (activeIndex === null) return;
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + reviewImages.length) % reviewImages.length
    );
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <div className="w-full">
      <div className="mb-3 text-sm font-semibold">Результаты и отзывы учеников</div>
      <div className="flex gap-3 overflow-x-auto rounded-3xl border border-gray-100 bg-white/80 p-3 shadow-sm ">
        {reviewImages.map((src, idx) => (
          <div key={idx} className="relative">
            {idx === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="absolute h-8 w-8 rounded-full bg-primary/50 animate-ping" />
                <span className="absolute h-6 w-6 rounded-full bg-primary/70" />
              </div>
            )}
            <img
              src={src}
              alt={`Отзыв ${idx + 1}`}
              className="h-24 w-64 min-w-[240px] rounded-2xl object-cover cursor-pointer"
              loading="lazy"
              onClick={() => setActiveIndex(idx)}
            />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gray-800 shadow"
              onClick={close}
            >
              Закрыть
            </button>
            <div className="flex items-center justify-center rounded-2xl bg-black">
              <button
                aria-label="Предыдущий"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white"
                onClick={prev}
              >
                ←
              </button>
              <button
                aria-label="Следующий"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white"
                onClick={next}
              >
                →
              </button>
              <img
                src={reviewImages[activeIndex]}
                alt="Отзыв полноразмерно"
                className="max-h-[85vh] w-full object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white">
              {reviewImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-6 rounded-full ${
                    idx === activeIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSnapSlider;

