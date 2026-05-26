import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/products")({ component: P });

function P() {
  return (
    <CrudTable
      table="products"
      title="Produtos Digitais"
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "price_cents", label: "Preço (centavos)", type: "number" },
        { name: "image_url", label: "Imagem (URL)", type: "url" },
        { name: "checkout_url", label: "Link de checkout", type: "url" },
        { name: "badge", label: "Selo" },
        { name: "accent", label: "Cor (classe gradient)" },
        { name: "order_index", label: "Ordem", type: "number" },
        { name: "active", label: "Ativo", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Título" },
        { key: "price_cents", label: "Preço (¢)" },
        { key: "active", label: "Ativo", render: (r: any) => r.active ? "Sim" : "Não" },
      ]}
      defaults={{ active: true, order_index: 0, accent: "from-primary to-accent", checkout_url: "#" }}
    />
  );
}
