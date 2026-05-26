import { motion } from "framer-motion";
import { CheckCircle2, ShoppingCart, Sparkles } from "lucide-react";
import apostilaCover from "@/assets/apostila-cover.jpg";

const benefits = [
  "Conteúdo direto ao ponto",
  "Linguagem simples e didática",
  "Foco no concurso ACS Parnaíba",
  "Ideal para revisão e preparação estratégica",
];

export function Apostila() {
  return (
    <section id="apostila" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Mockup da apostila — sem card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center lg:justify-start"
          >
            <img
              src={apostilaCover}
              alt="Mockup da apostila de Informática para o concurso ACS 2026"
              className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Conteúdo textual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
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

            <ul className="mt-8 space-y-3 max-w-xl mx-auto lg:mx-0 text-left">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="https://pay.kiwify.com.br/hDC71b0"
                target="_blank"
                rel="noopener noreferrer"
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
        </div>
      </div>
    </section>
  );
}
