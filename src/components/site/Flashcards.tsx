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

        <div className="hidden">
          {/* Demo de flashcards oculta — usuário acessa via /flashcards */}
        </div>
      </div>
    </section>
  );
}
