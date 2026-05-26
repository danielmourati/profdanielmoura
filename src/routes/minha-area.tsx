import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, ClipboardList, Brain, KeyRound } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/minha-area")({
  head: () => ({ meta: [{ title: "Minha Área" }] }),
  component: Page,
});

type Tab = "perfil" | "avaliacoes" | "flashcards";

function Page() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("perfil");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (!user) return null;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 max-w-5xl mx-auto px-5 lg:px-8">
        <h1 className="text-4xl font-display font-bold">Minha Área</h1>
        <p className="text-muted-foreground mt-2">Gerencie seus dados e acompanhe sua evolução.</p>

        <div className="mt-8 flex gap-1 border-b border-border">
          {[
            { id: "perfil", label: "Perfil", icon: User },
            { id: "avaliacoes", label: "Avaliações", icon: ClipboardList },
            { id: "flashcards", label: "Flashcards", icon: Brain },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "perfil" && <ProfileTab userId={user.id} email={user.email ?? ""} />}
          {tab === "avaliacoes" && <AssessmentsTab />}
          {tab === "flashcards" && <FlashcardsTab />}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ProfileTab({ userId, email }: { userId: string; email: string }) {
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["my_profile", userId],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      return data;
    },
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.display_name ?? "");
      setPhone((profile.data as any).phone ?? "");
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: name, phone } as any)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my_profile", userId] });
      toast.success("Perfil atualizado");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const resetPwd = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) toast.error(error.message);
    else toast.success("Email de redefinição enviado!");
  };

  return (
    <div className="max-w-xl bg-card border border-border rounded-2xl p-6 space-y-4">
      <div>
        <label className="text-sm font-medium">Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          value={email}
          disabled
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-muted-foreground"
        />
      </div>
      <div>
        <label className="text-sm font-medium">WhatsApp</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(11) 99999-9999"
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full disabled:opacity-60"
        >
          {save.isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          onClick={resetPwd}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <KeyRound size={14} /> Alterar senha por email
        </button>
      </div>
    </div>
  );
}

function AssessmentsTab() {
  const attempts = useQuery({
    queryKey: ["my_attempts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("assessment_attempts")
        .select("*, assessments(title)")
        .order("created_at");
      return data ?? [];
    },
  });

  const chartData = (attempts.data ?? []).map((a: any, i: number) => ({
    name: `#${i + 1}`,
    score: a.score,
  }));

  return (
    <div className="space-y-6">
      {chartData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold mb-4">Evolução</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(attempts.data ?? []).slice().reverse().map((a: any) => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{a.assessments?.title}</div>
              <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("pt-BR")}</div>
              {a.band_label && <div className="text-sm mt-1 text-primary">{a.band_label}</div>}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gradient">{a.score}%</div>
              <div className="text-xs text-muted-foreground">{a.correct_count}/{a.total_questions}</div>
            </div>
          </div>
        ))}
        {(attempts.data ?? []).length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma tentativa ainda. <Link to="/avaliacao" className="text-primary underline">Fazer uma avaliação</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardsTab() {
  const sessions = useQuery({
    queryKey: ["my_fc_sessions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("flashcard_sessions" as any)
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  if (sessions.isLoading) return <div className="text-muted-foreground">Carregando...</div>;
  if ((sessions.data ?? []).length === 0)
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhuma sessão ainda. <Link to="/flashcards" className="text-primary underline">Treinar flashcards</Link>
      </div>
    );

  return (
    <div className="space-y-3">
      {(sessions.data ?? []).map((s: any) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        return (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">
                {s.category_name ?? "Todas as categorias"}{" "}
                {s.level && <span className="text-xs uppercase tracking-wider text-accent ml-2">{s.level}</span>}
              </div>
              <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("pt-BR")}</div>
              <div className="text-xs mt-1">
                <span className="text-success">{s.correct} acertos</span> · <span className="text-destructive">{s.wrong} erros</span> · {s.total} cards
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gradient">{pct}%</div>
              {s.duration_seconds && (
                <div className="text-xs text-muted-foreground">{Math.round(s.duration_seconds / 60)}min</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
