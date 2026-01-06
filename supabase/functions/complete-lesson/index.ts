import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type CompleteLessonResponse = {
  courseCompleted: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:8080",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase credentials" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get user from authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Parse request body
    const { course_slug, lesson_id } = await req.json();

    if (!course_slug || !lesson_id) {
      return new Response(
        JSON.stringify({ error: "Missing course_slug or lesson_id" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify lesson belongs to course
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", course_slug)
      .eq("is_published", true)
      .single();

    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("id", lesson_id)
      .eq("course_id", course.id)
      .single();

    if (!lesson) {
      return new Response(JSON.stringify({ error: "Lesson not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Upsert lesson progress
    const { error: progressError } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          course_slug: course_slug,
          lesson_id: lesson_id,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

    if (progressError) {
      console.error("Error saving lesson progress:", progressError);
      return new Response(
        JSON.stringify({ error: "Failed to save lesson progress" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch all lessons for the course
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", course.id);

    if (!allLessons || allLessons.length === 0) {
      return new Response(
        JSON.stringify({ error: "No lessons found for course" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch all completed lessons for this user and course
    const { data: completedLessons } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_slug", course_slug);

    const completedLessonIds = new Set(
      completedLessons?.map((l) => l.lesson_id) ?? []
    );

    // Check if all lessons are completed
    const allLessonsCompleted = allLessons.every((l) =>
      completedLessonIds.has(l.id)
    );

    let courseCompleted = false;

    if (allLessonsCompleted) {
      // Mark course as completed
      const { error: enrollError } = await supabase
        .from("course_enrollments")
        .upsert(
          {
            user_id: user.id,
            course_slug: course_slug,
            status: "completed",
            progress: 100,
          },
          {
            onConflict: "user_id,course_slug",
          }
        );

      if (enrollError) {
        console.error("Error updating course enrollment:", enrollError);
      } else {
        courseCompleted = true;
      }
    } else {
      // Update progress percentage
      const progressPercent = Math.round(
        (completedLessonIds.size / allLessons.length) * 100
      );

      const { error: enrollError } = await supabase
        .from("course_enrollments")
        .upsert(
          {
            user_id: user.id,
            course_slug: course_slug,
            status: "in_progress",
            progress: progressPercent,
          },
          {
            onConflict: "user_id,course_slug",
          }
        );

      if (enrollError) {
        console.error("Error updating course progress:", enrollError);
      }
    }

    return new Response(
      JSON.stringify({
        courseCompleted,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in complete-lesson function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
