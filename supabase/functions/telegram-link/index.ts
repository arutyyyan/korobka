import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Verify bot secret if provided
    const botSecret = req.headers.get("x-bot-secret");
    const expectedSecret = Deno.env.get("BOT_SECRET");
    
    if (expectedSecret && botSecret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { token, telegram_user_id } = await req.json();

    if (!token || !telegram_user_id) {
      return new Response(JSON.stringify({ error: "Missing token or telegram_user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase credentials" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Find the login link and verify it's not expired or used
    const { data: loginLink, error: linkErr } = await supabase
      .from("login_links")
      .select("user_id, expires_at, used_at, course_id, lesson_id, origin_path")
      .eq("token", token)
      .single();

    if (linkErr || !loginLink) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if token is expired
    const expiresAt = new Date(loginLink.expires_at);
    if (expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: "Token expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if token is already used
    if (loginLink.used_at) {
      return new Response(JSON.stringify({ error: "Token already used" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if telegram_user_id is already linked to another account
    const { data: existingProfile, error: existingError } = await supabase
      .from("profiles")
      .select("id")
      .eq("telegram_user_id", String(telegram_user_id))
      .neq("id", loginLink.user_id)
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ 
          error: "TELEGRAM_ALREADY_LINKED",
          message: "Этот Telegram уже привязан к другому аккаунту на платформе. Если это ошибка — напишите в поддержку."
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the profile with telegram_user_id
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ telegram_user_id: String(telegram_user_id) })
      .eq("id", loginLink.user_id);

    if (updErr) {
      console.error("Error updating profile:", updErr);
      return new Response(JSON.stringify({ error: "Failed to update profile" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mark the login link as used
    await supabase
      .from("login_links")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token);

    // Return origin_path and user_id for bot to generate magic link
    return new Response(JSON.stringify({ 
      success: true,
      user_id: loginLink.user_id,
      origin_path: loginLink.origin_path,
      course_id: loginLink.course_id, // Keep for backward compatibility
      lesson_id: loginLink.lesson_id, // Keep for backward compatibility
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in telegram-link function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
