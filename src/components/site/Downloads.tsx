import { motion } from "framer-motion";
import { FileSpreadsheet, Download } from "lucide-react";

const files = [
  {
    icon: FileSpreadsheet,
    title: "Excel Intermediário — Aula 1",
    desc: "Material de apoio da aula 1 de Excel Intermediário. Arquivo .xlsx para download gratuito.",
    href: "/downloads/Excel-Intermediario-Aula-1.xlsx",
    filename: "Excel-Intermediario-Aula-1.xlsx",
    size: "XLSX",
  },
];

export function Downloads() {
  return (
    <section id="downloads" className="relative py-24 lg:py-32 bg-secondary/30">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-accent font-bold">Área de arquivos</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold">
            Downloads <span className="text-gradient">gratuitos</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Materiais complementares para reforçar seus estudos. Baixe e estude no seu ritmo.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {files.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-card border border-border rounded-3xl p-6 hover:-translate-y-2 hover:border-primary/50 transition-all overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 size-40 rounded-full bg-gradient-to-br from-primary to-accent opacity-15 blur-2xl group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center text-background shadow-glow">
                  <f.icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-display font-bold leading-snug">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.size}</span>
                  <a
                    href={f.href}
                    download={f.filename}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all"
                  >
                    <Download size={16} /> Baixar
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
