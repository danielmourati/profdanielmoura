import { Instagram, MessageCircle, Mail } from "lucide-react";
import logoProf from "@/assets/logo-prof.png";

export function Footer() {
  return (
    <footer id="contato" className="border-t border-border bg-background py-14">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <img src={logoProf} alt="Prof. Daniel Moura" className="h-10 w-auto" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Informática para Concursos Públicos. Material direto, didático e focado em aprovação.
          </p>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Links rápidos</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["Início", "inicio"],
              ["Sobre", "sobre"],
              ["Avaliação Gratuita", "avaliacao"],
              ["Produtos", "produtos"],
              ["Contato", "contato"],
            ].map(([l, id]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-foreground/80 hover:text-primary transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contato</div>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a href="https://wa.me/5586994422827" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href="#LINK_INSTAGRAM" className="inline-flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors">
              <Instagram size={18} /> Instagram
            </a>
            <a href="mailto:contato@profdanielmoura.com.br" className="inline-flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors">
              <Mail size={18} /> contato@profdanielmoura.com.br
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 pt-6 border-t border-border text-xs text-muted-foreground text-center">
        © 2026 Prof. Daniel Moura. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5586994422827"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-success text-background grid place-items-center shadow-glow hover:scale-110 transition-transform"
    >
      <MessageCircle size={26} />
      <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-20" />
    </a>
  );
}
