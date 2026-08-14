import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contactos")({
  head: () => ({
    meta: [
      { title: "Contactos — Laser4y" },
      {
        name: "description",
        content:
          "Fale com a Laser4y: orçamentos de corte e gravação a laser, sublimação e impressão 3D.",
      },
      { property: "og:title", content: "Contactos — Laser4y" },
      { property: "og:description", content: "Peça um orçamento para o seu projeto personalizado." },
    ],
  }),
  component: Contactos,
});

const field =
  "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

function Contactos() {
  const [sending, setSending] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Contactos"
          title="Vamos falar do seu projeto"
          intro="Responda em minutos: descreva a ideia, os materiais e as quantidades."
        />

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Onde nos encontra</p>
            <ul className="mt-8 space-y-6 text-sm">
              {[
                { Icon: Mail, label: "Email", value: "geral@laser4y.pt" },
                { Icon: Phone, label: "Telefone", value: "+351 910 000 000" },
                { Icon: MapPin, label: "Oficina", value: "Portugal · visitas por marcação" },
                { Icon: Clock, label: "Horário", value: "Seg a Sex · 09h00 – 18h00" },
              ].map(({ Icon, label, value }) => (
                <li key={label} className="flex gap-4 border-b border-border/60 pb-6">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1.5 text-foreground">{value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-12">Redes sociais</p>
            <div className="mt-5 flex gap-3">
              {[
                { href: "https://facebook.com/Laser4y", Icon: Facebook, label: "Facebook" },
                { href: "https://instagram.com/Laser4y", Icon: Instagram, label: "Instagram" },
                {
                  href: "https://www.linkedin.com/company/laser4y",
                  Icon: Linkedin,
                  label: "LinkedIn",
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <Icon className="size-4" /> {label}
                </a>
              ))}
            </div>
          </div>

          <form
            className="border border-border/70 bg-card p-8 sm:p-10"
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              const form = e.currentTarget;
              setTimeout(() => {
                setSending(false);
                form.reset();
                toast.success("Mensagem enviada", {
                  description: "Entramos em contacto brevemente.",
                });
              }, 600);
            }}
          >
            <h2 className="font-display text-xl">Enviar mensagem</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Nome
                <input required name="nome" className={`mt-2 ${field}`} placeholder="O seu nome" />
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className={`mt-2 ${field}`}
                  placeholder="email@exemplo.pt"
                />
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground sm:col-span-2">
                Serviço
                <select name="servico" className={`mt-2 ${field}`} defaultValue="">
                  <option value="" disabled>
                    Selecione um serviço
                  </option>
                  <option>Corte e gravação a laser</option>
                  <option>Sublimação</option>
                  <option>Impressão 3D</option>
                  <option>Outro / projeto misto</option>
                </select>
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground sm:col-span-2">
                Mensagem
                <textarea
                  required
                  name="mensagem"
                  rows={5}
                  className={`mt-2 ${field} resize-none`}
                  placeholder="Descreva o projeto, materiais e quantidades"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-8 w-full rounded-sm bg-primary py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity disabled:opacity-60"
            >
              {sending ? "A enviar…" : "Enviar mensagem"}
            </button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
