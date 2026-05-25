import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoProf from "@/assets/logo-prof.png";

const links = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "avaliacao", label: "Avaliação Gratuita" },
  { id: "apostila", label: "Apostila ACS 2026" },
  { id: "flashcards", label: "Flashcards" },
  { id: "produtos", label: "Produtos" },
  { id: "downloads", label: "Downloads" },
  { id: "contato", label: "Contato" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2 font-display font-bold text-lg" aria-label="Prof. Daniel Moura">
          <img src={logoProf} alt="Prof. Daniel Moura" className="h-9 lg:h-10 w-auto" />
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active === l.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#avaliacao"
          className="hidden lg:inline-flex bg-gradient-cta text-accent-foreground font-semibold text-sm px-5 py-2.5 rounded-full hover:scale-105 transition-transform shadow-glow"
        >
          Avaliação grátis
        </a>

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
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-md text-foreground hover:bg-muted"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <a
              href="#avaliacao"
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
