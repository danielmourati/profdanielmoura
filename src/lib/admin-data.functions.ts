import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito a administradores");
}

export const listAdminAttempts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: attempts, error } = await supabaseAdmin
      .from("assessment_attempts")
      .select("*, assessments(title)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    const ids = [...new Set((attempts ?? []).map((item) => item.user_id).filter(Boolean))] as string[];
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from("profiles").select("id, display_name, phone").in("id", ids)
      : { data: [] };
    const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const authUsers = await Promise.all(ids.map((id) => supabaseAdmin.auth.admin.getUserById(id)));
    const emailMap = new Map(authUsers.flatMap((result) => result.data.user ? [[result.data.user.id, result.data.user.email ?? ""]] : []));
    return (attempts ?? []).map((attempt) => ({
      ...attempt,
      student: attempt.user_id ? {
        display_name: profileMap.get(attempt.user_id)?.display_name ?? null,
        email: emailMap.get(attempt.user_id) ?? "",
      } : null,
    }));
  });

export const getAdminUserDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: authData, error: authError }, profile, roles, assessments, flashcards] = await Promise.all([
      supabaseAdmin.auth.admin.getUserById(data.userId),
      supabaseAdmin.from("profiles").select("display_name, phone, created_at").eq("id", data.userId).maybeSingle(),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", data.userId),
      supabaseAdmin.from("assessment_attempts").select("*, assessments(title)").eq("user_id", data.userId).order("created_at", { ascending: false }),
      supabaseAdmin.from("flashcard_sessions").select("*").eq("user_id", data.userId).order("created_at", { ascending: false }),
    ]);
    if (authError || !authData.user) throw new Error(authError?.message ?? "Usuário não encontrado");
    return {
      user: {
        email: authData.user.email ?? "",
        display_name: profile.data?.display_name ?? null,
        phone: profile.data?.phone ?? null,
        created_at: authData.user.created_at,
        last_sign_in_at: authData.user.last_sign_in_at ?? null,
        blocked: Boolean(authData.user.banned_until && new Date(authData.user.banned_until) > new Date()),
        roles: (roles.data ?? []).map((item) => item.role),
      },
      assessments: assessments.data ?? [],
      flashcards: flashcards.data ?? [],
    };
  });

const QuestionImport = z.object({
  statement: z.string().trim().min(1),
  option_a: z.string().trim().min(1),
  option_b: z.string().trim().min(1),
  option_c: z.string().trim().min(1),
  option_d: z.string().trim().min(1),
  option_e: z.string().trim().nullable().optional(),
  correct_option: z.enum(["a", "b", "c", "d", "e"]),
  comment: z.string().default(""), discipline: z.string().default(""), subject: z.string().default(""),
  area: z.string().default(""), exam: z.string().default(""), organization: z.string().default(""),
  city: z.string().default(""), role: z.string().default(""), education: z.string().default(""),
  banca: z.string().trim().nullable().optional(), year: z.number().int().min(1900).max(2200).nullable().optional(),
  difficulty: z.enum(["facil", "medio", "dificil"]), active: z.boolean().default(true),
});

export const importQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { rows: unknown[] }) => z.object({ rows: z.array(QuestionImport).min(1).max(1000) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("questions").insert(data.rows);
    if (error) throw new Error(error.message);
    return { imported: data.rows.length };
  });