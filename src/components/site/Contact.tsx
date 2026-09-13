import { motion } from "framer-motion";
import { MessageCircle, Mail, Instagram, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contato" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-bold">Contato</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold">
            Fale com o <span className="text-gradient">Professor</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tem alguma dúvida sobre os materiais ou quer saber mais sobre a mentoria? Escolha o canal de sua preferência.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "WhatsApp",
              desc: "Resposta rápida para dúvidas sobre produtos e cursos.",
              action: "Enviar mensagem",
              href: "https://wa.me/5586994422827",
              color: "bg-success/10 text-success",
            },
            {
              icon: Instagram,
              title: "Instagram",
              desc: "Dicas diárias, questões resolvidas e bastidores.",
              action: "Seguir perfil",
              href: "#LINK_INSTAGRAM",
              color: "bg-primary/10 text-primary",
            },
            {
              icon: Mail,
              title: "E-mail",
              desc: "Para parcerias, suporte técnico e assuntos gerais.",
              action: "Mandar e-mail",
              href: "mailto:contato@profdanielmoura.com.br",
              color: "bg-accent/10 text-accent",
            },
          ].map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all text-center flex flex-col items-center"
            >
              <div className={`size-16 rounded-2xl ${item.color} grid place-items-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">{item.desc}</p>
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {item.action}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
