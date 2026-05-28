import { motion } from "framer-motion";
import apostilaTablet from "@/assets/apostila-tablet.png";

export function Apostila() {
  return (
    <section id="apostila" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <motion.a
          href="https://pay.kiwify.com.br/hDC71b0"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="block"
        >
          <img
            src={apostilaTablet}
            alt="Apostila Noções de Informática para o concurso ACS/ACE 2026 — Prof. Daniel Moura"
            className="w-full max-w-5xl mx-auto hover:scale-[1.02] transition-transform"
            style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.45))" }}
          />
        </motion.a>
      </div>
    </section>
  );
}
