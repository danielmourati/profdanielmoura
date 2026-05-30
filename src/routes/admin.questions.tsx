import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/questions")({ component: P });

function P() {
  return (
    <CrudTable
      table="questions"
      orderBy="created_at"
      title="Banco de Questões"
      description="Cadastre questões de múltipla escolha. Os alunos resolvem em /banco-de-questoes."
      fields={[
        { name: "statement", label: "Enunciado", type: "textarea", required: true },
        { name: "option_a", label: "Alternativa A", type: "textarea", required: true },
        { name: "option_b", label: "Alternativa B", type: "textarea", required: true },
        { name: "option_c", label: "Alternativa C", type: "textarea", required: true },
        { name: "option_d", label: "Alternativa D", type: "textarea", required: true },
        { name: "option_e", label: "Alternativa E (opcional)", type: "textarea" },
        {
          name: "correct_option", label: "Alternativa correta", type: "select", required: true,
          options: [
            { value: "a", label: "A" }, { value: "b", label: "B" },
            { value: "c", label: "C" }, { value: "d", label: "D" }, { value: "e", label: "E" },
          ],
        },
        { name: "comment", label: "Comentário da questão", type: "textarea" },
        { name: "discipline", label: "Disciplina" },
        { name: "subject", label: "Assunto" },
        { name: "area", label: "Área" },
        { name: "exam", label: "Certame/Seletivo" },
        { name: "city", label: "Cidade" },
        { name: "organization", label: "Órgão" },
        { name: "year", label: "Ano", type: "number" },
        { name: "banca", label: "Banca (opcional)" },
        { name: "role", label: "Cargo" },
        { name: "education", label: "Escolaridade" },
        {
          name: "difficulty", label: "Nível de dificuldade", type: "select", required: true,
          options: [
            { value: "facil", label: "Fácil" },
            { value: "medio", label: "Médio" },
            { value: "dificil", label: "Difícil" },
          ],
        },
        { name: "active", label: "Ativa", type: "checkbox" },
      ]}
      columns={[
        { key: "statement", label: "Enunciado", render: (r: any) => <span className="line-clamp-2 max-w-md inline-block">{r.statement}</span> },
        { key: "discipline", label: "Disciplina" },
        { key: "organization", label: "Órgão" },
        { key: "year", label: "Ano" },
        { key: "difficulty", label: "Nível" },
        { key: "active", label: "Ativa", render: (r: any) => r.active ? "Sim" : "Não" },
      ]}
      defaults={{ active: true, difficulty: "medio", comment: "", discipline: "", subject: "", area: "", exam: "", organization: "", city: "", role: "", education: "" }}
    />
  );
}
