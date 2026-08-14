import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/registo")({
  head: () => ({
    meta: [
      { title: "Registo de Cliente — Laser4y" },
      {
        name: "description",
        content:
          "Crie a sua conta Laser4y e acompanhe orçamentos e projetos de fabrico digital personalizado.",
      },
      { property: "og:title", content: "Registo de Cliente — Laser4y" },
      { property: "og:description", content: "Registe-se para pedir orçamentos e acompanhar projetos." },
    ],
  }),
  component: Registo,
});

const field =
  "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

function Registo() {
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Formulário de registo"
          title="Crie a sua conta Laser4y"
          intro="Registe-se para pedir orçamentos, guardar ficheiros e acompanhar o estado dos seus projetos."
        />

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Vantagens</p>
            <ul className="mt-8 space-y-5">
              {[
                "Orçamentos com resposta prioritária",
                "Histórico de projetos e ficheiros",
                "Condições especiais para empresas",
                "Acesso antecipado a novos materiais",
              ].map((v) => (
                <li key={v} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {v}
                </li>
              ))}
            </ul>
          </div>

          {done ? (
            <div className="flex flex-col items-start justify-center border border-primary/40 bg-card p-10">
              <Check className="size-7 text-primary" />
              <h2 className="mt-5 font-display text-2xl">Registo concluído</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Obrigado. Recebemos os seus dados e entraremos em contacto para validar a conta.
              </p>
              <button
                onClick={() => setDone(false)}
                className="mt-8 rounded-sm border border-primary/50 px-6 py-3 font-display text-[0.7rem] uppercase tracking-[0.2em] text-primary"
              >
                Novo registo
              </button>
            </div>
          ) : (
            <form
              className="border border-border/70 bg-card p-8 sm:p-10"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                toast.success("Registo submetido com sucesso");
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelCls}>
                  Nome
                  <input required name="nome" className={`mt-2 ${field}`} placeholder="Nome" />
                </label>
                <label className={labelCls}>
                  Apelido
                  <input required name="apelido" className={`mt-2 ${field}`} placeholder="Apelido" />
                </label>
                <label className={labelCls}>
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    className={`mt-2 ${field}`}
                    placeholder="email@exemplo.pt"
                  />
                </label>
                <label className={labelCls}>
                  Telefone
                  <input
                    name="telefone"
                    className={`mt-2 ${field}`}
                    placeholder="+351 900 000 000"
                  />
                </label>
                <label className={labelCls}>
                  Tipo de cliente
                  <select name="tipo" className={`mt-2 ${field}`} defaultValue="Particular">
                    <option>Particular</option>
                    <option>Empresa</option>
                    <option>Estúdio / Designer</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Empresa / NIF (opcional)
                  <input name="empresa" className={`mt-2 ${field}`} placeholder="Empresa ou NIF" />
                </label>
                <label className={`${labelCls} sm:col-span-2`}>
                  Interesse principal
                  <select name="interesse" className={`mt-2 ${field}`} defaultValue="Corte e gravação a laser">
                    <option>Corte e gravação a laser</option>
                    <option>Sublimação</option>
                    <option>Impressão 3D</option>
                    <option>Vários serviços</option>
                  </select>
                </label>
                <label className={`${labelCls} sm:col-span-2`}>
                  Descreva o seu projeto (opcional)
                  <textarea
                    name="projeto"
                    rows={4}
                    className={`mt-2 ${field} resize-none`}
                    placeholder="Materiais, medidas, quantidades, prazos…"
                  />
                </label>
              </div>

              <label className="mt-7 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input required type="checkbox" name="rgpd" className="mt-0.5 accent-[var(--gold)]" />
                Autorizo o tratamento dos meus dados para efeitos de contacto comercial.
              </label>

              <button
                type="submit"
                className="mt-8 w-full rounded-sm bg-primary py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground"
              >
                Criar conta
              </button>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
