import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: authList, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (authErr) throw new Error(authErr.message);

    const ids = authList.users.map((u) => u.id);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, display_name, phone").in("id", ids),
      supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids),
    ]);

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });

    return authList.users.map((u) => {
      const p: any = profileMap.get(u.id) ?? {};
      const bannedUntil = (u as any).banned_until as string | null | undefined;
      const blocked = !!bannedUntil && new Date(bannedUntil) > new Date();
      return {
        id: u.id,
        email: u.email ?? "",
        display_name: p.display_name ?? null,
        phone: p.phone ?? null,
        roles: roleMap.get(u.id) ?? [],
        blocked,
        last_sign_in_at: u.last_sign_in_at ?? null,
        created_at: u.created_at,
      };
    });
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    const email = u.user?.email;
    if (!email) throw new Error("Usuário sem email");
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return { ok: true, email };
  });

export const toggleUserBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; block: boolean }) =>
    z.object({ userId: z.string().uuid(), block: z.boolean() }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Você não pode bloquear a si mesmo");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: data.block ? "876000h" : "none",
    } as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Você não pode excluir a si mesmo");
    await supabaseAdmin.from("profiles").delete().eq("id", data.userId);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
