import logoBox from "@/assets/logo-box.png";
import { availableCourses, upcomingCourses } from "@/config/courses";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Info, Gauge, Clock, Wrench, BookOpenText } from "lucide-react";
import { getBotUrl } from "@/lib/utils";

const Courses = () => {
  return (
    <section className="py-8 pb-0 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm backdrop-blur-sm mb-6">
            <img src={logoBox} alt="box" className="w-6 h-6" />
            <span className=" gradient-text font-semibold">Решение</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 max-w-2xl mx-auto">
            Поэтому мы создали Коробку
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Постоянно обновляемые практические курсы по всем нужным нейросетям и
            ИИ-инструментам
          </p>
        </div>

        {/* Available Courses */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Уже доступно</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course, index) => (
              <div
                key={index}
                className="bg-[#fafafa] rounded-3xl overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                {/* Course Cover */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10 relative">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 text-xs text-white bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                    {course.lessons}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1 min-h-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {course.skills.map((skill, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <svg
                            className="w-3 h-3 text-primary flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
                      Результат: {course.result}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Mobile: bottom sheet */}
                      <div className="sm:hidden">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline" className="w-full">
                              Программа
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent className="p-0 overflow-hidden h-[85vh]">
                            <div className="flex h-full flex-col">
                              {/* Header (not scrollable) */}
                              <div className="p-5 pt-0 pb-3 flex items-start justify-between gap-3 border-b border-border/60">
                                <div>
                                  <span className="inline-flex items-center rounded-full bg-muted text-foreground/80 text-[10px] font-semibold px-2 py-0.5">
                                    Программа
                                  </span>
                                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                                    {course.title}
                                  </h3>
                                  {course.result && (
                                    <p className="text-gray-600 text-sm mt-1">
                                      Результат: {course.result}
                                    </p>
                                  )}
                                </div>
                                {course.lessons && (
                                  <span className="shrink-0 inline-flex items-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1">
                                    {course.lessons}
                                  </span>
                                )}
                              </div>
                              {/* Scrollable content */}
                              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                <div className="overflow-hidden rounded-xl ring-1 ring-border">
                                  <img
                                    src={course.cover}
                                    alt={course.title}
                                    className="w-full h-28 object-cover"
                                    loading="eager"
                                  />
                                </div>
                                {course.skills?.length ? (
                                  <div className="flex flex-wrap gap-2">
                                    {course.skills.slice(0, 6).map((s, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                                {/* Structured description block */}
                                {course.subtitle ||
                                course.difficulty ||
                                course.duration ||
                                course.tools?.length ||
                                course.summary ? (
                                  <div className="space-y-3 text-sm text-gray-700">
                                    {course.difficulty && (
                                      <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-primary" />
                                        <div>
                                          Сложность:{" "}
                                          <span className="font-medium">
                                            {course.difficulty}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {course.duration && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <div>
                                          Длительность:{" "}
                                          <span className="font-medium">
                                            {course.duration}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {course.tools?.length ? (
                                      <div className="flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-primary" />
                                        <div>
                                          Инструменты:{" "}
                                          <span className="font-medium">
                                            {course.tools.join(", ")}
                                          </span>
                                        </div>
                                      </div>
                                    ) : null}
                                    {course.summary && (
                                      <p className="leading-relaxed">
                                        {course.summary}
                                      </p>
                                    )}
                                  </div>
                                ) : null}
                                <div className="pt-2">
                                  <h4 className="text-base font-semibold text-gray-900 mb-3">
                                    Программа:
                                  </h4>
                                  <ol className="pl-5 space-y-2 text-base leading-relaxed text-gray-800 list-decimal">
                                    {course.program?.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                              {/* Footer (not scrollable) */}
                              <div className="p-5 pt-3 border-t border-border/60 w-full flex items-center justify-end gap-3">
                                <DrawerClose asChild>
                                  <Button className="w-full" variant="outline">
                                    Закрыть
                                  </Button>
                                </DrawerClose>
                                <Button className="w-full" asChild>
                                  <a href={getBotUrl((course as any).slug)}>
                                    Начать обучаться сейчас
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>

                      {/* Desktop: right sheet */}
                      <div className="hidden sm:block">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                              Программа
                            </Button>
                          </SheetTrigger>
                          <SheetContent
                            side="right"
                            className="p-0 w-full sm:max-w-xl md:max-w-2xl"
                          >
                            <div className="flex h-full flex-col">
                              {/* Header (not scrollable) */}
                              <div className="p-6 md:p-8 pb-4 flex items-start justify-between gap-3 border-b border-border/60">
                                <div>
                                  <span className="inline-flex items-center rounded-full bg-muted text-foreground/80 text-xs font-semibold px-2 py-0.5">
                                    Программа
                                  </span>
                                  <h3 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                                    {course.title}
                                  </h3>
                                  {course.result && (
                                    <p className="text-gray-600 text-sm mt-1">
                                      Результат: {course.result}
                                    </p>
                                  )}
                                </div>
                                {course.lessons && (
                                  <span className="shrink-0 inline-flex items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
                                    {course.lessons}
                                  </span>
                                )}
                              </div>
                              {/* Scrollable content */}
                              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                                <div className="overflow-hidden rounded-2xl ring-1 ring-border">
                                  <img
                                    src={course.cover}
                                    alt={course.title}
                                    className="w-full h-52 md:h-60 object-cover"
                                    loading="eager"
                                  />
                                </div>
                                {course.skills?.length ? (
                                  <div className="flex flex-wrap gap-2">
                                    {course.skills.slice(0, 8).map((s, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                                {course.subtitle ||
                                course.difficulty ||
                                course.duration ||
                                course.tools?.length ||
                                course.summary ? (
                                  <div className="space-y-3 text-sm md:text-base text-gray-700">
                                    {course.difficulty && (
                                      <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-primary" />
                                        <div>
                                          Сложность:{" "}
                                          <span className="font-medium">
                                            {course.difficulty}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {course.duration && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <div>
                                          Длительность:{" "}
                                          <span className="font-medium">
                                            {course.duration}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {course.tools?.length ? (
                                      <div className="flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-primary" />
                                        <div>
                                          Инструменты:{" "}
                                          <span className="font-medium">
                                            {course.tools.join(", ")}
                                          </span>
                                        </div>
                                      </div>
                                    ) : null}
                                    {course.summary && (
                                      <p className="leading-relaxed">
                                        {course.summary}
                                      </p>
                                    )}
                                  </div>
                                ) : null}
                                <div className="pt-2">
                                  <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                                    Программа:
                                  </h4>
                                  <ol className="pl-5 space-y-2 text-base md:text-lg leading-relaxed text-gray-800 list-decimal">
                                    {course.program?.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                              {/* Footer (not scrollable) */}
                              <div className="p-6 md:p-8 pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                                <SheetClose asChild>
                                  <Button variant="outline">Закрыть</Button>
                                </SheetClose>
                                <Button asChild>
                                  <a href={getBotUrl((course as any).slug)}>
                                    Начать ИИ-обучение
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={getBotUrl((course as any).slug)}>
                          Начать обучение
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              В ближайшие недели
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingCourses.map((course, index) => (
              <div
                key={index}
                className="bg-[#fafafa] rounded-3xl overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                {/* Course Cover */}
                <div className="h-32 bg-gradient-to-br from-gray-300/20 to-gray-300/10 relative">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale"
                  />
                  {(course as any).lessons && (
                    <div className="absolute top-3 right-3 text-xs text-white bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      {(course as any).lessons}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 text-xs text-white bg-primary px-2 py-1 rounded-full">
                    Скоро
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1 min-h-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {course.skills.map((skill, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <svg
                            className="w-3 h-3 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-600">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-4">
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      Результат: {course.result}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full" disabled>
                        Программа
                      </Button>
                      <Button className="w-full" disabled>
                        Начать обучение
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
