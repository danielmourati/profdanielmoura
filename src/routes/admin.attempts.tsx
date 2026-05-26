import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/attempts")({ component: P });

function P() {
  const { data = [] } = useQuery({
    queryKey: ["all_attempts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("assessment_attempts")
        .select("*, assessments(title)")
        .order("created_at", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6">Histórico de Tentativas</h1>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Data</th>
              <th className="text-left px-4 py-3">Avaliação</th>
              <th className="text-left px-4 py-3">Aluno</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Acertos</th>
              <th className="text-left px-4 py-3">Faixa</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a: any) => (
              <tr key={a.id} className="border-t border-border text-sm">
                <td className="px-4 py-3">{new Date(a.created_at).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">{a.assessments?.title ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.user_id ? a.user_id.slice(0, 8) : "Anônimo"}</td>
                <td className="px-4 py-3 font-semibold">{a.score}%</td>
                <td className="px-4 py-3">{a.correct_count}/{a.total_questions}</td>
                <td className="px-4 py-3">{a.band_label}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <div className="p-8 text-center text-muted-foreground">Nenhuma tentativa ainda.</div>}
      </div>
    </div>
  );
}
