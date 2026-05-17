import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-hero" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Comece hoje sua preparação em <span className="text-gradient">Informática</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Não espere o edital avançar para começar. Estude com método, foco e a orientação de quem entende de concursos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href="#produtos"
              className="group inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-glow"
            >
              Quero começar agora
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#flashcards"
              className="inline-flex items-center gap-2 bg-card/60 backdrop-blur border border-border text-foreground font-semibold px-8 py-4 rounded-full hover:border-accent transition-colors"
            >
              Treinar com flashcards
            </a>
          </div>
        </motion.div>

        <motion.img
          src={arms}
          alt="Prof. Daniel Moura"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block w-[360px] drop-shadow-2xl"
        />
      </div>
    </section>
  );
}
