import { createFileRoute } from "@tanstack/react-router";
import { Quote, Star } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/testemunhos")({
  head: () => ({
    meta: [
      { title: "Testemunhos de Clientes — Laser4y" },
      {
        name: "description",
        content:
          "O que dizem os clientes da Laser4y sobre corte e gravação a laser, sublimação e impressão 3D.",
      },
      { property: "og:title", content: "Testemunhos — Laser4y" },
      { property: "og:description", content: "Reviews e provas sociais de clientes Laser4y." },
    ],
  }),
  component: Testemunhos,
});

const reviews = [
  {
    name: "Marta Ribeiro",
    role: "Wedding Planner",
    text: "Os convites e a sinalética em acrílico ficaram impecáveis. Detalhe finíssimo e entrega antes do prazo.",
  },
  {
    name: "Nuno Carvalho",
    role: "Gerente, Adega do Vale",
    text: "Gravaram 300 caixas de madeira com o nosso logótipo. Consistência perfeita em toda a série.",
  },
  {
    name: "Sofia Antunes",
    role: "Designer de Produto",
    text: "Prototiparam quatro versões em 3D numa semana. Feedback técnico que melhorou mesmo a peça.",
  },
  {
    name: "Ricardo Melo",
    role: "Diretor de Marketing",
    text: "Merchandising sublimado para uma feira: cores vivas e acabamento que aguentou o evento todo.",
  },
  {
    name: "Ana Pinto",
    role: "Arquiteta",
    text: "Maquetes cortadas a laser com uma precisão que nunca tinha conseguido noutro fornecedor.",
  },
  {
    name: "Tiago Sousa",
    role: "Proprietário, Café Norte",
    text: "Sinalética interior completa em metal gravado. Elevou totalmente o espaço.",
  },
];

function Testemunhos() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Provas sociais"
          title="Confiança construída peça a peça"
          intro="Projetos entregues a particulares, marcas e estúdios de design em todo o país."
        />

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure
                key={r.name}
                className="flex flex-col justify-between border border-border/70 bg-card p-8 transition-colors hover:border-primary/50"
              >
                <Quote className="size-5 text-primary" />
                <blockquote className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-8 border-t border-border/60 pt-5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-3 font-display text-sm">{r.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {r.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="grid-etch border-t border-border/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-16 sm:px-8 lg:grid-cols-4">
            {[
              ["4.9/5", "Avaliação média"],
              ["+500", "Projetos entregues"],
              ["+120", "Clientes empresariais"],
              ["98%", "Recomendam"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-3xl text-gold-gradient">{v}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
