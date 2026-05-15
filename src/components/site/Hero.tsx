import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import hero from "@/assets/daniel-hero.png";

export function Hero() {
  return (
    <section id="inicio" className="relative pt-28 lg:pt-32 pb-20 overflow-hidden bg-hero">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-accent/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> Preparatório para Concursos
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]">
            Informática para Concursos com o{" "}
            <span className="text-gradient">Prof. Daniel Moura</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Mais de <strong className="text-foreground">15 anos</strong> de experiência em tecnologia e mais de{" "}
            <strong className="text-foreground">7 anos</strong> preparando alunos para concursos públicos.
          </p>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            Centenas de alunos já foram ajudados a gabaritar Informática e conquistar a aprovação.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#produtos"
              className="group inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-full hover:scale-105 transition-transform shadow-glow"
            >
              Quero estudar Informática
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#avaliacao"
              className="inline-flex items-center gap-2 bg-card border border-border text-foreground font-semibold px-6 py-3.5 rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              Fazer avaliação gratuita
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {["Método focado", "Linguagem didática", "Resultados reais"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent" /> {t}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 rounded-full" />
          <div className="relative rounded-3xl overflow-hidden glow-ring bg-card">
            <img src={hero} alt="Prof. Daniel Moura" className="w-full h-auto object-cover" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-4 lg:-left-10 bottom-12 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-card max-w-[220px]"
          >
            <div className="text-3xl font-display font-bold text-gradient-cta">+700</div>
            <div className="text-xs text-muted-foreground">alunos preparados</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -right-2 lg:-right-6 top-16 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-card"
          >
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gradient-gold grid place-items-center text-background font-bold text-sm">
                ★
              </div>
              <div>
                <div className="text-sm font-semibold">Aprovações</div>
                <div className="text-xs text-muted-foreground">em todo o Brasil</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
