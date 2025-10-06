import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBotUrl } from "@/lib/utils";

const Pricing = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Все ИИ-курсы за цену <span className="gradient-text">одного</span>
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Regular Course */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Обычный ИИ-курс</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span>300-500€ за один курс</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span>Устаревает через 2 месяца</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span>Учишь одно направление</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span>Разовая покупка</span>
              </div>
            </CardContent>
          </Card>

          {/* Korobka */}
          <Card className="glass-card border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-sm font-semibold">
              Лучший выбор
            </div>
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Коробка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span className="font-semibold">20€/мес за всё</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span className="font-semibold">Обновляется каждую неделю</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span className="font-semibold">Учишь все ИИ-направления</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <span className="font-semibold">Подписка, можно отменить</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Условия:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Подписку можно отменить в любой момент</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Деньги за текущий месяц не возвращаются</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Доступ сохраняется до конца оплаченного периода</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="hero" 
            className="text-sm sm:text-base md:text-lg px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto"
            onClick={() => window.open(getBotUrl(), '_blank')}
          >
            💡 Начать за 20€/мес
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
