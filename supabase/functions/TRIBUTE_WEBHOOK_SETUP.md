# Tribute Webhook Setup

## ✅ Deployment Status

- ✅ Subscriptions table created
- ✅ Tribute webhook Edge Function deployed (`tribute-webhook` v1 - Active)

## 📋 Overview

The `tribute-webhook` function handles subscription events from Tribute payment system:
- `new_subscription` - Creates/updates subscription as active
- `cancelled_subscription` - Updates subscription status to cancelled (but keeps access until expires_at)

## 🔧 Configuration

### Webhook URL

Point your Tribute webhook to:
```
https://njnmapywjjgbzhczakib.supabase.co/functions/v1/tribute-webhook
```

### Webhook Payload Format

Tribute should send POST requests with the following structure:

```json
{
  "name": "new_subscription" | "cancelled_subscription",
  "payload": {
    "telegram_user_id": "123456789",
    "subscription_id": 12345,
    "expires_at": "2024-12-31T23:59:59Z",
    "subscription_name": "Pro Monthly",
    "period": "monthly",
    "currency": "USD",
    "amount": 999
  }
}
```

### Security (Optional)

To add webhook secret verification, uncomment and configure in the Edge Function:

```typescript
const webhookSecret = req.headers.get("x-webhook-secret");
if (webhookSecret !== Deno.env.get("TRIBUTE_WEBHOOK_SECRET")) {
  return new Response("Unauthorized", { status: 401 });
}
```

Then set the secret:
```bash
supabase secrets set TRIBUTE_WEBHOOK_SECRET=your_secret_here --project-ref njnmapywjjgbzhczakib
```

## 📊 Database Schema

The `subscriptions` table stores:
- One row per user (enforced by UNIQUE(user_id))
- Subscription status: `active` or `cancelled`
- `access_until`: Date when access expires
- Full subscription details (plan, period, currency, amount)

## 🔍 Access Logic

Pro access is calculated on-the-fly using `checkIsPro()`:

- **Active subscription**: User has pro access
- **Cancelled subscription**: User has pro access if `access_until` is in the future
- **No subscription or expired**: User is free tier

## 🧪 Testing

### Test New Subscription

```bash
curl -X POST https://njnmapywjjgbzhczakib.supabase.co/functions/v1/tribute-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "new_subscription",
    "payload": {
      "telegram_user_id": "123456789",
      "subscription_id": 12345,
      "expires_at": "2025-12-31T23:59:59Z",
      "subscription_name": "Pro Monthly",
      "period": "monthly",
      "currency": "USD",
      "amount": 999
    }
  }'
```

### Test Cancelled Subscription

```bash
curl -X POST https://njnmapywjjgbzhczakib.supabase.co/functions/v1/tribute-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cancelled_subscription",
    "payload": {
      "telegram_user_id": "123456789",
      "subscription_id": 12345,
      "expires_at": "2025-12-31T23:59:59Z",
      "subscription_name": "Pro Monthly",
      "period": "monthly",
      "currency": "USD",
      "amount": 999
    }
  }'
```

## 📝 Notes

1. The webhook finds users by `telegram_user_id` in the `profiles` table
2. Subscriptions are upserted using `user_id` as the conflict key
3. The `access_until` field is set from `payload.expires_at`
4. Users can view their own subscriptions via RLS policies
5. Pro status is checked automatically in `AuthContext` and available via `useAuth().isPro`









