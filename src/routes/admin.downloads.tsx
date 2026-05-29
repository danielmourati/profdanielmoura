import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/downloads")({ component: P });

function P() {
  return (
    <CrudTable
      table="downloads"
      title="Downloads"
      description="Arquivos disponíveis na página /downloads."
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "file_url", label: "Arquivo", type: "file", required: true, bucket: "downloads", fileNameField: "file_name" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "file_name", label: "Nome do arquivo", required: true },
        { name: "file_type", label: "Tipo (ex: PDF, XLSX)" },
        { name: "icon", label: "Ícone (lucide name)" },
        { name: "order_index", label: "Ordem", type: "number" },
        { name: "active", label: "Ativo", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Título" },
        { key: "file_type", label: "Tipo" },
        { key: "active", label: "Ativo", render: (r: any) => r.active ? "Sim" : "Não" },
      ]}
      defaults={{ active: true, order_index: 0, file_type: "FILE", icon: "file" }}
    />
  );
}
