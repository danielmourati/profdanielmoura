import { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "lgpd-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted) setVisible(true);
    } catch {
      // ignore
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-5">
      <div className="max-w-4xl mx-auto bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-card p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
        <div className="flex-1 flex items-start gap-3">
          <ShieldCheck className="shrink-0 mt-0.5 text-primary" size={22} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Utilizamos cookies e dados pessoais para melhorar sua experiência,
            personalizar conteúdo e analisar tráfego.
            Ao continuar navegando, você concorda com nossa{" "}
            <a
              href="/privacidade"
              className="text-primary underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </a>{" "}
            e com o uso de cookies conforme a LGPD.
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={accept}
            className="flex-1 sm:flex-none bg-gradient-cta text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-glow whitespace-nowrap"
          >
            Entendi
          </button>
          <button
            onClick={accept}
            aria-label="Fechar banner LGPD"
            className="hidden sm:grid place-items-center size-9 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
