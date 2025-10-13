import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import r1 from "@/assets/reviews/review1.jpeg";
import r2 from "@/assets/reviews/review2.jpeg";
import r3 from "@/assets/reviews/review3.jpeg";
import r4 from "@/assets/reviews/review4.jpeg";
import r5 from "@/assets/reviews/review5.jpeg";
import r6 from "@/assets/reviews/review6.jpeg";
import r7 from "@/assets/reviews/review7.jpeg";
import r8 from "@/assets/reviews/review8.jpeg";

const reviewImages = [r1, r2, r3, r4, r5, r6, r7, r8];

const Reviews = () => {
  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 md:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm backdrop-blur-sm mb-4">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.76 8.76 0 01-3.78-.84L2 17l.967-3.63A6.854 6.854 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zm-9-3a1 1 0 100 2 1 1 0 000-2zm1 8a5 5 0 005-5h-2a3 3 0 01-3 3v2z" clipRule="evenodd" />
            </svg>
            <span className="gradient-text font-semibold">Отзывы учеников</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3">Настоящие результаты</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">Скриншоты отзывов и историй наших студентов</p>
        </div>

        {/* Mobile: variable-height carousel; Desktop: masonry columns grid */}
        <div className="md:hidden">
          {/* Custom scroll-snap slider with dynamic height */}
          <MobileSnapSlider images={reviewImages} />
        </div>

        <div className="hidden md:block">
          {/* Masonry via CSS columns; prevent breaks inside items */}
          <div className="columns-2 lg:columns-3 gap-4 [column-fill:_balance]"><div className="hidden" />
            {reviewImages.map((src, idx) => (
              <div key={idx} className="mb-4 break-inside-avoid">
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                  <img src={src} alt={`Отзыв ${idx + 1}`} loading="lazy" className="w-full h-auto object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

type MobileSnapSliderProps = { images: string[] };

const MobileSnapSlider = ({ images }: MobileSnapSliderProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const { scrollLeft, clientWidth } = scroller;
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentIndex(Math.max(0, Math.min(images.length - 1, index)));
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll as EventListener);
  }, [images.length]);

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const x = index * scroller.clientWidth;
    scroller.scrollTo({ left: x, behavior: "smooth" });
  };

  const normalizeIndex = (index: number) => {
    const total = images.length;
    return ((index % total) + total) % total;
  };

  // Keep container height in sync with the currently visible slide
  useEffect(() => {
    const el = slideRefs.current[currentIndex];
    if (!el) return;

    const update = () => setContainerHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    const onResize = () => update();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [currentIndex]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={() => scrollToIndex(normalizeIndex(currentIndex - 1))} aria-label="Предыдущий">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          {images.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-5 bg-primary" : "w-2 bg-muted-foreground/30"}`} />)
          )}
        </div>
        <Button variant="outline" size="icon" onClick={() => scrollToIndex(normalizeIndex(currentIndex + 1))} aria-label="Следующий">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div ref={scrollerRef} className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth -mx-2 transition-[height] duration-200" style={containerHeight ? { height: containerHeight } : undefined}>
        {images.map((src, idx) => (
          <div key={idx} className="basis-full shrink-0 snap-center px-2">
            <div ref={(el) => (slideRefs.current[idx] = el)} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <img src={src} alt={`Отзыв ${idx + 1}`} loading="lazy" className="block w-full h-auto object-contain" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


