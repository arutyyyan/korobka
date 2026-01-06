import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type OnboardingConfigResponse = {
  steps: {
    id: string; // совпадает с колонкой в profiles
    title: string;
    description?: string | null;
    type: "single" | "multi";
    max_answers?: number | null;
    order: number;
    options: {
      id: string; // source_value для direction_weights
      label: string;
      order: number;
    }[];
  }[];
};

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase credentials" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Public endpoint - no authentication required
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Fetch all questions ordered by order
    const { data: questions, error: questionsError } = await supabase
      .from("onboarding_questions")
      .select("id, title, description, type, max_answers, order")
      .order("order", { ascending: true });

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch questions" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: "No questions found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch all options ordered by order
    const { data: options, error: optionsError } = await supabase
      .from("onboarding_options")
      .select("id, label, order, question_id")
      .order("order", { ascending: true });

    if (optionsError) {
      console.error("Error fetching options:", optionsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch options" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Group options by question_id
    const optionsByQuestionId = new Map<string, typeof options>();
    if (options) {
      for (const option of options) {
        if (!optionsByQuestionId.has(option.question_id)) {
          optionsByQuestionId.set(option.question_id, []);
        }
        optionsByQuestionId.get(option.question_id)!.push(option);
      }
    }

    // Build response
    const steps = questions.map((question) => {
      const questionOptions = optionsByQuestionId.get(question.id) || [];
      
      return {
        id: question.id,
        title: question.title,
        description: question.description ?? null,
        type: question.type as "single" | "multi",
        max_answers: question.max_answers ?? null,
        order: question.order,
        options: questionOptions.map((option) => ({
          id: option.id,
          label: option.label,
          order: option.order,
        })),
      };
    });

    const response: OnboardingConfigResponse = {
      steps,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

