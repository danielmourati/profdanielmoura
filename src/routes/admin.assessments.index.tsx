import { createFileRoute, Link } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/assessments")({ component: P });

function P() {
  return (
    <CrudTable
      table="assessments"
      orderBy="created_at"
      title="Avaliações Diagnósticas"
      description="Cadastre avaliações. Clique em editar para gerenciar perguntas e faixas de score."
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "active", label: "Ativa", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Título" },
        { key: "slug", label: "Slug" },
        { key: "active", label: "Ativa", render: (r: any) => r.active ? "Sim" : "Não" },
        {
          key: "id", label: "Gerenciar", render: (r: any) => (
            <Link to="/admin/assessments/$id" params={{ id: r.id }} className="text-primary underline text-xs">
              Perguntas & Faixas →
            </Link>
          ),
        },
      ]}
      defaults={{ active: true, description: "" }}
    />
  );
}
