import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCw, Filter, Trophy } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AuthGate } from "@/components/site/AuthGate";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/banco-de-questoes")({
  head: () => ({ meta: [{ title: "Banco de Questões — Prof. Daniel Moura" }] }),
  component: () => (
    <AuthGate redirect="/banco-de-questoes">
      <Page />
    </AuthGate>
  ),
});

type Q = {
  id: string;
  statement: string;
  option_a: string; option_b: string; option_c: string; option_d: string; option_e: string | null;
  discipline: string; subject: string; difficulty: "facil" | "medio" | "dificil";
};

type Filters = {
  q: string;
  discipline: string; subject: string; area: string; exam: string;
  organization: string; city: string; role: string; year: string;
  education: string; difficulty: string;
};

const emptyFilters: Filters = {
  q: "", discipline: "", subject: "", area: "", exam: "",
  organization: "", city: "", role: "", year: "", education: "", difficulty: "",
};

type Phase = "filters" | "solving" | "done";

type Attempt = { questionId: string; picked: string; correct: boolean; correctOption: string; comment: string };

function Page() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [phase, setPhase] = useState<Phase>("filters");
  const [sessionId, setSessionId] = useState<string>("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [current, setCurrent] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});

  // Carrega valores distintos para os selects
  const meta = useQuery({
    queryKey: ["questions_meta"],
    queryFn: async () => {
      const { data } = await supabase
        .from("questions_public" as any)
        .select("discipline,subject,area,exam,organization,city,role,year,education")
        .limit(2000);
      const u = (k: string) =>
        Array.from(new Set((data ?? []).map((r: any) => r[k]).filter((v: any) => v !== null && v !== "")))
          .sort()
          .map(String);
      return {
        discipline: u("discipline"), subject: u("subject"), area: u("area"),
        exam: u("exam"), organization: u("organization"), city: u("city"),
        role: u("role"), year: u("year"), education: u("education"),
      };
    },
  });

  const startSession = useMutation({
    mutationFn: async () => {
      let query = supabase.from("questions_public" as any).select("*").limit(50);
      if (filters.q) query = query.ilike("statement", `%${filters.q}%`);
      const eqMap: [keyof Filters, string][] = [
        ["discipline", "discipline"], ["subject", "subject"], ["area", "area"],
        ["exam", "exam"], ["organization", "organization"], ["city", "city"],
        ["role", "role"], ["education", "education"], ["difficulty", "difficulty"],
      ];
      for (const [fk, col] of eqMap) if (filters[fk]) query = query.eq(col, filters[fk]);
      if (filters.year) query = query.eq("year", Number(filters.year));
      const { data, error } = await query;
      if (error) throw error;
      const qs = ((data ?? []) as unknown) as Q[];
      if (qs.length === 0) throw new Error("Nenhuma questão encontrada com esses filtros.");
      // embaralha
      qs.sort(() => Math.random() - 0.5);
      setQuestions(qs);
      setSessionId(crypto.randomUUID());
      setAttempts({});
      setCurrent(0);
      setPhase("solving");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const answer = useMutation({
    mutationFn: async (picked: string) => {
      const q = questions[current];
      const { data, error } = await supabase.rpc("answer_question" as any, {
        p_question_id: q.id, p_session_id: sessionId, p_picked: picked,
      });
      if (error) throw error;
      const res = data as any;
      setAttempts((prev) => ({
        ...prev,
        [q.id]: { questionId: q.id, picked, correct: res.is_correct, correctOption: res.correct_option, comment: res.comment },
      }));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const resetAll = () => {
    setPhase("filters"); setQuestions([]); setAttempts({}); setCurrent(0); setSessionId("");
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-6xl mx-auto px-5 lg:px-8">
        {phase === "filters" && (
          <FiltersView
            filters={filters} setFilters={setFilters} meta={meta.data}
            onStart={() => startSession.mutate()} loading={startSession.isPending}
          />
        )}
        {phase === "solving" && questions.length > 0 && (
          <SolvingView
            questions={questions} current={current} setCurrent={setCurrent}
            attempts={attempts} onAnswer={(p) => answer.mutate(p)} answering={answer.isPending}
            onFinish={() => setPhase("done")} onReset={resetAll}
          />
        )}
        {phase === "done" && (
          <DiagnosisView questions={questions} attempts={attempts} onReset={resetAll} />
        )}
      </section>
      <Footer />
    </main>
  );
}

function FiltersView({
  filters, setFilters, meta, onStart, loading,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  meta: any;
  onStart: () => void;
  loading: boolean;
}) {
  const sel = (k: keyof Filters, label: string, opts: string[]) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <select
        value={filters[k]}
        onChange={(e) => setFilters({ ...filters, [k]: e.target.value })}
        className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
      >
        <option value="">Todos</option>
        {opts?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
          <Filter size={14} /> Banco de Questões
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">Treine com <span className="text-gradient">questões reais</span></h1>
        <p className="mt-4 text-muted-foreground">Filtre por disciplina, órgão, ano e mais. Resolva e receba seu diagnóstico.</p>
      </div>

      <div className="mt-10 bg-card border border-border rounded-2xl p-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pesquisa</label>
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Digite uma palavra do enunciado..."
            className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sel("discipline", "Disciplina", meta?.discipline ?? [])}
          {sel("subject", "Assunto", meta?.subject ?? [])}
          {sel("area", "Área", meta?.area ?? [])}
          {sel("exam", "Certame/Seletivo", meta?.exam ?? [])}
          {sel("organization", "Órgão", meta?.organization ?? [])}
          {sel("city", "Cidade", meta?.city ?? [])}
          {sel("role", "Cargo", meta?.role ?? [])}
          {sel("year", "Ano", meta?.year ?? [])}
          {sel("education", "Escolaridade", meta?.education ?? [])}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dificuldade</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onStart}
            disabled={loading}
            className="bg-gradient-cta text-accent-foreground font-semibold px-6 py-3 rounded-full disabled:opacity-60"
          >
            {loading ? "Carregando..." : "Iniciar sessão"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SolvingView({
  questions, current, setCurrent, attempts, onAnswer, answering, onFinish, onReset,
}: {
  questions: Q[]; current: number; setCurrent: (n: number) => void;
  attempts: Record<string, Attempt>;
  onAnswer: (picked: string) => void; answering: boolean;
  onFinish: () => void; onReset: () => void;
}) {
  const q = questions[current];
  const attempt = attempts[q.id];
  const opts: { id: string; text: string }[] = [
    { id: "a", text: q.option_a }, { id: "b", text: q.option_b },
    { id: "c", text: q.option_c }, { id: "d", text: q.option_d },
    ...(q.option_e ? [{ id: "e", text: q.option_e }] : []),
  ];

  return (
    <div>
      <div className="mb-6">
        <button onClick={onReset} className="text-sm text-muted-foreground hover:text-foreground">← Novos filtros</button>
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-cta" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground flex justify-between">
          <span>Questão {current + 1} de {questions.length}</span>
          <span>{Object.keys(attempts).length} respondidas</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap gap-2 text-xs">
          {q.discipline && <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">{q.discipline}</span>}
          {q.subject && <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">{q.subject}</span>}
          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">{q.difficulty}</span>
        </div>
        <p className="mt-4 text-lg md:text-xl font-display font-semibold whitespace-pre-wrap">{q.statement}</p>

        <div className="mt-6 space-y-2">
          {opts.map((o) => {
            const isPicked = attempt?.picked === o.id;
            const isCorrect = attempt?.correctOption === o.id;
            let cls = "border-border hover:border-primary/40";
            if (attempt) {
              if (isCorrect) cls = "border-success bg-success/10";
              else if (isPicked) cls = "border-destructive bg-destructive/10";
              else cls = "border-border opacity-60";
            }
            return (
              <button
                key={o.id}
                disabled={!!attempt || answering}
                onClick={() => onAnswer(o.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${cls}`}
              >
                <span className="font-mono uppercase text-primary font-bold">{o.id}</span>
                <span className="flex-1">{o.text}</span>
                {attempt && isCorrect && <CheckCircle2 className="text-success shrink-0" size={20} />}
                {attempt && isPicked && !isCorrect && <XCircle className="text-destructive shrink-0" size={20} />}
              </button>
            );
          })}
        </div>

        {attempt && (
          <div className={`mt-6 p-4 rounded-xl border ${attempt.correct ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"}`}>
            <div className="font-bold flex items-center gap-2">
              {attempt.correct ? <><CheckCircle2 size={18} /> Você acertou!</> : <><XCircle size={18} /> Você errou. Gabarito: {attempt.correctOption.toUpperCase()}</>}
            </div>
            {attempt.comment && <p className="mt-2 text-sm whitespace-pre-wrap">{attempt.comment}</p>}
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <button
            onClick={onFinish}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Encerrar sessão
          </button>
          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(current + 1)}
              className="inline-flex items-center gap-1 bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full"
            >
              Próxima <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full"
            >
              Ver diagnóstico
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DiagnosisView({
  questions, attempts, onReset,
}: {
  questions: Q[]; attempts: Record<string, Attempt>; onReset: () => void;
}) {
  const stats = useMemo(() => {
    const total = Object.keys(attempts).length;
    const correct = Object.values(attempts).filter((a) => a.correct).length;
    const wrong = total - correct;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    const groupBy = (key: "discipline" | "subject" | "difficulty") => {
      const map: Record<string, { c: number; t: number }> = {};
      for (const q of questions) {
        const a = attempts[q.id];
        if (!a) continue;
        const k = (q as any)[key] || "—";
        map[k] ??= { c: 0, t: 0 };
        map[k].t += 1;
        if (a.correct) map[k].c += 1;
      }
      return Object.entries(map)
        .map(([k, v]) => ({ key: k, correct: v.c, total: v.t, pct: Math.round((v.c / v.t) * 100) }))
        .sort((a, b) => b.pct - a.pct);
    };

    return { total, correct, wrong, pct, byDiscipline: groupBy("discipline"), bySubject: groupBy("subject"), byDifficulty: groupBy("difficulty") };
  }, [questions, attempts]);

  const diag = stats.pct < 50
    ? { color: "destructive", title: "Você ainda precisa reforçar a base",
        msg: "Recomendamos iniciar por um curso completo e estruturado para dominar os principais assuntos." }
    : stats.pct < 80
    ? { color: "accent", title: "Boa noção, mas há pontos a corrigir",
        msg: "Recomendamos um curso de revisão com foco em questões e assuntos mais cobrados." }
    : { color: "success", title: "Excelente desempenho!",
        msg: "Você está em nível competitivo. Recomendamos um curso avançado de revisão final, simulados e estratégias de prova." };

  const colorClass = {
    destructive: "text-destructive border-destructive/40 bg-destructive/10",
    accent: "text-accent border-accent/40 bg-accent/10",
    success: "text-success border-success/40 bg-success/10",
  }[diag.color];

  const Bar = ({ pct }: { pct: number }) => (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-gradient-cta" style={{ width: `${pct}%` }} />
    </div>
  );

  return (
    <div>
      <div className="text-center">
        <Trophy className="mx-auto text-accent" size={48} />
        <h1 className="mt-4 text-4xl font-display font-bold">Seu diagnóstico</h1>
        <div className="mt-6 text-7xl font-bold text-gradient">{stats.pct}%</div>
        <div className="mt-2 text-sm text-muted-foreground">
          {stats.correct} acertos · {stats.wrong} erros · {stats.total} respondidas
        </div>
      </div>

      <div className={`mt-8 max-w-2xl mx-auto p-6 border rounded-2xl ${colorClass}`}>
        <div className="text-xl font-bold">{diag.title}</div>
        <p className="mt-2">{diag.msg}</p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <StatsCard title="Por disciplina" items={stats.byDiscipline} Bar={Bar} />
        <StatsCard title="Por assunto" items={stats.bySubject} Bar={Bar} />
        <StatsCard title="Por dificuldade" items={stats.byDifficulty} Bar={Bar} />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button onClick={onReset} className="inline-flex items-center gap-2 bg-card border border-border px-5 py-2 rounded-full">
          <RotateCw size={14} /> Nova sessão
        </button>
        <Link to="/" hash="produtos" className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full">
          Ver cursos recomendados
        </Link>
      </div>
    </div>
  );
}

function StatsCard({ title, items, Bar }: { title: string; items: { key: string; correct: number; total: number; pct: number }[]; Bar: any }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-display font-bold mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize truncate pr-2">{it.key}</span>
                <span className="text-muted-foreground shrink-0">{it.correct}/{it.total} · {it.pct}%</span>
              </div>
              <Bar pct={it.pct} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
