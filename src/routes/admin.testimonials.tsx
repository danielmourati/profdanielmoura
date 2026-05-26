import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/testimonials")({ component: P });

function P() {
  return (
    <CrudTable
      table="testimonials"
      title="Depoimentos"
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "role", label: "Cargo/Concurso" },
        { name: "content", label: "Depoimento", type: "textarea", required: true },
        { name: "avatar_url", label: "Avatar (URL)", type: "url" },
        { name: "rating", label: "Estrelas (1-5)", type: "number" },
        { name: "order_index", label: "Ordem", type: "number" },
        { name: "active", label: "Ativo", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Nome" },
        { key: "role", label: "Cargo" },
        { key: "rating", label: "★" },
        { key: "active", label: "Ativo", render: (r: any) => r.active ? "Sim" : "Não" },
      ]}
      defaults={{ active: true, rating: 5, order_index: 0 }}
    />
  );
}
