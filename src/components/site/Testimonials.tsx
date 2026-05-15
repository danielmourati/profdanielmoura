import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const items = [
  { name: "Mariana S.", role: "Aprovada ACS", text: "Consegui entender Informática de um jeito simples. As aulas mudaram minha forma de estudar." },
  { name: "Rafael L.", role: "Concursando", text: "As aulas do Prof. Daniel foram decisivas na minha aprovação. Didática excelente." },
  { name: "Juliana P.", role: "Servidora", text: "Os materiais são objetivos e muito bem explicados. Recomendo para qualquer concurseiro." },
];

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-accent font-bold">Depoimentos</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold">
            Quem estuda com o Prof. Daniel <span className="text-gradient">aprova</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-7 hover:border-primary/40 transition-colors relative"
            >
              <Quote className="absolute top-5 right-5 text-primary/20" size={42} />
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-foreground leading-relaxed">"{t.text}"</p>
              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-primary grid place-items-center font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
