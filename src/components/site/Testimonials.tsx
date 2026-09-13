import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
};

export function Testimonials() {
  const { data: items = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, role, content, avatar_url, rating")
        .eq("active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Testimonial[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (items.length === 0) return null;

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
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-7 hover:border-primary/40 transition-colors relative"
            >
              <Quote className="absolute top-5 right-5 text-primary/20" size={42} />
              <div className="flex gap-1" aria-label={`${Math.max(1, Math.min(5, t.rating))} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star
                    key={k}
                    size={16}
                    className={k < Math.max(1, Math.min(5, t.rating)) ? "text-gold" : "text-muted-foreground/40"}
                    fill={k < Math.max(1, Math.min(5, t.rating)) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="mt-4 text-foreground leading-relaxed">“{t.content}”</p>
              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={`Foto de ${t.name}`}
                    className="size-10 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-gradient-primary grid place-items-center font-bold text-primary-foreground">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{t.name}</div>
                  {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
