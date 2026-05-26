import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/flashcards")({
  component: AdminFlashcards,
});

function AdminFlashcards() {
  const { data: cats = [] } = useQuery({
    queryKey: ["flashcard_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("flashcard_categories").select("*").order("order_index");
      return data ?? [];
    },
  });

  return (
    <div className="space-y-12">
      <CrudTable
        table="flashcard_categories"
        title="Categorias de Flashcards"
        fields={[
          { name: "name", label: "Nome", required: true },
          { name: "slug", label: "Slug", required: true },
          { name: "order_index", label: "Ordem", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Nome" },
          { key: "slug", label: "Slug" },
          { key: "order_index", label: "Ordem" },
        ]}
        defaults={{ order_index: 0 }}
      />

      <CrudTable
        table="flashcards"
        title="Flashcards"
        description="Perguntas e respostas com 3 níveis de dificuldade."
        fields={[
          {
            name: "category_id", label: "Categoria", type: "select", required: true,
            options: cats.map((c: any) => ({ value: c.id, label: c.name })),
          },
          {
            name: "difficulty", label: "Dificuldade", type: "select", required: true,
            options: [
              { value: "facil", label: "Fácil" },
              { value: "medio", label: "Médio" },
              { value: "dificil", label: "Difícil" },
            ],
          },
          { name: "question", label: "Pergunta", type: "textarea", required: true },
          { name: "answer", label: "Resposta", type: "textarea", required: true },
          { name: "order_index", label: "Ordem", type: "number" },
        ]}
        columns={[
          { key: "question", label: "Pergunta", render: (r: any) => r.question.slice(0, 60) + (r.question.length > 60 ? "..." : "") },
          { key: "answer", label: "Resposta", render: (r: any) => r.answer.slice(0, 40) },
          { key: "difficulty", label: "Nível" },
        ]}
        defaults={{ difficulty: "medio", order_index: 0 }}
      />
    </div>
  );
}
