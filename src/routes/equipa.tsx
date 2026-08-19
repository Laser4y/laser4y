import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/equipa")({
  head: () => ({
    meta: [
      { title: "Equipa — Laser4y" },
      {
        name: "description",
        content:
          "Conheça a equipa Laser4y: design digital, engenharia, produção laser e impressão 3D.",
      },
      { property: "og:title", content: "Equipa Laser4y" },
      {
        property: "og:description",
        content: "Design, engenharia e produção — as pessoas por trás de cada peça.",
      },
    ],
  }),
  component: Equipa,
});

const team = [
  { initials: "PF", name: "Paulo Ferreira", role: "Fundador & Produção Laser", bio: "Responsável pela operação das máquinas e pelo controlo de qualidade final." },
  { initials: "FV", name: "Filipa Victorio", role: "FUNDADOR & PRODUÇÃO LASER", bio: "Transforma esboços e briefings em ficheiros vetoriais prontos a produzir." },
  { initials: "PR", name: "Pedro Rocha", role: "Engenharia & Impressão 3D", bio: "Modelação CAD, prototipagem funcional e validação de peças técnicas." },
  { initials: "AF", name: "Ana Ferreira", role: "Sublimação & Acabamentos", bio: "Garante cor fiel, alinhamento e durabilidade em cada suporte." },
];

function Equipa() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Equipa"
          title="Pessoas por trás da precisão"
          intro="Uma equipa pequena e multidisciplinar — cada projeto passa por todos nós."
        />

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <article key={m.name} className="group border border-border/70 bg-card p-8">
                <div className="flex size-16 items-center justify-center rounded-full border border-primary/50 font-display text-lg text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {m.initials}
                </div>
                <h2 className="mt-6 font-display text-base">{m.name}</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid-etch border-t border-border/60">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
            <p className="eyebrow">Trabalhar connosco</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">Junte-se à oficina</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Procuramos pessoas curiosas por fabrico digital, design e automação. Envie o seu
              portefólio para <span className="text-primary">laser4y.me@gmail.com</span>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
