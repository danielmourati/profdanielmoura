import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, ShoppingCart, Sparkles } from "lucide-react";

const benefits = [
  "Conteúdo direto ao ponto",
  "Linguagem simples e didática",
  "Foco no concurso ACS Parnaíba",
  "Ideal para revisão e preparação estratégica",
];

export function Apostila() {
  return (
    <section id="apostila" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} /> Lançamento ACS 2026
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Apostila de Informática para o concurso da{" "}
            <span className="text-gradient">Prefeitura de Parnaíba — ACS 2026</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Material objetivo, organizado e direcionado para quem deseja se preparar com foco no conteúdo de Informática cobrado no concurso de Agente Comunitário de Saúde da Prefeitura de Parnaíba.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                <span className="text-foreground">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#LINK_APOSTILA_ACS_2026"
              className="group inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-bold px-7 py-4 rounded-full hover:scale-105 transition-transform shadow-glow"
            >
              <ShoppingCart size={18} />
              Comprar Apostila Agora
            </a>
            <div className="text-sm text-muted-foreground">
              <div className="text-xs uppercase tracking-wider">Investimento</div>
              <div className="text-foreground font-semibold">A partir de R$ 47,00</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-gradient-primary opacity-25 blur-3xl rounded-full" />
          <div className="relative mx-auto max-w-sm">
            <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-3xl p-1 shadow-glow rotate-3">
              <div className="rounded-[20px] overflow-hidden bg-gradient-hero aspect-[3/4] relative">
                <div className="absolute inset-0 grid-bg opacity-50" />
                <div className="relative h-full flex flex-col justify-between p-7">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] text-accent font-bold uppercase">Apostila Digital</div>
                    <div className="mt-2 size-12 rounded-xl bg-gradient-cta grid place-items-center text-accent-foreground">
                      <BookOpen size={22} />
                    </div>
                    <h3 className="mt-6 text-2xl font-display font-bold leading-tight">
                      Informática<br />para Concursos
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      ACS — Prefeitura de Parnaíba <span className="text-accent">2026</span>
                    </p>
                  </div>
                  <div>
                    <div className="h-px bg-border my-4" />
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Autor</div>
                        <div className="font-semibold">Prof. Daniel Moura</div>
                      </div>
                      <div className="text-xs px-2.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/30 font-bold">
                        EDIÇÃO 2026
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
