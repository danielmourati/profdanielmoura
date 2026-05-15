import { motion } from "framer-motion";
import { FileText, Shield, Building2, HeartPulse, ArrowRight } from "lucide-react";

const products = [
  {
    icon: FileText,
    title: "Questões Comentadas de Informática",
    desc: "Pratique com questões explicadas de forma simples e estratégica.",
    price: "R$ 37",
    href: "#LINK_QUESTOES",
    accent: "from-primary to-accent",
  },
  {
    icon: HeartPulse,
    title: "Informática — ACS/ACE Parnaíba",
    desc: "Material focado para Agente Comunitário de Saúde e Agente de Combate às Endemias.",
    price: "R$ 47",
    href: "#LINK_ACS",
    accent: "from-accent to-success",
  },
  {
    icon: Shield,
    title: "Informática — GCM Parnaíba",
    desc: "Preparação direcionada para Guarda Civil Municipal de Parnaíba.",
    price: "R$ 47",
    href: "#LINK_GCM",
    accent: "from-gold to-primary",
  },
  {
    icon: Building2,
    title: "Informática — SEDESC Parnaíba",
    desc: "Conteúdo de Informática voltado ao concurso da SEDESC Parnaíba.",
    price: "R$ 47",
    href: "#LINK_SEDESC",
    accent: "from-primary to-gold",
  },
];

export function Products() {
  return (
    <section id="produtos" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-accent font-bold">Produtos digitais</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold">
            Materiais para acelerar sua <span className="text-gradient">aprovação</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Apostilas e bancos de questões organizados para quem quer estudar com foco e método.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-card border border-border rounded-3xl p-6 hover:-translate-y-2 hover:border-primary/50 transition-all overflow-hidden"
            >
              <div className={`absolute -top-20 -right-20 size-40 rounded-full bg-gradient-to-br ${p.accent} opacity-15 blur-2xl group-hover:opacity-30 transition-opacity`} />
              <div className="relative">
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${p.accent} grid place-items-center text-background shadow-glow`}>
                  <p.icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-display font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>

                <div className="mt-6 flex items-end justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">A partir de</div>
                    <div className="text-2xl font-display font-bold text-gradient">{p.price}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Comprar <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
