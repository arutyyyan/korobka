const Problem = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8 md:p-12 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            ИИ уже меняет рынок
          </h2>

          <p className="text-xl text-center text-muted-foreground mb-8">
            Компании сокращают людей, оставляя только тех, кто умеет использовать ИИ-инструменты.
          </p>

          <div className="space-y-4 mb-8">
            <p className="text-lg">
              Пока ты просто <span className="text-destructive font-semibold">смотришь видео про ИИ</span>, другие:
            </p>
            
            <ul className="space-y-3 pl-6">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Создают сайты за 20 минут вместо недель разработки</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Генерируют месячный контент за один вечер</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Автоматизируют продажи через Telegram-ботов</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Делают видео без камеры и монтажера</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            <p className="text-lg font-semibold">
              Через год ИИ-опыт будет в каждом резюме.
            </p>
            <p className="text-muted-foreground">
              И вопрос будет не <em>«зачем учить ИИ»</em>, а <em className="text-primary">«почему ты до сих пор не умеешь?»</em>
            </p>
          </div>

          <div className="pt-6 border-t border-border/50">
            <p className="text-xl font-semibold text-center">
              <span className="line-through text-muted-foreground">Забудь про курсы, где 40 минут объясняют, что такое нейросеть.</span>
            </p>
            <p className="text-lg text-center mt-4 gradient-text font-semibold">
              В Коробке каждый урок — это практика: я делаю, ты повторяешь, у тебя работает.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
