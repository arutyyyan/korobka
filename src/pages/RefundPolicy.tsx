import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Политика возврата средств</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="bg-card rounded-lg p-8 shadow-sm border border-border/30">
            <p className="text-sm text-muted-foreground mb-6">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Гарантия возврата 14 дней
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Мы уверены в качестве нашего контента и предлагаем полный возврат средств 
                в течение 14 дней с момента покупки, если вы не удовлетворены подпиской.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4">1. Общие принципы возврата</h2>
            <p className="mb-4">
              Настоящая Политика возврата средств определяет условия и порядок возврата 
              денежных средств за подписку на сервис «Коробка» — компанию, зарегистрированную 
              в Республике Казахстан. Мы стремимся к честному и прозрачному взаимодействию 
              с нашими пользователями.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Условия возврата</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              В соответствии с Законом Республики Казахстан «О защите прав потребителей» 
              и международными стандартами защиты прав потребителей.
            </p>
            <h3 className="text-xl font-semibold mb-3">2.1. Сроки возврата</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Основной срок:</strong> 14 дней с момента оплаты</li>
              <li><strong>Для новых пользователей:</strong> 14 дней без ограничений</li>
              <li><strong>Для повторных подписок:</strong> 7 дней</li>
              <li><strong>Технические проблемы:</strong> без ограничений по времени</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2. Основания для возврата</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Неудовлетворенность контентом</strong> — если курсы не соответствуют ожиданиям</li>
              <li><strong>Технические проблемы</strong> — невозможность доступа к материалам</li>
              <li><strong>Ошибка при оплате</strong> — случайное списание или двойная оплата</li>
              <li><strong>Некачественный контент</strong> — технические дефекты видео или материалов</li>
              <li><strong>Нарушение наших обязательств</strong> — невыполнение обещаний по контенту</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. Ограничения возврата</h2>
            <h3 className="text-xl font-semibold mb-3">3.1. Когда возврат не производится</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Пользователь просмотрел более 20% контента из всех курсов</li>
              <li>Прошло более 14 дней с момента оплаты</li>
              <li>Нарушение условий использования (попытки копирования, перепродажи)</li>
              <li>Многократные возвраты одним пользователем (более 3 раз)</li>
              <li>Подозрение в мошенничестве или злоупотреблении системой</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2. Специальные случаи</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              
              <li><strong>Подарочные подписки:</strong> возврат невозможен, средства возвращаются дарителю</li>
              <li><strong>Корпоративные подписки:</strong> особые условия по договору</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Процедура возврата</h2>
            <h3 className="text-xl font-semibold mb-3">4.1. Как подать заявку на возврат</h3>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Напишите в Telegram: <a href="https://t.me/alish_abd" className="text-primary hover:underline">@alish_abd</a></li>
              <li>Укажите причину возврата</li>
              <li>Предоставьте данные платежа (дата, сумма, способ оплаты)</li>
              <li>Ожидайте рассмотрения заявки (до 24 часов)</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">4.2. Документы для возврата</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Скриншот чека об оплате</li>
              <li>Данные карты (последние 4 цифры)</li>
              <li>Описание проблемы (если есть технические вопросы)</li>
              <li>Telegram ID для идентификации</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Обработка возврата</h2>
            <h3 className="text-xl font-semibold mb-3">5.1. Сроки обработки</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Рассмотрение заявки:</strong> до 24 часов</li>
              <li><strong>Обработка возврата:</strong> 3-5 рабочих дней</li>
              <li><strong>Поступление средств:</strong> 5-10 рабочих дней</li>
              <li><strong>Уведомление:</strong> сразу после обработки</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.2. Способы возврата</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>На карту:</strong> возврат на ту же карту, с которой была оплата</li>
              <li><strong>Через Tribute:</strong> автоматический возврат через платежную систему</li>
              <li><strong>Электронные кошельки:</strong> по согласованию</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">6. Частичный возврат</h2>
            <h3 className="text-xl font-semibold mb-3">6.1. Условия частичного возврата</h3>
            <p className="mb-4">
              В некоторых случаях возможен частичный возврат:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Пользователь использовал менее 50% контента</li>
              <li>Технические проблемы с частью материалов</li>
              <li>Несоответствие части контента описанию</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.2. Расчет суммы возврата</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Полный возврат — если использовано менее 20% контента</li>
              <li>50% возврата — если использовано 20-50% контента</li>
              <li>Пропорциональный возврат — в зависимости от использованного времени</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. Отмена подписки</h2>
            <h3 className="text-xl font-semibold mb-3">7.1. Как отменить подписку</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Через Telegram-бота: команда /cancel</li>
              <li>Написать в поддержку с просьбой об отмене</li>
              <li>Отмена через Tribute (если доступно)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">7.2. Последствия отмены</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Доступ сохраняется до окончания оплаченного периода</li>
              <li>Автопродление отключается</li>
              <li>Возможность повторной подписки в любое время</li>
              <li>Данные аккаунта сохраняются</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">8. Технические проблемы</h2>
            <h3 className="text-xl font-semibold mb-3">8.1. Проблемы с доступом</h3>
            <p className="mb-4">
              Если у вас возникли технические проблемы:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Сначала обратитесь в техническую поддержку</li>
              <li>Мы постараемся решить проблему в течение 24 часов</li>
              <li>Если проблема не решается — возврат средств гарантирован</li>
              <li>Дополнительная компенсация за неудобства</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">8.2. Проблемы с платежами</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Двойное списание — немедленный возврат</li>
              <li>Ошибка суммы — корректировка в течение часа</li>
              <li>Проблемы Tribute — работаем с платежной системой</li>
              <li>Неверная карта — возврат после проверки</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">9. Спорные ситуации</h2>
            <h3 className="text-xl font-semibold mb-3">9.1. Разрешение споров</h3>
            <p className="mb-4">
              При возникновении спорных ситуаций:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Обратитесь к менеджеру поддержки</li>
              <li>Предоставьте все необходимые документы</li>
              <li>Мы рассмотрим ситуацию индивидуально</li>
              <li>При необходимости привлечем независимого арбитра</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">9.2. Апелляция</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Если вы не согласны с решением — можете подать апелляцию</li>
              <li>Апелляция рассматривается в течение 48 часов</li>
              <li>Решение апелляции является окончательным</li>
              <li>При необходимости — обращение в суд</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">10. Особые случаи</h2>
            <h3 className="text-xl font-semibold mb-3">10.1. Форс-мажорные обстоятельства</h3>
            <p className="mb-4">
              В случае форс-мажорных обстоятельств:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Сбои в работе интернета — продление доступа</li>
              <li>Технические проблемы сервера — компенсация времени</li>
              <li>Блокировка Telegram — альтернативные способы доступа</li>
              <li>Изменения в законодательстве — адаптация условий</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">10.2. Медицинские и личные обстоятельства</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Серьезные заболевания — заморозка подписки</li>
              <li>Семейные обстоятельства — индивидуальное рассмотрение</li>
              <li>Финансовые трудности — рассрочка или заморозка</li>
              <li>Смерть пользователя — возврат по заявлению наследников</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">11. Контактная информация</h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                📞 Свяжитесь с нами для возврата
              </h3>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li><strong>Telegram:</strong> <a href="https://t.me/alish_abd" className="text-primary hover:underline">@alish_abd</a></li>
                <li><strong>Время работы поддержки:</strong> 24/7</li>
                <li><strong>Время ответа:</strong> до 24 часов</li>
                <li><strong>Срочные вопросы:</strong> отмечайте сообщение как "СРОЧНО"</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mb-4">12. Изменения в Политике</h2>
            <p className="mb-6">
              Мы можем обновлять настоящую Политику возврата. О существенных изменениях 
              уведомим за 30 дней. Изменения не затрагивают уже заключенные договоры.
            </p>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
