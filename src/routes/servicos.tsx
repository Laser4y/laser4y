import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { productImageUrl } from "@/lib/product-image";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import svcLaser from "@/assets/svc-laser.jpg";
import svcSub from "@/assets/svc-sublimacao.jpg";
import svc3d from "@/assets/svc-3d.jpg";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Laser, Sublimação e Impressão 3D | Laser4y" },
      {
        name: "description",
        content:
          "Corte e gravação a laser, sublimação e impressão 3D. Produção personalizada para particulares e empresas.",
      },
      { property: "og:title", content: "Serviços Laser4y" },
      {
        property: "og:description",
        content: "Corte/gravação laser, sublimação e impressão 3D com acabamento premium.",
      },
    ],
  }),
  component: Servicos,
});

const services = [
  {
    img: svcLaser,
    title: "Corte & Gravação a Laser",
    lead: "Precisão milimétrica em madeira, acrílico, metal, couro e vidro.",
    items: [
      "Sinalética e placas corporativas",
      "Troféus, prémios e lembranças",
      "Decoração de interiores e peças de design",
      "Marcação permanente em metal pintado",
      "Prototipagem em corte plano",
    ],
  },
  {
    img: svcSub,
    title: "Sublimação",
    lead: "Cor total, permanente e resistente à lavagem em suportes têxteis e rígidos.",
    items: [
      "Canecas, garrafas e termos",
      "T-shirts, sweats e bonés",
      
      "Brindes corporativos e merchandising",
      "Séries pequenas ou peças únicas",
    ],
  },
  {
    img: svc3d,
    title: "Impressão 3D",
    lead: "Do protótipo funcional à peça final, em FDM de alta definição.",
    items: [
      "Protótipos e provas de conceito",
      "Peças técnicas e de substituição",
      "Miniaturas e figuras detalhadas",
      "Moldes, gabaritos e suportes",
      "Modelação 3D a partir de esboço",
    ],
  },
];

function Servicos() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Produtos e serviços"
          title="Tecnologia ao serviço da ideia"
          intro="Três linhas de produção complementares que cobrem desde a peça única ao lote personalizado."
        />

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {services.map((s, i) => (
            <section
              key={s.title}
              className="grid gap-12 border-b border-border/60 py-20 lg:grid-cols-2 lg:items-center"
            >
              <img
                src={s.img}
                alt={s.title}
                width={900}
                height={700}
                loading="lazy"
                className={`w-full border border-border/70 object-cover ${i % 2 ? "lg:order-2" : ""}`}
              />
              <div>
                <p className="eyebrow">0{i + 1}</p>
                <h2 className="mt-4 text-3xl sm:text-4xl">{s.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.lead}</p>
                <ul className="mt-8 space-y-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <h2 className="text-3xl sm:text-4xl">
            Precisa de algo <span className="text-gold-gradient">fora do catálogo?</span>
          </h2>
          <Link
            to="/contactos"
            className="mt-8 inline-flex rounded-sm bg-primary px-8 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground"
          >
            Falar connosco
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
