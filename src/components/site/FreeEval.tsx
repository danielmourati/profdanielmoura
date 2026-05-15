import { motion } from "framer-motion";
import { ClipboardCheck, Target, TrendingUp, ArrowRight } from "lucide-react";
import teaching from "@/assets/daniel-teaching.jpg";

const benefits = [
  { icon: Target, text: "Identifique seus pontos fracos" },
  { icon: TrendingUp, text: "Saiba quais conteúdos priorizar" },
  { icon: ClipboardCheck, text: "Receba uma visão clara do que melhorar" },
];

export function FreeEval() {
  return (
    <section id="avaliacao" className="relative py-24 lg:py-32 bg-secondary/30">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative order-2 lg:order-1"
        >
          <div className="absolute -inset-4 bg-gradient-cta opacity-25 blur-3xl rounded-3xl" />
          <div className="relative rounded-3xl overflow-hidden glow-ring aspect-[4/5]">
            <img src={teaching} alt="Prof. Daniel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/30 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
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

          <div className="mt-8 bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-card">
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-gradient-cta grid place-items-center text-accent-foreground shrink-0">
                    <b.icon size={18} />
                  </div>
                  <span className="text-foreground pt-1">{b.text}</span>
                </li>
              ))}
            </ul>

            <a
              href="#LINK_AVALIACAO_AQUI"
              className="mt-8 group inline-flex items-center justify-center gap-2 w-full bg-gradient-cta text-accent-foreground font-bold px-6 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-glow"
            >
              Fazer diagnóstico gratuito
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {/* PLACEHOLDER: substitua o href acima pelo link real do formulário */}
              Leva apenas alguns minutos. Sem custo, sem compromisso.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
