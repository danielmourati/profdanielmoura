import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import hero from "@/assets/daniel-hero.png";
import bg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] overflow-hidden bg-background"
    >
      {/* Background classroom image */}
      <div className="absolute inset-0">
        <img
          src={bg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-32 lg:pt-40 pb-16 grid lg:grid-cols-2 gap-8 items-end min-h-[100svh]">
        {/* Left: Headline + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:pb-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight">
            Informática que <span className="text-gradient">aprova</span> em concurso.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Mais de 15 anos em tecnologia e 7+ anos preparando alunos para concursos públicos. Método focado, didática direta, resultados reais.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#produtos"
              className="group inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground font-semibold pl-6 pr-2 py-2 rounded-full hover:scale-[1.02] transition-transform shadow-glow"
            >
              <span className="text-base">Quero estudar Informática</span>
              <span className="size-10 rounded-full bg-background/20 grid place-items-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={18} />
              </span>
            </a>
            <a
              href="#avaliacao"
              className="inline-flex items-center gap-2 text-foreground font-semibold px-6 py-3.5 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
            >
              Avaliação gratuita
            </a>
          </div>
        </motion.div>

        {/* Right: Hero portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative justify-self-center lg:justify-self-end self-end"
        >
          <div className="absolute -inset-10 bg-gradient-primary blur-3xl opacity-25 rounded-full" />
          <img
            src={hero}
            alt="Prof. Daniel Moura"
            className="relative w-full max-w-lg lg:max-w-2xl xl:max-w-3xl h-auto object-contain drop-shadow-2xl scale-110 lg:scale-125 origin-bottom"
          />
        </motion.div>
      </div>
    </section>
  );
}
