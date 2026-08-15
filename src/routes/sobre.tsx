import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import workshop from "@/assets/about-workshop.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Laser4y — Fabrico Digital de Precisão" },
      {
        name: "description",
        content:
          "A Laser4y combina laser, sublimação, impressão 3D, engenharia e automação para criar produtos personalizados de elevada precisão.",
      },
      { property: "og:title", content: "Sobre a Laser4y" },
      {
        property: "og:description",
        content: "Empresa de fabrico digital especializada em soluções personalizadas de alta precisão.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="A marca"
          title="Precisão como assinatura"
          intro="A Laser4y é uma empresa de fabrico digital especializada na conceção, desenvolvimento e produção de soluções personalizadas através de tecnologias de elevada precisão."
        />

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center">
          <img
            src={workshop}
            alt="Oficina Laser4y com máquinas laser e impressoras 3D"
            width={1400}
            height={900}
            loading="lazy"
            className="w-full border border-border/70 object-cover"
          />
          <div>
            <p className="eyebrow">História</p>
            <h2 className="mt-4 text-3xl sm:text-4xl text-lowercase">da ideia inicial ao produto final</h2>
            <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Combinando impressão 3D, corte e gravação a laser, engenharia, design digital e
                automação, desenvolvemos produtos e projetos à medida para clientes particulares e
                empresariais.
              </p>
              <p>
                Distinguimo-nos pela qualidade, inovação, criatividade e personalização,
                acompanhando cada projeto em todas as fases — do desenho técnico ao acabamento.
              </p>
              <p>
                Com uma forte aposta na melhoria contínua e na integração de novas tecnologias,
                incluindo inteligência artificial, procuramos oferecer soluções eficientes, fiáveis
                e adaptadas a cada cliente.
              </p>
            </div>
          </div>
        </section>

        <section className="grid-etch border-y border-border/60">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <p className="eyebrow">Materiais</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["Madeira", "Contraplacado, MDF, faia e nogueira para gravação de alto contraste."],
                ["Acrílico", "Cortes limpos com aresta polida, transparente ou colorido."],
                ["Metal", "Marcação permanente em metais pintados."],
              ].map(([t, d]) => (
                <div key={t} className="border border-border/70 bg-card p-8">
                  <h3 className="font-display text-lg text-primary">{t}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="eyebrow">Processo</p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Ideia", "Ouvimos o conceito e definimos requisitos."],
              ["02", "Design", "Desenho digital e validação técnica do ficheiro."],
              ["03", "Produção", "Corte, gravação, sublimação ou impressão 3D."],
              ["04", "Entrega", "Acabamento, controlo de qualidade e envio."],
            ].map(([n, t, d]) => (
              <li key={n} className="border-t border-primary/30 pt-6">
                <span className="font-display text-4xl text-gold-gradient">{n}</span>
                <h3 className="mt-4 font-display text-base uppercase tracking-[0.14em]">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
