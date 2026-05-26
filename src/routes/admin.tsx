import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, BookOpen, Package, Download, MessageSquare, ClipboardList, History, LogOut, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/flashcards", label: "Flashcards", icon: BookOpen },
  { to: "/admin/products", label: "Produtos", icon: Package },
  { to: "/admin/downloads", label: "Downloads", icon: Download },
  { to: "/admin/testimonials", label: "Depoimentos", icon: MessageSquare },
  { to: "/admin/assessments", label: "Avaliações", icon: ClipboardList },
  { to: "/admin/attempts", label: "Histórico", icon: History },
  { to: "/admin/users", label: "Usuários", icon: Users },
];

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) return <div className="min-h-screen grid place-items-center">Carregando...</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center px-5">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">
            Você não tem permissão de admin. Peça para um administrador conceder a role <code>admin</code> ao seu usuário.
          </p>
          <Link to="/" className="inline-block mt-6 text-primary underline">Voltar ao site</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card p-5 flex flex-col">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground mb-6">← Site</Link>
        <h2 className="text-xl font-display font-bold mb-6">Admin</h2>
        <nav className="flex-1 space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                activeOptions={{ exact: it.exact }}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Icon size={16} /> {it.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut size={16} /> Sair
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
