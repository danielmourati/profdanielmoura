import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AuthGate } from "@/components/site/AuthGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/avaliacao/")({
  head: () => ({ meta: [{ title: "Avaliação Diagnóstica — Prof. Daniel Moura" }] }),
  component: Gated,
});

function Gated() {
  return (
    <AuthGate redirect="/avaliacao">
      <Page />
    </AuthGate>
  );
}

function Page() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["assessments_public"],
    queryFn: async () => {
      const { data } = await supabase.from("assessments").select("*").eq("active", true).order("created_at");
      return data ?? [];
    },
  });

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <ClipboardList size={14} /> Avaliação Diagnóstica
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Descubra seu <span className="text-gradient">nível</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Faça uma avaliação rápida e receba um direcionamento personalizado.</p>
        </div>

        <div className="mt-12 space-y-4">
          {isLoading && <div className="text-center text-muted-foreground">Carregando...</div>}
          {data.map((a: any) => (
            <Link
              key={a.id}
              to="/avaliacao/$slug"
              params={{ slug: a.slug }}
              className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-bold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                </div>
                <ArrowRight className="text-primary shrink-0" />
              </div>
            </Link>
          ))}
          {!isLoading && data.length === 0 && <div className="text-center text-muted-foreground">Nenhuma avaliação disponível.</div>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
