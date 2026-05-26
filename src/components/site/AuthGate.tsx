import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export function AuthGate({ redirect, children }: { redirect: string; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Nav />
        <div className="pt-40 text-center text-muted-foreground">Carregando...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Nav />
        <section className="pt-32 pb-20 max-w-xl mx-auto px-5 lg:px-8 text-center">
          <div className="size-16 rounded-2xl bg-gradient-cta grid place-items-center text-accent-foreground mx-auto shadow-glow">
            <Lock size={28} />
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl font-display font-bold">
            Acesso exclusivo para alunos cadastrados
          </h1>
          <p className="mt-3 text-muted-foreground">
            Crie sua conta gratuita em segundos e comece imediatamente. Seu progresso e histórico ficam salvos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              search={{ redirect, mode: "signup" } as any}
              className="bg-gradient-cta text-accent-foreground font-bold px-6 py-3 rounded-full hover:scale-[1.02] transition-transform shadow-glow"
            >
              Criar conta grátis
            </Link>
            <Link
              to="/login"
              search={{ redirect } as any}
              className="bg-card border border-border text-foreground font-semibold px-6 py-3 rounded-full hover:border-primary/40"
            >
              Já tenho conta
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return <>{children}</>;
}
