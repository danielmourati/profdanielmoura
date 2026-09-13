import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, FileUp, X } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { importQuestions } from "@/lib/admin-data.functions";

export const Route = createFileRoute("/admin/questions")({ component: P });

function P() {
  const importPanel = <QuestionImport />;
  return (
    <CrudTable
      table="questions"
      orderBy="created_at"
      title="Banco de Questões"
      description="Cadastre questões de múltipla escolha. Os alunos resolvem em /banco-de-questoes."
      headerActions={importPanel}
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
        { name: "active", label: "Ativa", type: "toggle" },
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

const fields = ["statement", "option_a", "option_b", "option_c", "option_d", "option_e", "correct_option", "comment", "discipline", "subject", "area", "exam", "organization", "city", "role", "education", "banca", "year", "difficulty", "active"];

function QuestionImport() {
  const input = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const runImport = useServerFn(importQuestions);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: () => runImport({ data: { rows } }),
    onSuccess: (result) => {
      toast.success(`${result.imported} questões importadas`);
      setRows([]); setFileName(""); setErrors([]);
      qc.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function readFile(file: File) {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return;
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: "" });
    const issues: string[] = [];
    const parsed = raw.map((row, index) => {
      const normalized: Record<string, unknown> = {};
      fields.forEach((field) => normalized[field] = row[field] ?? "");
      normalized.correct_option = String(normalized.correct_option).trim().toLowerCase();
      normalized.difficulty = String(normalized.difficulty).trim().toLowerCase();
      normalized.active = !["false", "0", "não", "nao"].includes(String(normalized.active).trim().toLowerCase());
      normalized.year = String(normalized.year).trim() ? Number(normalized.year) : null;
      normalized.option_e = String(normalized.option_e).trim() || null;
      normalized.banca = String(normalized.banca).trim() || null;
      const missing = ["statement", "option_a", "option_b", "option_c", "option_d"].filter((key) => !String(normalized[key]).trim());
      if (missing.length) issues.push(`Linha ${index + 2}: campos obrigatórios ausentes (${missing.join(", ")}).`);
      if (!["a", "b", "c", "d", "e"].includes(String(normalized.correct_option))) issues.push(`Linha ${index + 2}: resposta correta inválida.`);
      if (!["facil", "medio", "dificil"].includes(String(normalized.difficulty))) issues.push(`Linha ${index + 2}: dificuldade inválida.`);
      if (normalized.correct_option === "e" && !normalized.option_e) issues.push(`Linha ${index + 2}: alternativa E é a correta, mas está vazia.`);
      if (normalized.year !== null && (!Number.isInteger(normalized.year) || Number(normalized.year) < 1900 || Number(normalized.year) > 2200)) issues.push(`Linha ${index + 2}: ano inválido.`);
      return normalized;
    });
    setFileName(file.name); setRows(parsed); setErrors(issues);
  }

  return <>
    <div className="flex flex-wrap gap-2">
      <div className="relative group">
        <a href="/downloads/modelo-importacao-questoes.xlsx" download className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"><Download size={15} /> Modelo Excel</a>
        <a href="/downloads/modelo-importacao-questoes.csv" download className="ml-1 inline-flex items-center rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">CSV</a>
      </div>
      <button onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 text-sm text-primary hover:bg-primary/10"><FileUp size={15} /> Importar</button>
      <input ref={input} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); event.target.value = ""; }} />
    </div>
    {fileName && <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Confirmar importação</h2><p className="mt-1 text-sm text-muted-foreground">{fileName} · {rows.length} linhas encontradas</p></div><button aria-label="Fechar" onClick={() => { setFileName(""); setRows([]); setErrors([]); }}><X size={18} /></button></div>
        {errors.length > 0 ? <div className="mt-5 max-h-52 overflow-auto border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"><p className="font-bold">Corrija antes de importar:</p><ul className="mt-2 list-disc pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div> : <p className="mt-5 border border-success/40 bg-success/10 p-4 text-sm text-success">Arquivo validado e pronto para importação.</p>}
        <div className="mt-6 flex justify-end gap-2"><button onClick={() => { setFileName(""); setRows([]); setErrors([]); }} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button><button disabled={errors.length > 0 || rows.length === 0 || mutation.isPending} onClick={() => mutation.mutate()} className="rounded-md bg-gradient-cta px-5 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50">{mutation.isPending ? "Importando..." : "Importar questões"}</button></div>
      </div>
    </div>}
  </>;
}
