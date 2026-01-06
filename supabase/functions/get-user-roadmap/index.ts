import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/* =======================
   Types
======================= */

type CourseStatus = "not_started" | "in_progress" | "completed";

type Step = {
  groupId: string;
  title: string;
  outcome: string | null;
  directionId: string;
  progress: { completed: number; total: number };
  courses: Array<{ slug: string; status: CourseStatus }>;
};

type RoadmapResponse = {
  steps: Step[];
  currentGroupId: string | null;
};

type Answer = {
  source: string;
  value: string;
};

/* =======================
   CORS
======================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:8080",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

/* =======================
   Handler
======================= */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    /* =======================
       Auth
    ======================= */

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* =======================
       Fetch data
    ======================= */

    const [
      profileRes,
      directionsRes,
      groupsRes,
      enrollmentsRes,
      weightsRes,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "ai_goals, ai_context, ai_ai_level, ai_code_level, ai_priority_tracks"
        )
        .eq("id", user.id)
        .single(),

      supabase.from("directions").select("id, order_default"),

      supabase
        .from("course_groups")
        .select(
          "id, direction_id, title, subtitle, order_in_direction, course_slugs"
        ),

      supabase
        .from("course_enrollments")
        .select("course_slug, status")
        .eq("user_id", user.id),

      supabase
        .from("direction_weights")
        .select("direction_id, source, source_value, weight"),
    ]);

    if (
      profileRes.error ||
      directionsRes.error ||
      groupsRes.error ||
      enrollmentsRes.error ||
      weightsRes.error
    ) {
      throw new Error("Failed to fetch data");
    }

    const profile = profileRes.data;
    const directions = directionsRes.data ?? [];
    const courseGroups = groupsRes.data ?? [];
    const enrollments = enrollmentsRes.data ?? [];
    const weights = weightsRes.data ?? [];

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* =======================
       Build answers
    ======================= */

    const answers: Answer[] = [];

    if (Array.isArray(profile.ai_goals)) {
      for (const v of profile.ai_goals) {
        answers.push({ source: "ai_goals", value: v });
      }
    }

    if (Array.isArray(profile.ai_priority_tracks)) {
      for (const v of profile.ai_priority_tracks) {
        answers.push({ source: "ai_priority_tracks", value: v });
      }
    }

    if (profile.ai_context) {
      answers.push({ source: "ai_context", value: profile.ai_context });
    }

    if (profile.ai_ai_level) {
      answers.push({ source: "ai_ai_level", value: profile.ai_ai_level });
    }

    if (profile.ai_code_level) {
      answers.push({ source: "ai_code_level", value: profile.ai_code_level });
    }

    /* =======================
       Score directions
    ======================= */

    const scoreByDirection = new Map<string, number>();

for (const d of directions) {
  scoreByDirection.set(d.id, 0);
}


    for (const w of weights) {
  const matched = answers.some(
    (a) => a.source === w.source && a.value === w.source_value
  );

  if (!matched) continue;

  scoreByDirection.set(
    w.direction_id,
    (scoreByDirection.get(w.direction_id) ?? 0) + w.weight
  );
}

    /* =======================
       Sort directions
    ======================= */

   const orderFallback = new Map<string, number>();
   for (const d of directions ?? []) {
  orderFallback.set(d.id, d.order_default ?? 0);
}



    const prioritizedDirections = [...scoreByDirection.entries()]
  .sort((a, b) => {
    const scoreDiff = b[1] - a[1];
    if (scoreDiff !== 0) return scoreDiff;

    const orderA = orderFallback.get(a[0]) ?? 0;
    const orderB = orderFallback.get(b[0]) ?? 0;

    return orderA - orderB;
  })
  .map(([directionId]) => directionId);

    /* =======================
       Enrollment map
    ======================= */

    const enrollmentBySlug = new Map<string, CourseStatus>(
  enrollments.map((e) => [e.course_slug, e.status as CourseStatus])
);


    /* =======================
       Build steps
    ======================= */

    const steps: Step[] = [];

    for (const dir of prioritizedDirections) {
      const groupsForDir = courseGroups
        .filter((g) => g.direction_id === dir)
        .sort((a, b) => a.order_in_direction - b.order_in_direction);

      for (const group of groupsForDir) {
        const slugs = group.course_slugs ?? [];
        let completed = 0;

        const courses = slugs.map((slug) => {
          const status = enrollmentBySlug.get(slug) ?? "not_started";
          if (status === "completed") completed += 1;
          return { slug, status };
        });

        steps.push({
          groupId: group.id,
          title: group.title,
          outcome: group.subtitle,
          directionId: group.direction_id,
          progress: { completed, total: slugs.length },
          courses,
        });
      }
    }

    /* =======================
       Current group
    ======================= */

    let currentGroupId: string | null = null;

    for (const step of steps) {
      if (step.progress.total === 0) continue;
      if (step.progress.completed < step.progress.total) {
        currentGroupId = step.groupId;
        break;
      }
    }
    const allZero = [...scoreByDirection.values()].every((v) => v === 0);

if (allZero) {
  console.log("FALLBACK: no weights matched, using default direction order");
}

    console.log("ANSWERS", answers);
console.log("WEIGHTS COUNT", weights.length);
console.log("SCORES", [...scoreByDirection.entries()]);



    const response: RoadmapResponse = {
      steps,
      currentGroupId,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Roadmap error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
