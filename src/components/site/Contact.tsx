import { useState } from "react";
import { Instagram, Mail, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = [
      `Olá, sou ${form.name}.`,
      `E-mail: ${form.email}`,
      form.phone ? `WhatsApp: ${form.phone}` : "",
      `Assunto: ${form.subject}`,
      form.message,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/5586994422827?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contato" className="border-t border-border bg-secondary/30 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Contato</span>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">Vamos conversar?</h2>
          <p className="mt-4 text-muted-foreground">Envie sua dúvida ou fale diretamente pelos nossos canais.</p>
          <div className="mt-8 space-y-4 text-sm">
            <a href="https://wa.me/5586994422827" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-foreground hover:text-accent"><MessageCircle size={20} /> WhatsApp</a>
            <a href="mailto:contato@profdanielmoura.com.br" className="flex items-center gap-3 text-foreground hover:text-accent"><Mail size={20} /> contato@profdanielmoura.com.br</a>
            <a href="#LINK_INSTAGRAM" className="flex items-center gap-3 text-foreground hover:text-accent"><Instagram size={20} /> Instagram</a>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Input required aria-label="Nome" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input required type="email" aria-label="E-mail" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input aria-label="WhatsApp" placeholder="WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input required aria-label="Assunto" placeholder="Assunto" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Textarea required aria-label="Mensagem" placeholder="Mensagem" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2 sm:justify-self-end"><Send size={16} /> Enviar pelo WhatsApp</Button>
        </form>
      </div>
    </section>
  );
}