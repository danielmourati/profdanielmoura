import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Lock, Unlock, Trash2, Search, ShieldCheck } from "lucide-react";
import {
  listUsers,
  resetUserPassword,
  toggleUserBlock,
  deleteUser,
} from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const fetchList = useServerFn(listUsers);
  const resetFn = useServerFn(resetUserPassword);
  const blockFn = useServerFn(toggleUserBlock);
  const delFn = useServerFn(deleteUser);
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const users = useQuery({
    queryKey: ["admin_users"],
    queryFn: () => fetchList(),
  });

  const reset = useMutation({
    mutationFn: (userId: string) => resetFn({ data: { userId } }),
    onSuccess: (r: any) => toast.success(`Email de reset enviado para ${r.email}`),
    onError: (e: any) => toast.error(e.message),
  });

  const block = useMutation({
    mutationFn: (v: { userId: string; block: boolean }) => blockFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("Status atualizado");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (userId: string) => delFn({ data: { userId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("Usuário excluído");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = (users.data ?? []).filter((u: any) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      u.email?.toLowerCase().includes(s) ||
      u.display_name?.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-1">Gerencie cadastros, senhas e acessos.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nome, email ou telefone..."
            className="bg-card border border-border rounded-full pl-9 pr-4 py-2 text-sm w-72"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {users.isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : users.isError ? (
          <div className="p-8 text-center text-destructive">{(users.error as any)?.message ?? "Erro"}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum usuário</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">WhatsApp</th>
                <th className="text-left px-4 py-3 font-medium">Papel</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Último acesso</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3 text-sm">{u.display_name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-sm">{u.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    {u.roles.includes("admin") ? (
                      <span className="inline-flex items-center gap-1 text-primary"><ShieldCheck size={12} /> admin</span>
                    ) : (
                      <span className="text-muted-foreground">user</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {u.blocked ? (
                      <span className="text-destructive font-medium">Bloqueado</span>
                    ) : (
                      <span className="text-success">Ativo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        title="Enviar reset de senha"
                        onClick={() => reset.mutate(u.id)}
                        disabled={reset.isPending}
                        className="p-2 hover:bg-muted rounded"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        title={u.blocked ? "Desbloquear" : "Bloquear"}
                        onClick={() => block.mutate({ userId: u.id, block: !u.blocked })}
                        disabled={block.isPending}
                        className="p-2 hover:bg-muted rounded"
                      >
                        {u.blocked ? <Unlock size={14} /> : <Lock size={14} />}
                      </button>
                      <button
                        title="Excluir"
                        onClick={() => {
                          if (confirm(`Excluir ${u.email}? Esta ação não pode ser desfeita.`)) del.mutate(u.id);
                        }}
                        className="p-2 hover:bg-muted rounded text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
