import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SlugInput = z.object({ slug: z.string().min(1).max(120) });

export const getPublicAssessmentBySlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string }) => SlugInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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

const ImportedAssessmentQuestion = z.object({
  question: z.string().trim().min(1).max(5000),
  options: z.array(z.object({
    id: z.enum(["a", "b", "c", "d"]),
    text: z.string().trim().min(1).max(5000),
  })).length(4),
  correct_option_id: z.enum(["a", "b", "c", "d"]),
});

const AssessmentQuestionImport = z.object({
  assessmentId: z.string().uuid(),
  rows: z.array(ImportedAssessmentQuestion).min(1).max(500),
});

export const importAssessmentQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { assessmentId: string; rows: unknown[] }) => AssessmentQuestionImport.parse(input))
  .handler(async ({ data, context }) => {
    const { data: role, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) throw new Error(roleError.message);
    if (!role) throw new Error("Acesso restrito a administradores");

    const { data: assessment, error: assessmentError } = await context.supabase
      .from("assessments")
      .select("id")
      .eq("id", data.assessmentId)
      .maybeSingle();
    if (assessmentError) throw new Error(assessmentError.message);
    if (!assessment) throw new Error("Avaliação não encontrada");

    const { data: lastQuestion, error: orderError } = await context.supabase
      .from("assessment_questions")
      .select("order_index")
      .eq("assessment_id", data.assessmentId)
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (orderError) throw new Error(orderError.message);

    const firstOrder = (lastQuestion?.order_index ?? -1) + 1;
    const records = data.rows.map((row, index) => ({
      assessment_id: data.assessmentId,
      question: row.question,
      options: row.options,
      correct_option_id: row.correct_option_id,
      order_index: firstOrder + index,
    }));
    const { error: insertError } = await context.supabase.from("assessment_questions").insert(records);
    if (insertError) throw new Error(insertError.message);
    return { imported: records.length };
  });