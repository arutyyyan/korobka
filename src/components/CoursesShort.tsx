import { Button } from "@/components/ui/button";
import logoBox from "@/assets/logo-box.png";
import { availableCourses, upcomingCourses } from "@/config/courses";
import { getBotUrl } from "@/lib/utils";

const CoursesShort = () => {
  const handlePrimary = () => window.open(getBotUrl(), "_blank");
  const courses = availableCourses;
  const grouped = courses.reduce<{ topic: string; items: typeof courses }[]>((acc, course) => {
    const topic = course.topic || "Другое";
    const existing = acc.find((g) => g.topic === topic);
    if (existing) {
      existing.items.push(course);
    } else {
      acc.push({ topic, items: [course] });
    }
    return acc;
  }, []);

  const topicOrder = ["ChatGPT", "ИИ-автоматизация", "Вайб-кодинг", "Видео", "Строим стартап", "Другое"];
  const sortedGrouped = grouped.sort((a, b) => {
    const ai = topicOrder.indexOf(a.topic);
    const bi = topicOrder.indexOf(b.topic);
    const aIdx = ai === -1 ? topicOrder.length : ai;
    const bIdx = bi === -1 ? topicOrder.length : bi;
    return aIdx - bIdx;
  });

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm backdrop-blur-sm mb-6">
            <img src={logoBox} alt="box" className="w-6 h-6" />
            <span className=" font-semibold">Коробка</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 max-w-2xl mx-auto">
            Курсы внутри подписки
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Основные направления, которые открываются сразу после оплаты.
          </p>
        </div>

        {/* Available Courses grouped by topic */}
        <div className="space-y-10">
          {sortedGrouped.map(({ topic, items }) => (
            <div key={topic} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  {topic}
                </div>
                <span className="text-sm text-gray-500">{items.length} курс(а)</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((course, index) => (
                  <div
                    key={course.slug || `${topic}-${index}`}
                    className="bg-[#fafafa] rounded-3xl overflow-hidden border border-gray-200 flex flex-col h-full"
                  >
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10 relative">
                      <img
                        src={course.cover}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.lessons && (
                        <div className="absolute top-3 right-3 text-xs text-white bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                          {course.lessons}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1 min-h-0 space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                        <p className="text-gray-600 text-sm">{course.result}</p>
                        <div className="space-y-1">
                          {course.skills.slice(0, 4).map((skill, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full" onClick={handlePrimary}>
                          Перейти в Коробку
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Courses */}
        {upcomingCourses?.length ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                ⏳
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Скоро добавим</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl overflow-hidden border border-dashed border-gray-200 flex flex-col h-full"
                >
                  <div className="h-28 bg-gray-100 relative">
                    <img
                      src={course.cover}
                      alt={course.title}
                      className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute top-3 left-3 text-xs text-white bg-gray-700/80 px-2 py-1 rounded-full">
                      Скоро
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{course.result}</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      {course.skills.slice(0, 3).map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CoursesShort;

