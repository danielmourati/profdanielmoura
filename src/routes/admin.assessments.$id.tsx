import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/assessments/$id")({ component: P });

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
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState([
    { id: "a", text: "" }, { id: "b", text: "" }, { id: "c", text: "" }, { id: "d", text: "" },
  ]);
  const [correct, setCorrect] = useState("a");

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("assessment_questions").insert({
        assessment_id: assessmentId,
        question: q,
        options: opts as any,
        correct_option_id: correct,
        order_index: items.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pergunta adicionada");
      setQ(""); setOpts([{ id: "a", text: "" }, { id: "b", text: "" }, { id: "c", text: "" }, { id: "d", text: "" }]); setCorrect("a"); setOpen(false);
      onChange();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (qid: string) => {
      const { error } = await supabase.from("assessment_questions").delete().eq("id", qid);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Excluída"); onChange(); },
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-display font-bold">Perguntas</h2>
        <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-semibold px-4 py-2 rounded-full">
          <Plus size={16} /> Nova pergunta
        </button>
      </div>

      {open && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-4 space-y-3">
          <textarea value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pergunta" rows={2} className="w-full bg-background border border-border rounded-md px-3 py-2" />
          {opts.map((o, i) => (
            <div key={o.id} className="flex items-center gap-2">
              <input type="radio" checked={correct === o.id} onChange={() => setCorrect(o.id)} />
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
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm">Cancelar</button>
            <button onClick={() => create.mutate()} disabled={!q || opts.some((o) => !o.text)} className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full disabled:opacity-60">
              Adicionar
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
            <button onClick={() => { if (confirm("Excluir?")) del.mutate(it.id); }} className="p-2 text-destructive hover:bg-muted rounded">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-muted-foreground">Nenhuma pergunta ainda.</div>}
      </div>
    </section>
  );
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
