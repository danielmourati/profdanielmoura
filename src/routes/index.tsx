import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Authority } from "@/components/site/Authority";
import { FreeEval } from "@/components/site/FreeEval";
import { Apostila } from "@/components/site/Apostila";
import { Flashcards } from "@/components/site/Flashcards";
import { Products } from "@/components/site/Products";
import { Testimonials } from "@/components/site/Testimonials";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer, WhatsAppFloat } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prof. Daniel Moura — Informática para Concursos Públicos" },
      {
        name: "description",
        content:
          "Apostilas, flashcards e avaliação diagnóstica gratuita de Informática para concursos públicos com o Prof. Daniel Moura. Mais de 15 anos de experiência.",
      },
      { property: "og:title", content: "Prof. Daniel Moura — Informática para Concursos" },
      { property: "og:description", content: "Estude Informática para concursos com método, foco e didática." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <Authority />
      <FreeEval />
      <Apostila />
      <Flashcards />
      <Products />
      <Testimonials />
      <FinalCta />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
