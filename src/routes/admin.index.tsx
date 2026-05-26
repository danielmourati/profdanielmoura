import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const tables = ["flashcards", "products", "downloads", "testimonials", "assessments", "assessment_attempts"];
  const counts = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t as any).select("*", { count: "exact", head: true });
          return [t, count ?? 0] as const;
        })
      );
      return Object.fromEntries(results) as Record<string, number>;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tables.map((t) => (
          <div key={t} className="bg-card border border-border rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t.replace(/_/g, " ")}</div>
            <div className="text-4xl font-bold mt-2">{counts.data?.[t] ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
