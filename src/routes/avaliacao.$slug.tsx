import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ChevronRight, RotateCw, Trophy } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AuthGate } from "@/components/site/AuthGate";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getPublicAssessmentBySlug } from "@/lib/assessments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/avaliacao/$slug")({
  component: Gated,
});

function Gated() {
  const { slug } = Route.useParams();
  return (
    <AuthGate redirect={`/avaliacao/${slug}`}>
      <Page />
    </AuthGate>
  );
}

type Option = { id: string; text: string };

function Page() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const fetchAssessment = useServerFn(getPublicAssessmentBySlug);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<{ score: number; correct: number; total: number; band: any } | null>(null);

  const assessment = useQuery({
    queryKey: ["assessment_slug", slug],
    queryFn: () => fetchAssessment({ data: { slug } }),
  });

  const submit = useMutation({
    mutationFn: async () => {
      const a = assessment.data!;
      const { data, error } = await supabase.rpc("submit_assessment" as any, {
        p_assessment_id: a.id,
        p_answers: answers as any,
      });
      if (error) throw error;
      const res = data as any;
      setResult({
        score: res.score,
        correct: res.correct,
        total: res.total,
        band: res.band,
      });
    },
    onError: (e: any) => toast.error(e.message),
  });


  const reset = () => { setAnswers({}); setCurrent(0); setResult(null); };

  if (assessment.isLoading) return <Shell><div className="text-center">Carregando...</div></Shell>;
  if (assessment.isError) return <Shell><div className="text-center text-destructive">Não foi possível carregar as perguntas: {(assessment.error as Error).message}</div></Shell>;
  if (!assessment.data) return <Shell><div className="text-center">Avaliação não encontrada.</div></Shell>;

  const a = assessment.data;
  const questions = a.questions as any[];

  if (result) {
    const colorClass = {
      destructive: "text-destructive border-destructive/40 bg-destructive/10",
      accent: "text-accent border-accent/40 bg-accent/10",
      primary: "text-primary border-primary/40 bg-primary/10",
      success: "text-success border-success/40 bg-success/10",
    }[result.band?.color as string] ?? "text-primary border-primary/40 bg-primary/10";

    return (
      <Shell>
        <div className="text-center">
          <Trophy className="mx-auto text-accent" size={48} />
          <h1 className="mt-4 text-4xl font-display font-bold">Seu resultado</h1>
          <div className="mt-8 inline-block">
            <div className="text-7xl font-bold text-gradient">{result.score}%</div>
            <div className="text-sm text-muted-foreground mt-2">{result.correct} de {result.total} corretas</div>
          </div>
          {result.band && (
            <div className={`mt-8 max-w-xl mx-auto p-6 border rounded-2xl ${colorClass}`}>
              <div className="text-xl font-bold">{result.band.label}</div>
              <p className="mt-2">{result.band.message}</p>
            </div>
          )}
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={reset} className="inline-flex items-center gap-2 bg-card border border-border px-5 py-2 rounded-full">
              <RotateCw size={14} /> Refazer
            </button>
            <Link to="/avaliacao" className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full">
              Ver outras avaliações
            </Link>
            {user ? (
              <Link to="/minha-area" className="text-primary underline self-center text-sm">Ver meu histórico</Link>
            ) : (
              <Link to="/login" className="text-primary underline self-center text-sm">Criar conta para salvar</Link>
            )}
          </div>
        </div>
      </Shell>
    );
  }

  if (questions.length === 0) return <Shell><div className="text-center text-muted-foreground">Esta avaliação ainda não tem perguntas.</div></Shell>;

  const q = questions[current];
  const allAnswered = questions.every((qq) => answers[qq.id]);

  return (
    <Shell>
      <div className="mb-8">
        <Link to="/avaliacao" className="text-sm text-muted-foreground hover:text-foreground">← Voltar</Link>
        <h1 className="mt-2 text-3xl font-display font-bold">{a.title}</h1>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-cta" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Pergunta {current + 1} de {questions.length}</div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8">
        <p className="text-xl md:text-2xl font-display font-semibold">{q.question}</p>
        <div className="mt-6 space-y-2">
          {(q.options as Option[]).map((o) => {
            const picked = answers[q.id] === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  picked ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                }`}
              >
                <span className="font-mono uppercase mr-3 text-primary font-bold">{o.id}</span>
                {o.text}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 text-sm text-muted-foreground disabled:opacity-40"
          >
            ← Anterior
          </button>
          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!answers[q.id]}
              className="inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full disabled:opacity-50"
            >
              Próxima <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => submit.mutate()}
              disabled={!allAnswered || submit.isPending}
              className="bg-gradient-cta text-accent-foreground font-semibold px-6 py-2 rounded-full disabled:opacity-50"
            >
              {submit.isPending ? "Enviando..." : "Finalizar"}
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-3xl mx-auto px-5 lg:px-8">{children}</section>
      <Footer />
    </main>
  );
}
