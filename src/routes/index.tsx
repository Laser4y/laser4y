import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Boxes, Flame, Layers, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import heroImg from "@/assets/hero-laser.jpg";
import svcLaser from "@/assets/svc-laser.jpg";
import svcSub from "@/assets/svc-sublimacao.jpg";
import svc3d from "@/assets/svc-3d.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Laser4y — Corte e Gravação a Laser Premium" },
      {
        name: "description",
        content:
          "Fabrico digital de precisão: corte e gravação a laser, sublimação e impressão 3D. Peças únicas, duráveis e personalizadas.",
      },
      { property: "og:title", content: "Laser4y — Corte e Gravação a Laser Premium" },
      {
        property: "og:description",
        content: "Corte e gravação a laser, sublimação e impressão 3D. Transformamos ideias em peças únicas.",
      },
    ],
  }),
  component: Home,
});

const services = [
  {
    icon: Flame,
    title: "Corte & Gravação Laser",
    text: "Madeira, acrílico, metal e couro cortados e gravados com precisão de décimas de milímetro.",
    img: svcLaser,
  },
  {
    icon: Layers,
    title: "Sublimação",
    text: "Cores vivas e permanentes em canecas, têxteis, placas e brindes corporativos.",
    img: svcSub,
  },
  {
    icon: Boxes,
    title: "Impressão 3D",
    text: "Protótipos funcionais, peças técnicas e objetos de design em FDM e resina.",
    img: svc3d,
  },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <img
            src={heroImg}
            alt="Máquina laser a gravar um padrão em madeira"
            width={1600}
            height={1104}
            className="absolute inset-0 size-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
            <p className="eyebrow">Fabrico digital de precisão</p>
            <h1 className="mt-6 max-w-4xl text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">
              Transformamos ideias
              <br />
              em peças <span className="text-gold-gradient">únicas.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Corte e gravação a laser, sublimação e impressão 3D. Acompanhamos cada projeto da
              ideia inicial ao produto final.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/servicos"
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Ver serviços
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/registo"
                className="inline-flex items-center rounded-sm border border-primary/50 px-7 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10"
              >
                Pedir orçamento
              </Link>
            </div>
          </div>
          <div className="beam-line h-px w-full bg-border" />
        </section>

        {/* Stats */}
        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/60 px-5 sm:px-8 lg:grid-cols-4">
            {[
              ["0.1 mm", "Precisão de corte"],
              ["3", "Tecnologias integradas"],
              ["48h", "Prototipagem rápida"],
              ["100%", "Peças à medida"],
            ].map(([v, l]) => (
              <div key={l} className="px-4 py-10 first:pl-0">
                <p className="font-display text-3xl text-gold-gradient sm:text-4xl">{v}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">O que fazemos</p>
              <h2 className="mt-4 text-3xl sm:text-5xl">Três tecnologias, uma exigência</h2>
            </div>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"
            >
              Todos os serviços <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, text, img }) => (
              <article
                key={title}
                className="group relative overflow-hidden border border-border/70 bg-card transition-colors hover:border-primary/50"
              >
                <img
                  src={img}
                  alt={title}
                  width={900}
                  height={700}
                  loading="lazy"
                  className="h-56 w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                />
                <div className="p-7">
                  <Icon className="size-5 text-primary" />
                  <h3 className="mt-5 font-display text-lg">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Values band */}
        <section className="grid-etch border-y border-border/60">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <p className="eyebrow">Valores</p>
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Qualidade", "Acabamentos verificados peça a peça."],
                ["Criatividade", "Design digital que resolve e surpreende."],
                ["Personalização", "Cada projeto nasce à medida do cliente."],
                ["Inovação", "Automação e IA integradas no processo."],
                ["Confiança", "Prazos cumpridos, comunicação direta."],
              ].map(([t, d]) => (
                <div key={t} className="border-t border-primary/25 pt-5">
                  <h3 className="font-display text-sm uppercase tracking-[0.14em] text-primary">{t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="relative overflow-hidden border border-primary/30 bg-card px-8 py-16 text-center sm:px-16">
            <Sparkles className="mx-auto size-6 text-primary" />
            <h2 className="mt-6 text-3xl sm:text-5xl">
              O seu projeto começa com <span className="text-gold-gradient">uma ideia</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Envie-nos o conceito, o ficheiro ou apenas um esboço. Respondemos com proposta técnica
              e orçamento.
            </p>
            <Link
              to="/registo"
              className="mt-9 inline-flex rounded-sm bg-primary px-8 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground"
            >
              Iniciar projeto
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
