const WhyItWorks = () => {
  const reasons = [
    "Без воды, только практика.",
    "Уроки по 5–10 минут — смотри хоть в очереди.",
    "Telegram-формат — удобно с телефона.",
    "Новые курсы каждую неделю.",
    "Стоимость — меньше, чем тратишь на кофе за месяц."
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Почему это <span className="gradient-text">работает</span>
          </h2>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="space-y-6">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span className="text-primary text-2xl font-bold">{index + 1}.</span>
                <p className="text-lg pt-1">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItWorks;
