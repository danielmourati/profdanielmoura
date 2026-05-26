import { motion } from "framer-motion";
import { ClipboardCheck, Target, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import floatQuiz from "@/assets/float-quiz.png";
import floatChart from "@/assets/float-chart.png";
import floatProgress from "@/assets/float-progress.png";
import floatBadge from "@/assets/float-badge.png";

const benefits = [
  { icon: Target, text: "Identifique seus pontos fracos" },
  { icon: TrendingUp, text: "Saiba quais conteúdos priorizar" },
  { icon: ClipboardCheck, text: "Receba uma visão clara do que melhorar" },
];

const floats = [
  { src: floatQuiz, alt: "Quiz de avaliação", className: "top-[6%] left-[8%] w-32 md:w-40 lg:w-48", delay: 0 },
  { src: floatChart, alt: "Gráfico de níveis", className: "top-[18%] right-[6%] w-28 md:w-36 lg:w-44", delay: 0.4 },
  { src: floatProgress, alt: "Progresso", className: "bottom-[14%] left-[4%] w-28 md:w-36 lg:w-44", delay: 0.8 },
  { src: floatBadge, alt: "Certificação", className: "bottom-[8%] right-[10%] w-24 md:w-32 lg:w-40", delay: 1.2 },
];

export function FreeEval() {
  return (
    <section id="avaliacao" className="relative py-24 lg:py-32 bg-secondary/30 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Floating decorative images */}
      <div className="absolute inset-0 pointer-events-none">
        {floats.map((f) => (
          <motion.img
            key={f.alt}
            src={f.src}
            alt={f.alt}
            loading="lazy"
            className={`absolute ${f.className} drop-shadow-2xl select-none`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: f.delay }}
            animate={{ y: [0, -14, 0] }}
            style={{ animationDelay: `${f.delay}s` }}
          />
        ))}
        {/* Continuous floating motion overlay */}
        <FloatingMotion />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-bold uppercase tracking-wider">
            100% Gratuito
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Avaliação Diagnóstica <span className="text-gradient-cta">GRATUITA</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Descubra agora seu nível de conhecimento em Informática para concursos públicos e receba um direcionamento estratégico de estudo.
          </p>

          <ul className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
            {benefits.map((b) => (
              <li key={b.text} className="flex items-start gap-3 bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-4">
                <div className="size-9 rounded-lg bg-gradient-cta grid place-items-center text-accent-foreground shrink-0">
                  <b.icon size={18} />
                </div>
                <span className="text-sm text-foreground pt-1">{b.text}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/avaliacao"
            className="mt-10 group inline-flex items-center justify-center gap-2 bg-gradient-cta text-accent-foreground font-bold px-8 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-glow"
          >
            Fazer diagnóstico gratuito
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Leva apenas alguns minutos. Sem custo, sem compromisso.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingMotion() {
  return (
    <style>{`
      @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
      #avaliacao img { animation: floatY 6s ease-in-out infinite; }
    `}</style>
  );
}
