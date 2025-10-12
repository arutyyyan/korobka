import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
            <h1 className="text-2xl font-bold">Политика конфиденциальности</h1>
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
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки 
              персональных данных пользователей сервиса «Коробка» (далее — «Сервис»), который предоставляется 
              через Telegram-бота и веб-сайт компанией, зарегистрированной в Республике Казахстан.
            </p>
            <p className="mb-6">
              Используя наш Сервис, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Какие данные мы собираем</h2>
            <h3 className="text-xl font-semibold mb-3">2.1. Персональные данные</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Telegram ID и имя пользователя</li>
              <li>Имя и фамилия (если указаны в профиле Telegram)</li>
              <li>Email-адрес (при регистрации)</li>
              <li>Номер телефона (при необходимости для поддержки)</li>
              <li>Данные платежных карт (обрабатываются платежным провайдером Tribute)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2. Технические данные</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>IP-адрес и данные о местоположении</li>
              <li>Информация о браузере и устройстве</li>
              <li>Данные о посещениях страниц и взаимодействии с контентом</li>
              <li>Данные аналитики (Яндекс.Метрика)</li>
              <li>Логи использования Сервиса</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. Цели обработки данных</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Предоставление доступа к образовательному контенту</li>
              <li>Обработка платежей и управление подписками</li>
              <li>Обеспечение технической поддержки</li>
              <li>Улучшение качества Сервиса</li>
              <li>Соблюдение правовых обязательств</li>
              <li>Предотвращение мошенничества</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Правовые основания обработки</h2>
            <p className="mb-4">
              Обработка персональных данных осуществляется на основании:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Согласие субъекта данных</strong> — для маркетинговых коммуникаций</li>
              <li><strong>Исполнение договора</strong> — для предоставления услуг</li>
              <li><strong>Законные интересы</strong> — для аналитики и улучшения сервиса</li>
              <li><strong>Правовые обязательства</strong> — для соблюдения требований законодательства</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Платежные данные</h2>
            <p className="mb-4">
              Обработка платежных данных осуществляется через платежного провайдера Tribute, 
              который соответствует стандартам PCI DSS. Мы не храним данные платежных карт 
              на наших серверах.
            </p>
            <p className="mb-6">
              Tribute обрабатывает следующие данные: номер карты, срок действия, CVV-код, 
              имя держателя карты, данные биллингового адреса.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Передача данных третьим лицам</h2>
            <p className="mb-4">
              Мы можем передавать ваши данные следующим категориям получателей:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Tribute</strong> — для обработки платежей</li>
              <li><strong>Яндекс.Метрика</strong> — для аналитики (анонимизированные данные)</li>
              <li><strong>Telegram</strong> — для функционирования бота</li>
              <li><strong>Поставщики хостинга</strong> — для технической инфраструктуры</li>
              <li><strong>Государственные органы</strong> — при наличии правовых оснований</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. Сроки хранения данных</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Данные аккаунта:</strong> до удаления аккаунта + 1 год</li>
              <li><strong>Данные платежей:</strong> 5 лет (требование налогового законодательства)</li>
              <li><strong>Логи и аналитика:</strong> 2 года</li>
              <li><strong>Данные поддержки:</strong> 3 года</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">8. Ваши права (GDPR)</h2>
            <p className="mb-4">
              В соответствии с GDPR вы имеете право:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Право доступа</strong> — получить копию ваших данных</li>
              <li><strong>Право на исправление</strong> — исправить неточные данные</li>
              <li><strong>Право на удаление</strong> — удалить ваши данные</li>
              <li><strong>Право на ограничение</strong> — ограничить обработку данных</li>
              <li><strong>Право на портабельность</strong> — получить данные в структурированном формате</li>
              <li><strong>Право на возражение</strong> — возразить против обработки</li>
              <li><strong>Право на отзыв согласия</strong> — в любое время</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">9. Безопасность данных</h2>
            <p className="mb-4">
              Мы применяем следующие меры безопасности:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Шифрование данных при передаче (TLS/SSL)</li>
              <li>Шифрование данных при хранении</li>
              <li>Контроль доступа и аутентификация</li>
              <li>Регулярные аудиты безопасности</li>
              <li>Резервное копирование данных</li>
              <li>Мониторинг безопасности 24/7</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">10. Cookies и аналогичные технологии</h2>
            <p className="mb-4">
              Мы используем cookies и аналогичные технологии для:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Аутентификации пользователей</li>
              <li>Запоминания настроек</li>
              <li>Аналитики использования</li>
              <li>Персонализации контента</li>
            </ul>
            <p className="mb-6">
              Вы можете управлять cookies через настройки браузера.
            </p>

            <h2 className="text-2xl font-bold mb-4">11. Международные передачи</h2>
            <p className="mb-6">
              Некоторые из наших поставщиков услуг могут находиться за пределами Европейской 
              экономической зоны. В таких случаях мы обеспечиваем адекватный уровень защиты 
              данных через стандартные договорные условия или другие механизмы.
            </p>

            <h2 className="text-2xl font-bold mb-4">12. Возрастные ограничения</h2>
            <p className="mb-6">
              Наш Сервис предназначен для лиц старше 16 лет. Мы не собираем намеренно 
              персональные данные детей младше 16 лет. Если мы узнаем, что собрали 
              такие данные, мы немедленно их удалим.
            </p>

            <h2 className="text-2xl font-bold mb-4">13. Изменения в Политике</h2>
            <p className="mb-6">
              Мы можем обновлять настоящую Политику время от времени. О существенных 
              изменениях мы уведомим вас через Telegram или по email. Продолжение 
              использования Сервиса после изменений означает согласие с новой Политикой.
            </p>

            <h2 className="text-2xl font-bold mb-4">14. Контактная информация</h2>
            <p className="mb-4">
              По вопросам обработки персональных данных обращайтесь:
            </p>
            <ul className="list-none mb-6 space-y-2">
              <li><strong>Telegram:</strong> <a href="https://t.me/alish_abd" className="text-primary hover:underline">@alish_abd</a></li>
              <li><strong>Ответственное лицо:</strong> Администрация Коробки</li>
              <li><strong>DPO (если назначен):</strong> Через Telegram</li>
            </ul>

            <div className="bg-muted/50 rounded-lg p-4 mt-8">
              <p className="text-sm text-muted-foreground">
                <strong>Примечание:</strong> Данная Политика конфиденциальности составлена 
                в соответствии с требованиями GDPR, законодательства Республики Казахстан о 
                персональных данных и защите информации, а также лучшими международными практиками 
                защиты данных. Для получения юридической консультации по конкретным вопросам 
                рекомендуется обратиться к квалифицированному юристу Казахстана.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
