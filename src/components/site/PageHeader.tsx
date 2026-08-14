export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative grid-etch border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          <span className="text-gold-gradient">{title}</span>
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        )}
      </div>
      <div className="beam-line h-px w-full bg-border" />
    </section>
  );
}
