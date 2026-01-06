# Telegram Integration Setup

## ✅ Deployment Status

- ✅ Database migration applied successfully
- ✅ Edge Functions deployed:
  - `telegram-link` (v1) - Active
  - `telegram-bot` (v1) - Active

## 🔧 Required Environment Variables

You need to set the following secrets for your Edge Functions:

### For `telegram-bot` function:

```bash
supabase secrets set BOT_TOKEN=your_telegram_bot_token --project-ref njnmapywjjgbzhczakib
supabase secrets set BOT_SECRET=your_random_secret_string --project-ref njnmapywjjgbzhczakib
supabase secrets set TELEGRAM_LINK_ENDPOINT=https://njnmapywjjgbzhczakib.supabase.co/functions/v1/telegram-link --project-ref njnmapywjjgbzhczakib
```

### For `telegram-link` function:

The `telegram-link` function automatically has access to:

- `SUPABASE_URL` (auto-provided)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)

You only need to set `BOT_SECRET` (same as above):

```bash
supabase secrets set BOT_SECRET=your_random_secret_string --project-ref njnmapywjjgbzhczakib
```

## 🤖 Setting Up Telegram Bot Webhook

After setting the environment variables, configure your Telegram bot's webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://njnmapywjjgbzhczakib.supabase.co/functions/v1/telegram-bot"
```

Replace `<YOUR_BOT_TOKEN>` with your actual bot token.

## 📝 Important Notes

1. **BOT_TOKEN**: Get this from [@BotFather](https://t.me/BotFather) on Telegram
2. **BOT_SECRET**: Generate a random secure string (e.g., using `openssl rand -hex 32`)
3. **JWT Verification**: The `telegram-bot` function currently has JWT verification enabled. Since it's a webhook endpoint, you may want to disable it in the Supabase dashboard under Edge Functions settings.

## 🔍 Testing

1. Click "Подключить Telegram" in your app
2. The app will open Telegram with the bot
3. Press "Start" in the bot
4. The bot should confirm: "Телеграм успешно привязан ✅"
5. Check your profile - `telegram_user_id` should be populated

## 🐛 Troubleshooting

- Check Edge Function logs in Supabase dashboard
- Verify environment variables are set correctly
- Ensure webhook is configured properly
- Check that RLS policies allow users to create login_links
