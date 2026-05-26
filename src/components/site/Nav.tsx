import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoProf from "@/assets/logo-prof.png";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "./UserMenu";

const links = [
  { id: "inicio", label: "Início", href: "/#inicio" },
  { id: "sobre", label: "Sobre", href: "/#sobre" },
  { id: "avaliacao", label: "Avaliação", href: "/avaliacao" },
  { id: "flashcards", label: "Flashcards", href: "/flashcards" },
  { id: "produtos", label: "Produtos", href: "/#produtos" },
  { id: "downloads", label: "Downloads", href: "/downloads" },
  { id: "contato", label: "Contato", href: "/#contato" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 lg:h-24 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center" aria-label="Prof. Daniel Moura">
          <img src={logoProf} alt="Prof. Daniel Moura" className="h-16 lg:h-[4.5rem] w-auto" />
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          {isAdmin && (
            <a href="/admin" className="text-sm font-semibold text-primary hover:text-primary/80 px-3">
              Admin
            </a>
          )}
          {user ? (
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground px-3">
              Sair
            </button>
          ) : (
            <a href="/login" className="text-sm text-muted-foreground hover:text-foreground px-3">
              Entrar
            </a>
          )}
          <a
            href="/avaliacao"
            className="bg-gradient-cta text-accent-foreground font-semibold text-sm px-5 py-2.5 rounded-full hover:scale-105 transition-transform shadow-glow"
          >
            Avaliação grátis
          </a>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden size-10 grid place-items-center rounded-md border border-border"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <ul className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-md text-foreground hover:bg-muted"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {isAdmin && (
              <a href="/admin" onClick={() => setOpen(false)} className="block px-3 py-3 text-primary font-semibold">
                Admin
              </a>
            )}
            {user ? (
              <button onClick={() => { setOpen(false); signOut(); }} className="text-left px-3 py-3 text-muted-foreground">
                Sair
              </button>
            ) : (
              <a href="/login" onClick={() => setOpen(false)} className="block px-3 py-3 text-muted-foreground">
                Entrar
              </a>
            )}
            <a
              href="/avaliacao"
              onClick={() => setOpen(false)}
              className="mt-2 text-center bg-gradient-cta text-accent-foreground font-semibold px-5 py-3 rounded-full"
            >
              Avaliação grátis
            </a>
          </ul>
        </div>
      )}
    </header>
  );
}
