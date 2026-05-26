import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, SkipForward, RotateCw, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Card = { q: string; a: string };
type Cat = { id: string; label: string; cards: Card[] };

const DATA: Cat[] = [
  {
    id: "hardware",
    label: "Hardware",
    cards: [
      { q: "Memória temporária do computador?", a: "RAM" },
      { q: "Cérebro do computador?", a: "CPU" },
      { q: "Memória não volátil de armazenamento?", a: "HD" },
      { q: "Sigla da placa principal?", a: "Placa-mãe" },
    ],
  },
  {
    id: "software",
    label: "Software",
    cards: [
      { q: "Programa que gerencia o hardware?", a: "Sistema Operacional" },
      { q: "Tipo de software malicioso?", a: "Malware" },
      { q: "Software gratuito e aberto?", a: "Open Source" },
    ],
  },
  {
    id: "windows",
    label: "Windows 10",
    cards: [
      { q: "Atalho para Gerenciador de Tarefas?", a: "Ctrl+Shift+Esc" },
      { q: "Atalho para bloquear a tela?", a: "Win+L" },
      { q: "Atalho para abrir o Explorer?", a: "Win+E" },
    ],
  },
  {
    id: "office",
    label: "Microsoft Office",
    cards: [
      { q: "Função usada para somar valores?", a: "SOMA" },
      { q: "Função para média aritmética?", a: "MÉDIA" },
      { q: "Atalho para salvar no Word?", a: "Ctrl+B" },
    ],
  },
  {
    id: "internet",
    label: "Internet",
    cards: [
      { q: "Protocolo seguro da web?", a: "HTTPS" },
      { q: "Endereço único na rede?", a: "IP" },
      { q: "Sistema que traduz nomes em IPs?", a: "DNS" },
    ],
  },
  {
    id: "seg",
    label: "Segurança",
    cards: [
      { q: "Programa que se replica sozinho?", a: "Vírus" },
      { q: "Golpe que tenta enganar usuários?", a: "Phishing" },
      { q: "Barreira de proteção de rede?", a: "Firewall" },
    ],
  },
];

export function Flashcards() {
  const [catId, setCatId] = useState<string>(DATA[0].id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);

  const cat = useMemo(() => DATA.find((c) => c.id === catId)!, [catId]);
  const card = cat.cards[index % cat.cards.length];

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + 1) % cat.cards.length), 150);
  };

  const pickCat = (id: string) => {
    setCatId(id);
    setIndex(0);
    setFlipped(false);
  };

  return (
    <section id="flashcards" className="relative py-24 lg:py-32 bg-secondary/30">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <Brain size={14} /> Método Anki
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold">
            Treine Informática com <span className="text-gradient">Flashcards Inteligentes</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Responda, vire o card e marque se acertou ou errou. Ideal para revisar como no método Anki.
          </p>
          <Link
            to="/flashcards"
            className="mt-8 group inline-flex items-center justify-center gap-2 bg-gradient-cta text-accent-foreground font-bold px-8 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-glow"
          >
            Iniciar treinamento grátis
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Acesso liberado após cadastro gratuito.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => pickCat(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                catId === c.id
                  ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="relative mx-auto w-full max-w-xl perspective-[1200px]">
            <div
              onClick={() => setFlipped((v) => !v)}
              className="relative cursor-pointer aspect-[5/3] preserve-3d transition-transform duration-700"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-card flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                  <span className="text-accent font-bold">{cat.label}</span>
                  <span className="text-muted-foreground">Pergunta</span>
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-center leading-tight">
                  {card.q}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <RotateCw size={14} /> Toque no card para virar
                </div>
              </div>
              {/* Back */}
              <div
                className="absolute inset-0 backface-hidden bg-gradient-primary rounded-3xl p-8 lg:p-10 shadow-glow flex flex-col justify-between text-primary-foreground"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-widest opacity-80">
                  <span className="font-bold">Resposta</span>
                  <span>{cat.label}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={card.a}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-display font-extrabold text-center"
                  >
                    {card.a}
                  </motion.p>
                </AnimatePresence>
                <div className="text-center text-sm opacity-80">Marque seu desempenho abaixo</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => { setHits((h) => h + 1); next(); }}
                className="inline-flex items-center justify-center gap-2 bg-success/15 text-success border border-success/40 font-semibold py-3 rounded-full hover:bg-success hover:text-background transition-all"
              >
                <Check size={16} /> Acertei
              </button>
              <button
                onClick={() => { setMiss((m) => m + 1); next(); }}
                className="inline-flex items-center justify-center gap-2 bg-destructive/15 text-destructive border border-destructive/40 font-semibold py-3 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                <X size={16} /> Errei
              </button>
              <button
                onClick={next}
                className="inline-flex items-center justify-center gap-2 bg-card border border-border text-muted-foreground font-semibold py-3 rounded-full hover:text-foreground transition-all"
              >
                <SkipForward size={16} /> Pular
              </button>
              <button
                onClick={next}
                className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-accent-foreground font-semibold py-3 rounded-full hover:scale-[1.02] transition-transform"
              >
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
            <button
              onClick={() => { setHits(0); setMiss(0); }}
              className="text-xs text-muted-foreground hover:text-foreground underline lg:col-auto col-span-2"
            >
              Zerar contadores
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
