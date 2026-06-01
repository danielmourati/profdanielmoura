import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SlugInput = z.object({ slug: z.string().min(1).max(120) });

export const getPublicAssessmentBySlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string }) => SlugInput.parse(input))
  .handler(async ({ data }) => {
    const { data: assessment, error: assessmentError } = await supabaseAdmin
      .from("assessments")
      .select("id, title, slug, description, active, created_at, updated_at")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();

    if (assessmentError) throw new Error(assessmentError.message);
    if (!assessment) return null;

    const [{ data: questions, error: questionsError }, { data: bands, error: bandsError }] = await Promise.all([
      supabaseAdmin
        .from("assessment_questions")
        .select("id, assessment_id, question, options, order_index, created_at, updated_at")
        .eq("assessment_id", assessment.id)
        .order("order_index", { ascending: true }),
      supabaseAdmin
        .from("score_bands")
        .select("id, assessment_id, min_score, max_score, label, message, color, order_index")
        .eq("assessment_id", assessment.id)
        .order("min_score", { ascending: true }),
    ]);

    if (questionsError) throw new Error(questionsError.message);
    if (bandsError) throw new Error(bandsError.message);

    return {
      ...assessment,
      questions: questions ?? [],
      bands: bands ?? [],
    };
  });