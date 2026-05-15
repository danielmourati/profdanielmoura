import { motion } from "framer-motion";
import { GraduationCap, Users, Award, Cpu } from "lucide-react";
import portrait from "@/assets/daniel-portrait.jpg";

const stats = [
  { icon: Cpu, value: "+15", label: "anos em Tecnologia da Informação" },
  { icon: GraduationCap, value: "+7", label: "anos como professor de preparatórios" },
  { icon: Users, value: "+700", label: "alunos preparados e orientados" },
  { icon: Award, value: "100%", label: "foco em Informática para concursos" },
];

export function Authority() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-5 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 relative"
        >
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl rounded-3xl" />
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden glow-ring">
            <img src={portrait} alt="Prof. Daniel Moura" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs uppercase tracking-widest text-accent font-semibold">Professor</div>
              <div className="text-2xl font-display font-bold">Daniel Moura</div>
              <div className="text-sm text-muted-foreground">Especialista em Informática para Concursos</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <span className="text-xs uppercase tracking-widest text-accent font-bold">Autoridade</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold">
            Um professor que une <span className="text-gradient">tecnologia</span> e didática voltada à aprovação.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Com formação técnica sólida e anos atuando no mercado de TI, o Prof. Daniel Moura traduz a Informática para a realidade dos concursos: linguagem simples, exemplos diretos e foco no que cai na prova.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:-translate-y-1 transition-all"
              >
                <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all">
                  <s.icon size={20} />
                </div>
                <div className="text-3xl font-display font-bold text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
