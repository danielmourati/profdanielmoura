import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, SkipForward, RotateCw, Play, Square, Timer, ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AuthGate } from "@/components/site/AuthGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flashcards — Informática para Concursos" }] }),
  component: Gated,
});

function Gated() {
  return (
    <AuthGate redirect="/flashcards">
      <Page />
    </AuthGate>
  );
}

const DIFFS = [
  { id: "facil", label: "Fácil", seconds: 30 },
  { id: "medio", label: "Médio", seconds: 20 },
  { id: "dificil", label: "Difícil", seconds: 15 },
] as const;

const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];

type Step = "diff" | "cat" | "time" | "ready" | "playing" | "done";

function Page() {
  const [step, setStep] = useState<Step>("diff");
  const [diff, setDiff] = useState<string | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number>(20);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cats = useQuery({
    queryKey: ["fc_cats"],
    queryFn: async () => {
      const { data } = await supabase.from("flashcard_categories").select("*").order("order_index");
      return data ?? [];
    },
  });

  const cards = useQuery({
    queryKey: ["fc_cards", diff, catId],
    enabled: !!diff && step === "playing",
    queryFn: async () => {
      let q = supabase.from("flashcards").select("*").eq("difficulty", diff as any).order("order_index");
      if (catId) q = q.eq("category_id", catId);
      const { data } = await q;
      return data ?? [];
    },
  });

  const list = cards.data ?? [];
  const card = useMemo(() => list[index], [list, index]);

  // Timer
  useEffect(() => {
    if (step !== "playing" || !card || flipped) return;
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFlipped(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, card?.id, flipped, seconds]);

  const next = () => {
    setFlipped(false);
    if (index + 1 >= list.length) {
      setStep("done");
    } else {
      setTimeout(() => setIndex((i) => i + 1), 150);
    }
  };

  const start = () => {
    setIndex(0); setHits(0); setMiss(0); setFlipped(false);
    setStep("playing");
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep("done");
  };

  const restart = () => {
    setStep("diff"); setDiff(null); setCatId(null);
    setIndex(0); setHits(0); setMiss(0); setFlipped(false);
  };

  const catName = (cats.data ?? []).find((c: any) => c.id === catId)?.name ?? "Todas as categorias";
  const diffLabel = DIFFS.find((d) => d.id === diff)?.label;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <Brain size={14} /> Treine como no Anki
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Flashcards de <span className="text-gradient">Informática</span>
          </h1>
        </div>

        {/* Stepper */}
        {step !== "playing" && step !== "done" && (
          <div className="mt-8 flex justify-center gap-2 text-xs uppercase tracking-widest">
            <StepDot active={step === "diff"} done={!!diff}>1. Nível</StepDot>
            <StepDot active={step === "cat"} done={step === "time" || step === "ready"}>2. Assunto</StepDot>
            <StepDot active={step === "time"} done={step === "ready"}>3. Tempo</StepDot>
            <StepDot active={step === "ready"}>4. Iniciar</StepDot>
          </div>
        )}

        {/* Step 1: difficulty */}
        {step === "diff" && (
          <div className="mt-10 max-w-2xl mx-auto">
            <h2 className="text-xl font-display font-semibold text-center mb-4">Escolha o nível</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {DIFFS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setDiff(d.id); setSeconds(d.seconds); setStep("cat"); }}
                  className="bg-card border border-border hover:border-primary rounded-2xl p-6 text-center transition-all hover:shadow-glow"
                >
                  <div className="text-2xl font-display font-bold">{d.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{d.seconds}s sugeridos</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: category */}
        {step === "cat" && (
          <div className="mt-10 max-w-3xl mx-auto">
            <BackBtn onClick={() => setStep("diff")} />
            <h2 className="text-xl font-display font-semibold text-center mb-4">Escolha o assunto</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => { setCatId(null); setStep("time"); }}
                className="bg-card border border-border hover:border-primary rounded-xl p-4 text-sm font-semibold transition-all"
              >Todas as categorias</button>
              {(cats.data ?? []).map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => { setCatId(c.id); setStep("time"); }}
                  className="bg-card border border-border hover:border-primary rounded-xl p-4 text-sm font-semibold transition-all"
                >{c.name}</button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: time */}
        {step === "time" && (
          <div className="mt-10 max-w-2xl mx-auto">
            <BackBtn onClick={() => setStep("cat")} />
            <h2 className="text-xl font-display font-semibold text-center mb-4 flex items-center justify-center gap-2">
              <Timer size={20} /> Tempo por pergunta
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TIME_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSeconds(s); setStep("ready"); }}
                  className={`rounded-xl p-4 font-bold transition-all border ${seconds === s ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-card border-border hover:border-primary"}`}
                >{s}s</button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: ready */}
        {step === "ready" && (
          <div className="mt-10 max-w-xl mx-auto bg-card border border-border rounded-3xl p-8 text-center">
            <BackBtn onClick={() => setStep("time")} />
            <h2 className="text-2xl font-display font-bold">Tudo pronto!</h2>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted-foreground text-xs uppercase">Nível</dt><dd className="font-bold mt-1">{diffLabel}</dd></div>
              <div><dt className="text-muted-foreground text-xs uppercase">Assunto</dt><dd className="font-bold mt-1">{catName}</dd></div>
              <div><dt className="text-muted-foreground text-xs uppercase">Tempo</dt><dd className="font-bold mt-1">{seconds}s</dd></div>
            </dl>
            <button
              onClick={start}
              className="mt-8 inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-bold px-8 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-glow"
            >
              <Play size={18} /> Iniciar treinamento
            </button>
          </div>
        )}

        {/* Playing */}
        {step === "playing" && (
          <>
            {cards.isLoading ? (
              <div className="mt-12 text-center text-muted-foreground">Carregando...</div>
            ) : list.length === 0 ? (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">Nenhum flashcard nesse filtro.</p>
                <button onClick={restart} className="mt-4 underline text-primary">Tentar outra combinação</button>
              </div>
            ) : (
              <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-start">
                <div className="relative mx-auto w-full max-w-xl">
                  {/* Timer bar */}
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground"><Timer size={14} /> {timeLeft}s</span>
                    <span className="text-muted-foreground">{index + 1} / {list.length}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? "bg-destructive" : "bg-gradient-cta"}`}
                      style={{ width: `${(timeLeft / seconds) * 100}%` }}
                    />
                  </div>

                  <div className="perspective-[1200px]">
                    <div
                      onClick={() => setFlipped((v) => !v)}
                      className="relative cursor-pointer aspect-[5/3] preserve-3d transition-transform duration-700"
                      style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    >
                      <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-card flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                          <span className="text-accent font-bold">{diffLabel}</span>
                          <span className="text-muted-foreground">Pergunta {index + 1}</span>
                        </div>
                        <p className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-center leading-tight">
                          {card?.question}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <RotateCw size={14} /> Toque no card para virar
                        </div>
                      </div>
                      <div className="absolute inset-0 backface-hidden bg-gradient-primary rounded-3xl p-8 lg:p-10 shadow-glow flex flex-col justify-center text-primary-foreground" style={{ transform: "rotateY(180deg)" }}>
                        <AnimatePresence mode="wait">
                          <motion.p key={card?.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl md:text-4xl font-display font-extrabold text-center">
                            {card?.answer}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => { setHits((h) => h + 1); next(); }} className="inline-flex items-center justify-center gap-2 bg-success/15 text-success border border-success/40 font-semibold py-3 rounded-full">
                      <Check size={16} /> Acertei
                    </button>
                    <button onClick={() => { setMiss((m) => m + 1); next(); }} className="inline-flex items-center justify-center gap-2 bg-destructive/15 text-destructive border border-destructive/40 font-semibold py-3 rounded-full">
                      <X size={16} /> Errei
                    </button>
                    <button onClick={next} className="inline-flex items-center justify-center gap-2 bg-card border border-border text-muted-foreground font-semibold py-3 rounded-full">
                      <SkipForward size={16} /> Pular
                    </button>
                    <button
                      onClick={stop}
                      className="inline-flex items-center justify-center gap-2 bg-destructive text-destructive-foreground font-semibold py-3 rounded-full"
                    >
                      <Square size={16} /> Parar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:w-48">
                  <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Acertos</div>
                    <div className="text-4xl font-display font-bold text-success mt-1">{hits}</div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Erros</div>
                    <div className="text-4xl font-display font-bold text-destructive mt-1">{miss}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="mt-10 max-w-xl mx-auto bg-card border border-border rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-display font-bold">Sessão finalizada</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-success/10 border border-success/30 rounded-2xl p-5">
                <div className="text-xs uppercase text-muted-foreground">Acertos</div>
                <div className="text-4xl font-bold text-success">{hits}</div>
              </div>
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5">
                <div className="text-xs uppercase text-muted-foreground">Erros</div>
                <div className="text-4xl font-bold text-destructive">{miss}</div>
              </div>
            </div>
            <button
              onClick={restart}
              className="mt-8 inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-bold px-8 py-3 rounded-full hover:scale-[1.02] transition-transform"
            >
              <RotateCw size={16} /> Novo treinamento
            </button>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

function StepDot({ active, done, children }: { active?: boolean; done?: boolean; children: React.ReactNode }) {
  return (
    <span className={`px-3 py-1.5 rounded-full border ${active ? "bg-primary text-primary-foreground border-transparent" : done ? "bg-success/15 text-success border-success/30" : "bg-card border-border text-muted-foreground"}`}>
      {children}
    </span>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft size={14} /> Voltar
    </button>
  );
}
