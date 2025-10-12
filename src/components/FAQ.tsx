import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Что такое Коробка?",
    answer: "Telegram-подписка на все ИИ-курсы. Платишь раз в месяц — получаешь доступ ко всем текущим и будущим материалам."
  },
  {
    question: "Сколько стоит?",
    answer: "20€/мес. Можешь отменить в любой момент."
  },
  {
    question: "Как работает отмена?",
    answer: "Отменяешь в личном кабинете Tribute. Деньги за текущий месяц не возвращаются, но новые списания не идут. Доступ работает до конца оплаченного периода."
  },
  {
    question: "Я новичок. Мне подойдёт?",
    answer: "Да. Все уроки пошаговые, без технических терминов. Начнёшь с основ ИИ и дойдёшь до продвинутых техник."
  },
  {
    question: "Как часто добавляются курсы?",
    answer: "Каждую неделю. Следим за новыми инструментами и сразу делаем по ним материалы."
  },
  {
    question: "Где смотреть курсы?",
    answer: "В закрытой Telegram-группе. После оплаты получишь ссылку на вступление."
  },
  {
    question: "Какие темы уже доступны?",
    answer: "Align Code (84 урока), Lovable (14 уроков), Sora (4 урока)."
  },
  {
    question: "Это разовая оплата или подписка?",
    answer: "Ежемесячная подписка. Но можно отменить в любой момент без объяснений."
  },
  {
    question: "Будет ли поддержка?",
    answer: "Да, есть чат для вопросов. Отвечаем в течение 24 часов."
  }
];

const FAQ = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Часто задаваемые <span className="gradient-text">вопросы</span>
          </h2>
        </div>

        <div className="glass-card rounded-2xl px-6 py-2 ">
          <Accordion type="single" collapsible className="space-y-4 shadow-none">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className={`border-b border-gray-200 ${index === faqItems.length - 1 ? 'border-b-0' : ''}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
