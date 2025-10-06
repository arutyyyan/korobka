import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const activeCourses = [
  {
    emoji: "⚡️",
    title: "Align Code",
    subtitle: "Сайты и боты без программирования",
    lessons: "84 урока",
    description: "Научишься создавать:",
    points: [
      "Лендинги для продажи услуг",
      "Telegram-ботов для автоматизации",
      "ИИ-сервисы для клиентов"
    ],
    result: "сможешь брать заказы на разработку по 200-500€"
  },
  {
    emoji: "❤️",
    title: "Lovable",
    subtitle: "Вайб-кодинг для красивых проектов",
    lessons: "14 уроков",
    description: "Создавай интерфейсы, которые продают:",
    points: [
      "Дашборды для стартапов",
      "Портфолио и интерактивные сайты",
      "MVP для тестирования идей"
    ],
    result: "портфолио проектов для фриланса"
  },
  {
    emoji: "🥺",
    title: "Sora",
    subtitle: "ИИ-видео и аватары",
    lessons: "4 урока",
    description: "Делай видео без камеры:",
    points: [
      "ИИ-аватары для курсов",
      "Генерация видео из текста",
      "Контент для соцсетей"
    ],
    result: "видео-контент, который раньше стоил 500€/видео"
  }
];

const upcomingCourses = [
  "🌐 Основы ИИ — ChatGPT, prompting, Claude, Gemini, Perplexity для работы",
  "⚙️ ИИ-автоматизация Make — автопроцессы для бизнеса (лидогенерация, email-рассылки)",
  "💬 ИИ-мессенджеры — WhatsApp и Telegram-боты с OpenAI для продаж",
  "🧠 Цифровые двойники — ИИ-аватары для видео и презентаций",
  "🎬 ИИ-видео и фото — Runway, Pika, Flux, Midjourney, Sora для контента",
  "🏭 Контент-завод — автоматизация Reels, постов, креативов",
  "💻 Вайб-кодинг — Lovable, Bolt, Framer для UI/UX-проектов"
];

const Courses = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            📦 Что внутри <span className="gradient-text">Коробки</span>
          </h2>
        </div>

        {/* Active Courses */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Уже доступно:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course, index) => (
              <Card key={index} className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-2">{course.emoji}</div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.subtitle}</CardDescription>
                  <div className="text-sm font-semibold text-primary pt-2">{course.lessons}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-semibold">{course.description}</p>
                  <ul className="space-y-2">
                    {course.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-border/30">
                    <p className="text-sm font-semibold">
                      <span className="gradient-text">Результат:</span> {course.result}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-6">🔜 В разработке (выходят каждую неделю):</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {upcomingCourses.map((course, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span>{course}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border/50 pt-8 space-y-4">
            <p className="text-xl font-bold text-center gradient-text">
              → Покупаешь один раз. Получаешь доступ ко всем текущим и будущим курсам.
            </p>
            <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
              <p>• Новые курсы добавляются каждую неделю.</p>
              <p>• Всё доступно прямо в Telegram, без сайтов и паролей.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
