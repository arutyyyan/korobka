import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // 1. Read raw body
    const rawBody = await req.text();
    const signature = req.headers.get("trbt-signature");

    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    // 2. Verify signature
    const apiKey = Deno.env.get("TRIBUTE_API_KEY")!;
    const encoder = new TextEncoder();

    const expectedSignatureBytes = await crypto.subtle.sign(
      "HMAC",
      encoder.encode(apiKey),
      encoder.encode(rawBody),
    );

    const expectedSignature =
      "trbt-signature=" +
      Array.from(new Uint8Array(expectedSignatureBytes))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    if (signature !== expectedSignature) {
      return new Response("Invalid signature", { status: 401 });
    }

    // 3. Parse payload
    const { name, payload } = JSON.parse(rawBody);

    if (!name || !payload?.telegram_user_id) {
      return new Response("Invalid payload", { status: 400 });
    }

    // 4. Supabase client (service role)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );

    // 5. Find user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("telegram_user_id", String(payload.telegram_user_id))
      .single();

    if (profileError || !profile) {
      return new Response("User not found", { status: 404 });
    }

    // 6. Prepare subscription facts
    const accessUntil = new Date(payload.expires_at);

    const subscriptionRecord = {
      user_id: profile.id,
      telegram_user_id: String(payload.telegram_user_id),
      subscription_id: payload.subscription_id,
      access_until: accessUntil.toISOString(),
      plan_name: payload.subscription_name ?? null,
      period: payload.period ?? null,
      currency: payload.currency ?? null,
      amount: payload.amount ?? null,
      updated_at: new Date().toISOString(),
    };

    // 7. Upsert subscription (for BOTH events)
    if (
      name === "new_subscription" ||
      name === "cancelled_subscription"
    ) {
      const { error } = await supabase
        .from("subscriptions")
        .upsert(subscriptionRecord, { onConflict: "user_id" });

      if (error) {
        console.error("Subscription upsert failed", error);
        return new Response("Failed to update subscription", { status: 500 });
      }
    } else {
      return new Response("Unknown event", { status: 400 });
    }

    // 8. Optional: notify user (side effect, not access logic)
    const botToken = Deno.env.get("BOT_TOKEN");
    if (botToken && payload.telegram_user_id && name === "new_subscription") {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: payload.telegram_user_id,
          text:
            "Оплата прошла ✅\n\nПерейдите на платформу:\nhttps://www.korobka.co/learn",
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
