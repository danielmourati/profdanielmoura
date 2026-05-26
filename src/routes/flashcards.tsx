import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, SkipForward, RotateCw } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flashcards — Informática para Concursos" }] }),
  component: Page,
});

const DIFFS = [
  { id: "facil", label: "Fácil" },
  { id: "medio", label: "Médio" },
  { id: "dificil", label: "Difícil" },
] as const;

function Page() {
  const [diff, setDiff] = useState<string>("facil");
  const [catId, setCatId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);

  const cats = useQuery({
    queryKey: ["fc_cats"],
    queryFn: async () => {
      const { data } = await supabase.from("flashcard_categories").select("*").order("order_index");
      return data ?? [];
    },
  });

  const cards = useQuery({
    queryKey: ["fc_cards", diff, catId],
    queryFn: async () => {
      let q = supabase.from("flashcards").select("*").eq("difficulty", diff as any).order("order_index");
      if (catId) q = q.eq("category_id", catId);
      const { data } = await q;
      return data ?? [];
    },
  });

  const list = cards.data ?? [];
  const card = useMemo(() => list[index % Math.max(list.length, 1)], [list, index]);

  const next = () => { setFlipped(false); setTimeout(() => setIndex((i) => i + 1), 150); };

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
          <p className="mt-4 text-muted-foreground">Escolha o nível de dificuldade e treine.</p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {DIFFS.map((d) => (
            <button
              key={d.id}
              onClick={() => { setDiff(d.id); setIndex(0); setFlipped(false); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                diff === d.id ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow" : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { setCatId(null); setIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs border ${!catId ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border text-muted-foreground"}`}
          >Todas</button>
          {(cats.data ?? []).map((c: any) => (
            <button
              key={c.id}
              onClick={() => { setCatId(c.id); setIndex(0); }}
              className={`px-3 py-1.5 rounded-full text-xs border ${catId === c.id ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border text-muted-foreground"}`}
            >{c.name}</button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">Nenhum flashcard nesse nível ainda.</div>
        ) : (
          <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="relative mx-auto w-full max-w-xl perspective-[1200px]">
              <div
                onClick={() => setFlipped((v) => !v)}
                className="relative cursor-pointer aspect-[5/3] preserve-3d transition-transform duration-700"
                style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-card flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                    <span className="text-accent font-bold">{DIFFS.find((d) => d.id === diff)?.label}</span>
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
                <button onClick={next} className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-accent-foreground font-semibold py-3 rounded-full">
                  Próxima
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
      </section>
      <Footer />
    </main>
  );
}
