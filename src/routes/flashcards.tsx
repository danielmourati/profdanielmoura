import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, SkipForward, RotateCw, Play, Square, Timer } from "lucide-react";
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

function Page() {
  const [diff, setDiff] = useState<string | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [catChosen, setCatChosen] = useState(false);
  const [seconds, setSeconds] = useState<number>(20);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);

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
    enabled: !!diff && catChosen && playing,
    queryFn: async () => {
      let q = supabase.from("flashcards").select("*").eq("difficulty", diff as any).order("order_index");
      if (catId) q = q.eq("category_id", catId);
      const { data } = await q;
      return data ?? [];
    },
  });

  const list = cards.data ?? [];
  const card = useMemo(() => list[index], [list, index]);

  useEffect(() => {
    if (!playing || !card || flipped) return;
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setFlipped(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, card?.id, flipped, seconds]);

  const next = () => {
    setFlipped(false);
    if (index + 1 >= list.length) { setPlaying(false); setDone(true); }
    else setTimeout(() => setIndex((i) => i + 1), 150);
  };

  const start = () => {
    setIndex(0); setHits(0); setMiss(0); setFlipped(false); setDone(false);
    setPlaying(true);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPlaying(false); setDone(true);
  };

  const restart = () => {
    setDiff(null); setCatId(null); setCatChosen(false);
    setIndex(0); setHits(0); setMiss(0); setFlipped(false); setDone(false); setPlaying(false);
  };

  const diffLabel = DIFFS.find((d) => d.id === diff)?.label;
  const canStart = !!diff && catChosen;

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

        {!playing && !done && (
          <div className="mt-10 max-w-3xl mx-auto space-y-8">
            {/* Step 1: Level */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                1. Escolha o nível
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {DIFFS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setDiff(d.id); setSeconds(d.seconds); setCatId(null); setCatChosen(false); }}
                    className={`rounded-2xl p-5 text-center transition-all border ${
                      diff === d.id
                        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    <div className="text-xl font-display font-bold">{d.label}</div>
                    <div className={`text-xs mt-1 ${diff === d.id ? "opacity-80" : "text-muted-foreground"}`}>{d.seconds}s sugeridos</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Category — locked until level */}
            <div className={!diff ? "opacity-40 pointer-events-none select-none" : ""}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                2. Escolha o assunto {!diff && <span className="normal-case text-xs">(selecione o nível primeiro)</span>}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setCatId(null); setCatChosen(true); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    catChosen && catId === null ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border hover:border-primary"
                  }`}
                >Todas</button>
                {(cats.data ?? []).map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => { setCatId(c.id); setCatChosen(true); }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      catChosen && catId === c.id ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border hover:border-primary"
                    }`}
                  >{c.name}</button>
                ))}
              </div>
            </div>

            {/* Step 3: Time */}
            <div className={!canStart ? "opacity-40 pointer-events-none select-none" : ""}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Timer size={14} /> 3. Tempo por pergunta
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {TIME_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeconds(s)}
                    className={`rounded-xl p-3 font-bold border transition-all ${seconds === s ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-card border-border hover:border-primary"}`}
                  >{s}s</button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <div className="text-center pt-2">
              <button
                onClick={start}
                disabled={!canStart}
                className="inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-bold px-10 py-4 rounded-full transition-all shadow-glow disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:scale-[1.02]"
              >
                <Play size={18} /> Iniciar treinamento
              </button>
              {!canStart && (
                <p className="text-xs text-muted-foreground mt-3">
                  Selecione nível e assunto para liberar o início.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Playing */}
        {playing && (
          <>
            {cards.isLoading ? (
              <div className="mt-12 text-center text-muted-foreground">Carregando...</div>
            ) : list.length === 0 ? (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">Nenhum flashcard nesse filtro.</p>
                <button onClick={restart} className="mt-4 underline text-primary">Voltar</button>
              </div>
            ) : (
              <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-start">
                <div className="relative mx-auto w-full max-w-xl">
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
                    <button onClick={stop} className="inline-flex items-center justify-center gap-2 bg-destructive text-destructive-foreground font-semibold py-3 rounded-full">
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

        {done && (
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
