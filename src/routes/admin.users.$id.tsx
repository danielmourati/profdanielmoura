import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain, ClipboardList, Mail, Phone, UserRound } from "lucide-react";
import { getAdminUserDetail } from "@/lib/admin-data.functions";

export const Route = createFileRoute("/admin/users/$id")({ component: UserDetail });

function UserDetail() {
  const { id } = Route.useParams();
  const fetchDetail = useServerFn(getAdminUserDetail);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin_user_detail", id], queryFn: () => fetchDetail({ data: { userId: id } }) });
  if (isLoading) return <div className="text-muted-foreground">Carregando...</div>;
  if (error || !data) return <div className="text-destructive">Não foi possível carregar este usuário.</div>;
  return <div className="space-y-8">
    <div><Link to="/admin/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} /> Voltar</Link><h1 className="mt-3 text-3xl font-bold">{data.user.display_name || "Usuário"}</h1></div>
    <section className="grid gap-4 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
      <Info icon={Mail} label="E-mail" value={data.user.email} /><Info icon={Phone} label="WhatsApp" value={data.user.phone || "Não informado"} /><Info icon={UserRound} label="Status" value={data.user.blocked ? "Bloqueado" : "Ativo"} /><Info icon={UserRound} label="Cadastro" value={new Date(data.user.created_at).toLocaleDateString("pt-BR")} />
    </section>
    <History title="Avaliações" icon={ClipboardList} empty="Nenhuma avaliação realizada.">{data.assessments.map((item: any) => <div key={item.id} className="flex items-center justify-between border-b border-border py-3 last:border-0"><div><p className="font-medium">{item.assessments?.title ?? "Avaliação"}</p><p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("pt-BR")}</p></div><strong>{item.score}% · {item.correct_count}/{item.total_questions}</strong></div>)}</History>
    <History title="Flashcards" icon={Brain} empty="Nenhum treinamento realizado.">{data.flashcards.map((item: any) => <div key={item.id} className="flex items-center justify-between border-b border-border py-3 last:border-0"><div><p className="font-medium">{item.category_name || "Flashcards"}</p><p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("pt-BR")}</p></div><strong>{item.correct} acertos · {item.wrong} erros</strong></div>)}</History>
  </div>;
}

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) { return <div><span className="flex items-center gap-2 text-xs uppercase text-muted-foreground"><Icon size={14} /> {label}</span><p className="mt-1 font-medium break-words">{value}</p></div>; }
function History({ title, icon: Icon, empty, children }: { title: string; icon: typeof Mail; empty: string; children: React.ReactNode }) { const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children); return <section><h2 className="flex items-center gap-2 text-xl font-bold"><Icon size={20} /> {title}</h2><div className="mt-3 border-y border-border">{hasItems ? children : <p className="py-6 text-muted-foreground">{empty}</p>}</div></section>; }