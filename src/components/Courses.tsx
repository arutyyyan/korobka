import logoBox from "@/assets/logo-box.png";

const availableCourses = [
  {
    title: "Align Code",
    description: "Вы научитесь:",
    lessons: "84 урока",
    result: "Сможете брать заказы на сложную разработку сайтов и ботов",
    cover: "/align_cover.jpg",
    skills: [
      
      "Создавать лендинги за 2-3 часа",
      "Делать Telegram-ботов для бизнеса", 
      "Автоматизировать процессы клиентов",
      "Строить ИИ-сервисы, SaaS-продукты",
      "Понимать код",
    ]
  },
  {
    title: "ChatGPT. Beginner",
    description: "Вы научитесь:",
    lessons: "12 уроков",
    result: "Сможете использовать ChatGPT для заработка",
    cover: "/gpt_cover.jpg",
    skills: [
      "Писать эффективные промпты",
      "Создавать изображения",
      "Анализировать файлы",
      "Создавать мини-сайты"
    ]
  },
  {
    title: "Lovable",
    description: "Вы научитесь без кода:",
    lessons: "14 уроков", 
    result: "Сможете брать заказы на разработку сайтов",
    cover: "/lovable_cover.jpg",
    skills: [
      
      "Делать интерактивные прототипы",
      "Строить онлайн-магазины",
      "Строить ИИ-сервисы",
      "Вайб-кодить"
    ]
  },
  {
    title: "Sora",
    description: "Вы научитесь:",
    lessons: "4 урока",
    result: "Видео без камеры",
    cover: "/sora_cover.jpg",
    skills: [
      "Создавать ИИ-аватары",
      "Генерировать видео из текста",
      "Делать контент для соцсетей",
      "Экономить на видеографах"
    ]
  }
];

const upcomingCourses = [
  
  {
    title: "Make",
    description: "ИИ-автоматизация бизнес-процессов",
    // lessons: "8 уроков",
    result: "Экономия 10+ часов/неделю",
    cover: "/make_cover.jpg",
    skills: [
      "Настраивать автопроцессы",
      "Интегрировать сервисы",
      "Создавать сложных ботов",
      "Автоматизировать любые процессы"
    ]
  },
  {
    title: "ИИ-аватары",
    description: "Вы научитесь:",
    // lessons: "8 уроков",
    result: "Замените живую съемку на аватаров",
    cover: "/avatar.webp",
    skills: [
      "Создавать ИИ-аватаров",
      "Интегрировать Eleven Labs",
      "Работать с Heygen",
    ]
  },

  {
    title: "Контент-завод",
    description: "Вы научитесь:",
    // lessons: "6 уроков",
    result: "Полностью автоматизируйте ведение контента",
    cover: "/zavod.webp",
    skills: [
      "Создавать контент с ИИ",
      "Подключать ИИ-аватаров",
      "Монтировать видео автоматически",
      "Настраивать автопубликацию",
    ]
  }
];

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
            Постоянно обновляемые практические курсы по всем нужным нейросетям и ИИ-инструментам
          </p>
        </div>

        {/* Available Courses */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Уже доступно</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course, index) => (
              <div key={index} className="bg-[#fafafa] rounded-3xl overflow-hidden border border-gray-200 flex flex-col h-full">
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
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {course.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <svg className="w-3 h-3 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-4 pt-4 border-t border-gray-200">
                    
                    Результат: {course.result}
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
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">В ближайшие недели</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingCourses.map((course, index) => (
              <div key={index} className="bg-[#fafafa] rounded-3xl overflow-hidden border border-gray-200 flex flex-col h-full">
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
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {course.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mt-4 pt-4 border-t border-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Результат: {course.result}
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
