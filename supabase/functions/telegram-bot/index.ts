import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
const TELEGRAM_LINK_ENDPOINT =
  Deno.env.get("TELEGRAM_LINK_ENDPOINT") ||
  `${Deno.env.get("SUPABASE_URL")}/functions/v1/telegram-link`;
const TRIBUTE_LINK =
  Deno.env.get("TRIBUTE_LINK") || "https://t.me/tribute/app?startapp=sC9M";
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "https://korobka.ru";
const BOT_SECRET = Deno.env.get("BOT_SECRET") || "";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const update = await req.json();
    const message = update.message;

    if (!message || !message.text) {
      return new Response("OK");
    }

    const chatId = message.chat.id;
    const telegramUserId = message.from.id;
    const text: string = message.text;
    const messageId = message.message_id; // ✅ Save message ID to delete later

    // /start <token>
    const parts = text.split(" ");
    const command = parts[0];
    const token = parts.slice(1).join(" ") || null;

    if (command === "/start" && token) {
      // Send loading message and save its ID
      const loadingMessageId = await sendMessage(chatId, "Привязываем ваш аккаунт, подождите…");
      
      // Send token + telegram_user_id to the telegram-link function
      const response = await fetch(TELEGRAM_LINK_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bot-secret": BOT_SECRET,
        },
        body: JSON.stringify({ token, telegram_user_id: telegramUserId }),
      });

      const result = await response.json();

      // Delete loading message first
      if (loadingMessageId) {
        await deleteMessage(chatId, loadingMessageId);
      }

      if (response.ok && result.success) {
        await sendMessage(chatId, "Телеграм успешно привязан ✅");
        await sendMessage(
          chatId,
          `Оформите подписку по ссылке, чтобы открыть доступ ко всем курсам:\n\n${TRIBUTE_LINK}`
        );
      } else if (result.error === "TELEGRAM_ALREADY_LINKED") {
        await sendMessage(
          chatId,
          result.message ||
            "Этот Telegram уже привязан к другому аккаунту на платформе. Если это ошибка — напишите в поддержку."
        );
      } else {
        await sendMessage(
          chatId,
          "Ошибка при привязке аккаунта. Попробуйте снова."
        );
      }
    } else if (command === "/start") {
      await sendMessage(
        chatId,
        "Откройте бота из ссылки на сайте, чтобы привязать аккаунт."
      );
    }

    return new Response("OK");
  } catch (error) {
    console.error("Error processing Telegram update:", error);
    return new Response("Error processing request", { status: 500 });
  }
});

// ✅ Updated sendMessage - RETURNS message ID
async function sendMessage(chatId: number, text: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (response.ok) {
      const result = await response.json();
      return result.result.message_id; // ✅ Return message ID
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
  return null;
}

// ✅ New function to delete messages
async function deleteMessage(chatId: number, messageId: number): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}
