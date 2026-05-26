import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download as DownloadIcon, FileText, FileSpreadsheet, File } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/downloads")({
  head: () => ({ meta: [{ title: "Downloads gratuitos — Prof. Daniel Moura" }] }),
  component: Page,
});

const iconFor = (name: string) => {
  if (name === "spreadsheet" || name === "xlsx") return FileSpreadsheet;
  if (name === "pdf" || name === "file-text") return FileText;
  return File;
};

function Page() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["downloads_public"],
    queryFn: async () => {
      const { data } = await supabase.from("downloads").select("*").eq("active", true).order("order_index");
      return data ?? [];
    },
  });

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-5xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <DownloadIcon size={14} /> Materiais Gratuitos
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Área de <span className="text-gradient">Downloads</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Baixe materiais complementares para potencializar seus estudos.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {isLoading && <div className="col-span-full text-center text-muted-foreground">Carregando...</div>}
          {data.map((d: any) => {
            const Icon = iconFor(d.icon);
            return (
              <a
                key={d.id}
                href={d.file_url}
                target="_blank"
                rel="noopener noreferrer"
                download={d.file_name}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-glow transition-all flex items-start gap-4"
              >
                <div className="size-12 grid place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">{d.file_type}</span>
                  </div>
                  <h3 className="mt-1 font-display font-bold text-lg">{d.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <DownloadIcon size={14} /> Baixar
                  </div>
                </div>
              </a>
            );
          })}
          {!isLoading && data.length === 0 && <div className="col-span-full text-center text-muted-foreground">Nenhum arquivo disponível.</div>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
