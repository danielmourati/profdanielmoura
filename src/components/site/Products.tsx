import { motion } from "framer-motion";
import { FileText, ArrowRight, Clock3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Products() {
  const { data: products = [] } = useQuery({
    queryKey: ["products_public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("active", true).order("order_index");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (products.length === 0) return null;
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
          {products.map((p, i) => {
            const comingSoon = p.coming_soon;
            const content = (
              <>
                {comingSoon && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent"><Clock3 size={11} /> Em breve</span>}
                <div className="relative">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${p.accent} grid place-items-center text-background shadow-glow`}><FileText size={24} /></div>
                  <h3 className="mt-5 text-lg font-display font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-6 flex items-end justify-between pt-4 border-t border-border">
                    <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">A partir de</div><div className="text-2xl font-display font-bold text-gradient">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(p.price_cents / 100)}</div></div>
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${comingSoon ? "text-muted-foreground" : "text-primary"}`}>{comingSoon ? "Aguarde" : "Comprar"} {!comingSoon && <ArrowRight size={16} />}</span>
                  </div>
                </div>
              </>
            );
            const className = `group relative bg-card border rounded-3xl p-6 transition-all overflow-hidden ${comingSoon ? "border-border opacity-80 cursor-not-allowed" : "border-border hover:-translate-y-2 hover:border-primary/50"}`;
            return comingSoon ? (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={className} aria-disabled="true">{content}</motion.div>
            ) : (
            <motion.a
              key={p.id}
              href={p.checkout_url}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={className}
            >
              {content}
            </motion.a>
          )})}
        </div>
      </div>
    </section>
  );
}
