import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "select" | "checkbox" | "file";
  options?: { value: string; label: string }[];
  required?: boolean;
  bucket?: string;
  fileNameField?: string;
};

type Props<T extends { id: string }> = {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  columns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode }[];
  orderBy?: string;
  defaults?: Record<string, any>;
};

export function CrudTable<T extends { id: string }>({
  table, title, description, fields, columns, orderBy = "order_index", defaults = {},
}: Props<T>) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order(orderBy);
      if (error) throw error;
      return (data ?? []) as unknown as T[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from(table as any).upsert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      setEditing(null);
      setCreating(false);
      toast.success("Salvo!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Excluído");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex items-center gap-2 bg-gradient-cta text-accent-foreground font-semibold px-4 py-2 rounded-full"
        >
          <Plus size={16} /> Novo
        </button>
      </div>

      {showForm && (
        <CrudForm
          fields={fields}
          initial={editing ?? defaults}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSubmit={(values) => upsert.mutate(editing ? { ...values, id: editing.id } : values)}
          submitting={upsert.isPending}
        />
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum registro</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {columns.map((c) => <th key={String(c.key)} className="text-left px-4 py-3 font-medium">{c.label}</th>)}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3 text-sm">
                      {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditing(row); setCreating(false); }} className="p-2 hover:bg-muted rounded"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm("Excluir?")) del.mutate(row.id); }} className="p-2 hover:bg-muted rounded text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CrudForm({
  fields, initial, onCancel, onSubmit, submitting,
}: {
  fields: Field[];
  initial: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState<any>(initial);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(values); }}
      className="mb-6 bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
            <label className="text-sm font-medium">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                required={f.required}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                rows={3}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2"
              />
            ) : f.type === "select" ? (
              <select
                required={f.required}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2"
              >
                <option value="">Selecione...</option>
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "checkbox" ? (
              <div className="mt-2">
                <input
                  type="checkbox"
                  checked={!!values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })}
                />
              </div>
            ) : f.type === "file" ? (
              <FileUploadInput
                field={f}
                value={values[f.name] ?? ""}
                onUploaded={(url, filename) => {
                  const next: any = { ...values, [f.name]: url };
                  if (f.fileNameField && filename) next[f.fileNameField] = filename;
                  setValues(next);
                }}
              />
            </div>
            ) : (
            ) : (
              <input
                required={f.required}
                type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues({ ...values, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button>
        <button type="submit" disabled={submitting} className="bg-gradient-cta text-accent-foreground font-semibold px-5 py-2 rounded-full disabled:opacity-60">
          {submitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
