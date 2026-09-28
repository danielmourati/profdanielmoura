import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importAssessmentQuestions } from "@/lib/assessments.functions";

export const Route = createFileRoute("/admin/assessments/$id")({
  head: () => ({ meta: [{ title: "Gerenciar avaliação — Prof. Daniel Moura" }, { name: "description", content: "Gerencie perguntas e faixas da avaliação diagnóstica." }, { property: "og:title", content: "Gerenciar avaliação — Prof. Daniel Moura" }, { property: "og:description", content: "Gerencie perguntas e faixas da avaliação diagnóstica." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: P,
});

function P() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const assessment = useQuery({
    queryKey: ["assessment", id],
    queryFn: async () => {
      const { data } = await supabase.from("assessments").select("*").eq("id", id).single();
      return data;
    },
  });

  const questions = useQuery({
    queryKey: ["assessment_questions", id],
    queryFn: async () => {
      const { data } = await supabase.from("assessment_questions").select("*").eq("assessment_id", id).order("order_index");
      return data ?? [];
    },
  });

  const bands = useQuery({
    queryKey: ["score_bands", id],
    queryFn: async () => {
      const { data } = await supabase.from("score_bands").select("*").eq("assessment_id", id).order("min_score");
      return data ?? [];
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <Link to="/admin/assessments" className="text-sm text-muted-foreground hover:text-foreground">← Voltar</Link>
        <h1 className="text-3xl font-display font-bold mt-2">{assessment.data?.title ?? "Avaliação"}</h1>
        <p className="text-muted-foreground">{assessment.data?.description}</p>
      </div>

      <QuestionsEditor assessmentId={id} items={questions.data ?? []} onChange={() => qc.invalidateQueries({ queryKey: ["assessment_questions", id] })} />
      <BandsEditor assessmentId={id} items={bands.data ?? []} onChange={() => qc.invalidateQueries({ queryKey: ["score_bands", id] })} />
    </div>
  );
}

function QuestionsEditor({ assessmentId, items, onChange }: { assessmentId: string; items: any[]; onChange: () => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState([
    { id: "a", text: "" }, { id: "b", text: "" }, { id: "c", text: "" }, { id: "d", text: "" },
  ]);
  const [correct, setCorrect] = useState("a");
  const [importFile, setImportFile] = useState("");
  const [importRows, setImportRows] = useState<AssessmentImportRow[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const runImport = useServerFn(importAssessmentQuestions);

  const resetForm = () => {
    setQ("");
    setOpts([{ id: "a", text: "" }, { id: "b", text: "" }, { id: "c", text: "" }, { id: "d", text: "" }]);
    setCorrect("a");
    setEditingId(null);
    setOpen(false);
  };

  const save = useMutation({
    mutationFn: async () => {
      const values = {
        assessment_id: assessmentId,
        question: q.trim(),
        options: opts as any,
        correct_option_id: correct,
      };
      const { error } = editingId
        ? await supabase.from("assessment_questions").update(values).eq("id", editingId)
        : await supabase.from("assessment_questions").insert({ ...values, order_index: items.length });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editingId ? "Pergunta atualizada" : "Pergunta adicionada");
      resetForm();
      onChange();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const startCreating = () => {
    resetForm();
    setOpen(true);
  };

  const startEditing = (item: any) => {
    const savedOptions = Array.isArray(item.options) ? item.options : [];
    setQ(item.question ?? "");
    setOpts(["a", "b", "c", "d"].map((id) => ({
      id,
      text: savedOptions.find((option: any) => option.id === id)?.text ?? "",
    })));
    setCorrect(item.correct_option_id ?? "a");
    setEditingId(item.id);
    setOpen(true);
  };

  const del = useMutation({
    mutationFn: async (qid: string) => {
      const { error } = await supabase.from("assessment_questions").delete().eq("id", qid);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Pergunta excluída"); onChange(); },
    onError: (e: any) => toast.error(e.message),
  });

  const importMutation = useMutation({
    mutationFn: () => runImport({ data: { assessmentId, rows: importRows } }),
    onSuccess: (result) => {
      toast.success(`${result.imported} perguntas importadas`);
      closeImport();
      onChange();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const closeImport = () => {
    setImportFile("");
    setImportRows([]);
    setImportErrors([]);
  };

  const readCsv = async (file: File) => {
    const text = await file.text();
    const parsed = parseSemicolonCsv(text.replace(/^\uFEFF/, ""));
    const errors: string[] = [];
    const expected = ["pergunta", "alternativa_a", "alternativa_b", "alternativa_c", "alternativa_d", "resposta_correta"];
    const headers = (parsed[0] ?? []).map(normalizeHeader);
    const missing = expected.filter((header) => !headers.includes(header));
    if (missing.length) errors.push(`Cabeçalhos ausentes: ${missing.join(", ")}.`);

    const rows = parsed.slice(1).filter((cells) => cells.some((cell) => cell.trim())).map((cells, index) => {
      const value = (header: string) => cells[headers.indexOf(header)]?.trim() ?? "";
      const question = value("pergunta").replace(/^\s*\d+[.)-]?\s*/, "").trim();
      const optionIds = ["a", "b", "c", "d"] as const;
      const options = optionIds.map((id) => ({
        id,
        text: value(`alternativa_${id}`).replace(new RegExp(`^\\s*${id}[.)-]?\\s*`, "i"), "").trim(),
      }));
      const correct_option_id = value("resposta_correta").toLowerCase().replace(/[^a-d]/g, "") as "a" | "b" | "c" | "d";
      const line = index + 2;
      if (!question) errors.push(`Linha ${line}: pergunta vazia.`);
      options.forEach((option) => { if (!option.text) errors.push(`Linha ${line}: alternativa ${option.id.toUpperCase()} vazia.`); });
      if (!optionIds.includes(correct_option_id)) errors.push(`Linha ${line}: resposta correta deve ser A, B, C ou D.`);
      return { question, options, correct_option_id };
    });
    if (!rows.length) errors.push("O arquivo não contém perguntas.");
    setImportFile(file.name);
    setImportRows(rows);
    setImportErrors(errors);
  };

  const isValid = q.trim().length > 0 && opts.every((option) => option.text.trim().length > 0);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-display font-bold">Perguntas</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => fileInput.current?.click()} disabled={importMutation.isPending}>
            <FileUp /> Importar CSV
          </Button>
          <input ref={fileInput} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readCsv(file); event.target.value = ""; }} />
          <Button onClick={startCreating} disabled={save.isPending}>
            <Plus /> Nova pergunta
          </Button>
        </div>
      </div>

      {importFile && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="assessment-import-title" className="w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="assessment-import-title" className="text-xl font-display font-bold">Confirmar importação</h3>
                <p className="mt-1 text-sm text-muted-foreground">{importFile} · {importRows.length} perguntas encontradas</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Fechar importação" onClick={closeImport}><X /></Button>
            </div>
            {importErrors.length ? (
              <div className="mt-5 max-h-56 overflow-auto rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                <p className="font-semibold">Corrija o arquivo antes de importar:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">{importErrors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>
              </div>
            ) : (
              <p className="mt-5 rounded-md border border-success/40 bg-success/10 p-4 text-sm text-success">Arquivo validado. As perguntas serão adicionadas ao final da avaliação.</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={closeImport} disabled={importMutation.isPending}>Cancelar</Button>
              <Button onClick={() => importMutation.mutate()} disabled={importErrors.length > 0 || !importRows.length || importMutation.isPending}>
                {importMutation.isPending ? "Importando..." : `Importar ${importRows.length} perguntas`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-4 space-y-3">
          <div>
            <h3 className="font-semibold">{editingId ? "Editar pergunta" : "Nova pergunta"}</h3>
            <p className="text-xs text-muted-foreground">Marque a alternativa correta antes de salvar.</p>
          </div>
          <textarea value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pergunta" aria-label="Enunciado da pergunta" rows={2} className="w-full bg-background border border-border rounded-md px-3 py-2" />
          {opts.map((o, i) => (
            <div key={o.id} className="flex items-center gap-2">
              <input type="radio" name="correct-option" aria-label={`Marcar alternativa ${o.id.toUpperCase()} como correta`} checked={correct === o.id} onChange={() => setCorrect(o.id)} />
              <span className="w-6 font-mono uppercase">{o.id}</span>
              <input
                value={o.text}
                onChange={(e) => { const next = [...opts]; next[i] = { ...o, text: e.target.value }; setOpts(next); }}
                placeholder={`Alternativa ${o.id.toUpperCase()}`}
                className="flex-1 bg-background border border-border rounded-md px-3 py-2"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button onClick={resetForm} disabled={save.isPending} className="px-4 py-2 text-sm disabled:opacity-60">Cancelar</button>
            <button onClick={() => save.mutate()} disabled={!isValid || save.isPending} className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full disabled:opacity-60">
              {save.isPending ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={it.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Pergunta {idx + 1}</div>
              <div className="font-medium">{it.question}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Correta: {it.correct_option_id?.toUpperCase()} — {(it.options as any[])?.find((o) => o.id === it.correct_option_id)?.text}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button aria-label={`Editar pergunta ${idx + 1}`} title="Editar" onClick={() => startEditing(it)} disabled={save.isPending || del.isPending} className="p-2 hover:bg-muted rounded disabled:opacity-50">
                <Pencil size={14} />
              </button>
              <button aria-label={`Excluir pergunta ${idx + 1}`} title="Excluir" onClick={() => { if (confirm("Excluir esta pergunta?")) del.mutate(it.id); }} disabled={save.isPending || del.isPending} className="p-2 text-destructive hover:bg-muted rounded disabled:opacity-50">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-muted-foreground">Nenhuma pergunta ainda.</div>}
      </div>
    </section>
  );
}

type AssessmentImportRow = {
  question: string;
  options: Array<{ id: "a" | "b" | "c" | "d"; text: string }>;
  correct_option_id: "a" | "b" | "c" | "d";
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
}

function parseSemicolonCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === ";" && !quoted) {
      row.push(cell); cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function BandsEditor({ assessmentId, items, onChange }: { assessmentId: string; items: any[]; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ min_score: 0, max_score: 40, label: "", message: "", color: "destructive" });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("score_bands").insert({ assessment_id: assessmentId, ...form, order_index: items.length });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Faixa criada"); setOpen(false); onChange(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (bid: string) => {
      const { error } = await supabase.from("score_bands").delete().eq("id", bid);
      if (error) throw error;
    },
    onSuccess: () => { onChange(); },
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Faixas de score</h2>
          <p className="text-sm text-muted-foreground">Defina mensagens por faixa de % de acertos (0-100).</p>
        </div>
        <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-semibold px-4 py-2 rounded-full">
          <Plus size={16} /> Nova faixa
        </button>
      </div>

      {open && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-4 grid md:grid-cols-2 gap-3">
          <div><label className="text-sm">Mín %</label><input type="number" value={form.min_score} onChange={(e) => setForm({ ...form, min_score: Number(e.target.value) })} className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2" /></div>
          <div><label className="text-sm">Máx %</label><input type="number" value={form.max_score} onChange={(e) => setForm({ ...form, max_score: Number(e.target.value) })} className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2" /></div>
          <div><label className="text-sm">Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2" /></div>
          <div><label className="text-sm">Cor</label>
            <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2">
              <option value="destructive">Vermelho</option><option value="accent">Amarelo</option><option value="primary">Azul</option><option value="success">Verde</option>
            </select>
          </div>
          <div className="md:col-span-2"><label className="text-sm">Mensagem</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={2} className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2" /></div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm">Cancelar</button>
            <button onClick={() => create.mutate()} className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full">Salvar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">{b.min_score}%–{b.max_score}% · <span className="text-primary">{b.label}</span></div>
              <div className="text-sm text-muted-foreground">{b.message}</div>
            </div>
            <button onClick={() => del.mutate(b.id)} className="p-2 text-destructive hover:bg-muted rounded"><Trash2 size={14} /></button>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-muted-foreground">Nenhuma faixa ainda.</div>}
      </div>
    </section>
  );
}
