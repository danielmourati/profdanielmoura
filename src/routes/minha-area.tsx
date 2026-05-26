import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/minha-area")({
  head: () => ({ meta: [{ title: "Minha Área" }] }),
  component: Page,
});

function Page() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const attempts = useQuery({
    queryKey: ["my_attempts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("assessment_attempts")
        .select("*, assessments(title)")
        .order("created_at");
      return data ?? [];
    },
  });

  if (!user) return null;

  const chartData = (attempts.data ?? []).map((a: any, i: number) => ({
    name: `#${i + 1}`,
    score: a.score,
    date: new Date(a.created_at).toLocaleDateString("pt-BR"),
  }));

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-5xl mx-auto px-5 lg:px-8">
        <h1 className="text-4xl font-display font-bold">Minha Área</h1>
        <p className="text-muted-foreground mt-2">Acompanhe sua evolução nas avaliações diagnósticas.</p>

        {chartData.length > 0 && (
          <div className="mt-8 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display font-bold mb-4">Evolução</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <h2 className="font-display font-bold">Tentativas</h2>
          {(attempts.data ?? []).slice().reverse().map((a: any) => (
            <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.assessments?.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("pt-BR")}</div>
                {a.band_label && <div className="text-sm mt-1 text-primary">{a.band_label}</div>}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gradient">{a.score}%</div>
                <div className="text-xs text-muted-foreground">{a.correct_count}/{a.total_questions}</div>
              </div>
            </div>
          ))}
          {(attempts.data ?? []).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Nenhuma tentativa ainda. <Link to="/avaliacao" className="text-primary underline">Fazer uma avaliação</Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
