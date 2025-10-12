import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
            <h1 className="text-2xl font-bold">Условия использования</h1>
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

            <h2 className="text-2xl font-bold mb-4">1. Общие положения</h2>
            <p className="mb-4">
              Настоящие Условия использования (далее — «Условия») регулируют отношения между 
              пользователями (далее — «Пользователь») и сервисом «Коробка» (далее — «Сервис», 
              «Мы») — компанией, зарегистрированной в Республике Казахстан, при использовании 
              образовательной платформы, предоставляемой через Telegram-бота и веб-сайт.
            </p>
            <p className="mb-6">
              Используя наш Сервис, вы соглашаетесь с настоящими Условиями. Если вы не согласны 
              с какими-либо условиями, пожалуйста, не используйте наш Сервис.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Описание Сервиса</h2>
            <p className="mb-4">
              «Коробка» — это образовательная платформа, предоставляющая:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Онлайн-курсы по искусственному интеллекту</li>
              <li>Практические уроки по работе с AI-инструментами</li>
              <li>Доступ к эксклюзивному контенту</li>
              <li>Сообщество единомышленников</li>
              <li>Техническую поддержку</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. Регистрация и аккаунт</h2>
            <h3 className="text-xl font-semibold mb-3">3.1. Требования к регистрации</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Минимальный возраст: 16 лет</li>
              <li>Действующий аккаунт Telegram</li>
              <li>Корректные персональные данные</li>
              <li>Согласие с настоящими Условиями</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2. Обязанности пользователя</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Предоставлять точную и актуальную информацию</li>
              <li>Не передавать доступ к аккаунту третьим лицам</li>
              <li>Не создавать множественные аккаунты</li>
              <li>Соблюдать правила использования Сервиса</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Подписка и оплата</h2>
            <h3 className="text-xl font-semibold mb-3">4.1. Модель подписки</h3>
            <p className="mb-4">
              Сервис работает по модели ежемесячной подписки:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Стоимость:</strong> 20€ в месяц</li>
              <li><strong>Период подписки:</strong> 30 дней с момента оплаты</li>
              <li><strong>Автопродление:</strong> Подписка автоматически продлевается</li>
              <li><strong>Отмена:</strong> Возможна в любое время</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2. Скидки и промокоды</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Скидки действуют <strong>только на первый месяц</strong> подписки</li>
              <li>Промокоды не суммируются</li>
              <li>Скидки не применяются к продлению подписки</li>
              <li>Мы оставляем за собой право отозвать скидку в случае злоупотреблений</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.3. Платежная система Tribute</h3>
            <p className="mb-4">
              Оплата осуществляется через платежного провайдера Tribute:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Принимаются карты Visa, MasterCard, МИР</li>
              <li>Безопасная обработка платежей (PCI DSS)</li>
              <li>Мгновенная активация доступа после оплаты</li>
              <li>Автоматическое списание при продлении</li>
              <li>Уведомления о платежах в Telegram</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Доступ к контенту</h2>
            <h3 className="text-xl font-semibold mb-3">5.1. Права доступа</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Доступ ко всем курсам в рамках активной подписки</li>
              <li>Возможность скачивания материалов для личного использования</li>
              <li>Участие в сообществе и чатах поддержки</li>
              <li>Доступ к новому контенту по мере добавления</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.2. Ограничения</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Запрещена перепродажа или распространение контента</li>
              <li>Запрещено создание копий курсов</li>
              <li>Контент предназначен только для личного обучения</li>
              <li>Запрещено использование в коммерческих целях без разрешения</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">6. Отмена и возврат средств</h2>
            <h3 className="text-xl font-semibold mb-3">6.1. Отмена подписки</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Отмена возможна в любое время через Telegram-бота</li>
              <li>Доступ сохраняется до окончания оплаченного периода</li>
              <li>Автопродление отключается при отмене</li>
              <li>Возможность повторной подписки в любое время</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.2. Возврат средств</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Возврат возможен в течение 14 дней с момента оплаты</li>
              <li>Возврат не производится, если пользователь использовал более 20% контента</li>
              <li>Технические проблемы — основание для полного возврата</li>
              <li>Обработка возврата через Tribute в течение 5-10 рабочих дней</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. Интеллектуальная собственность</h2>
            <p className="mb-4">
              Все материалы, размещенные на Сервисе, включая:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Видеоуроки и лекции</li>
              <li>Текстовые материалы и инструкции</li>
              <li>Дизайн и интерфейс Сервиса</li>
              <li>Логотипы и торговые марки</li>
            </ul>
            <p className="mb-6">
              Являются интеллектуальной собственностью «Коробки» и защищены авторским правом.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Запрещенное использование</h2>
            <p className="mb-4">
              Запрещается использовать Сервис для:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Нарушения законодательства</li>
              <li>Распространения вредоносного ПО</li>
              <li>Спама или нежелательных сообщений</li>
              <li>Нарушения прав других пользователей</li>
              <li>Попыток взлома или нарушения безопасности</li>
              <li>Коммерческого использования контента без разрешения</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">9. Техническая поддержка</h2>
            <p className="mb-4">
              Мы предоставляем техническую поддержку:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Через Telegram: <a href="https://t.me/alish_abd" className="text-primary hover:underline">@alish_abd</a></li>
              <li>Время ответа: до 24 часов в рабочие дни</li>
              <li>Помощь с техническими вопросами</li>
              <li>Консультации по использованию инструментов</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">10. Ответственность и ограничения</h2>
            <h3 className="text-xl font-semibold mb-3">10.1. Ограничение ответственности</h3>
            <p className="mb-4">
              Мы не несем ответственности за:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Результаты применения полученных знаний</li>
              <li>Потери, связанные с использованием AI-инструментов</li>
              <li>Технические сбои третьих сторон (Tribute, Telegram)</li>
              <li>Косвенные убытки или упущенную выгоду</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">10.2. Гарантии</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Сервис предоставляется «как есть»</li>
              <li>Мы стремимся обеспечить стабильную работу</li>
              <li>Не гарантируем 100% доступность</li>
              <li>Оставляем за собой право изменять функционал</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">11. Приостановка и прекращение</h2>
            <p className="mb-4">
              Мы оставляем за собой право:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Приостановить доступ при нарушении Условий</li>
              <li>Заблокировать аккаунт без возврата средств</li>
              <li>Прекратить предоставление Сервиса с уведомлением за 30 дней</li>
              <li>Удалить неактивные аккаунты (более 12 месяцев)</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">12. Изменения Условий</h2>
            <p className="mb-6">
              Мы можем изменять настоящие Условия. О существенных изменениях уведомим 
              за 30 дней через Telegram или email. Продолжение использования Сервиса 
              означает согласие с новыми Условиями.
            </p>

            <h2 className="text-2xl font-bold mb-4">13. Применимое право</h2>
            <p className="mb-6">
              Настоящие Условия регулируются законодательством Республики Казахстан. 
              Все споры подлежат рассмотрению в суде по месту регистрации исполнителя в Казахстане.
            </p>

            <h2 className="text-2xl font-bold mb-4">14. Контактная информация</h2>
            <p className="mb-4">
              По всем вопросам обращайтесь:
            </p>
            <ul className="list-none mb-6 space-y-2">
              <li><strong>Telegram:</strong> <a href="https://t.me/alish_abd" className="text-primary hover:underline">@alish_abd</a></li>
              <li><strong>Поддержка:</strong> Круглосуточно через Telegram</li>
              <li><strong>Юридические вопросы:</strong> Через Telegram с пометкой "Юридический отдел"</li>
            </ul>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
