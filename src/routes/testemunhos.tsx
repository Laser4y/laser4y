import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Testemunhos,
});

function Testemunhos() {
  const reviews = useQuery({
    queryKey: ["testimonials", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, role, text, rating")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ name: "", role: "", text: "", rating: 5 });
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Preencha o nome e o testemunho.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("testimonials").insert({
      name: form.name.trim(),
      role: form.role.trim() || null,
      text: form.text.trim(),
      rating: form.rating,
      approved: false,
    });
    setSending(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente.");
      return;
    }
    setForm({ name: "", role: "", text: "", rating: 5 });
    toast.success("Obrigado! O seu testemunho será publicado após aprovação.");
  }

  const list = reviews.data ?? [];

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
          {reviews.isLoading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Ainda não há testemunhos publicados. Seja o primeiro a partilhar a sua experiência.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((r) => (
                <figure
                  key={r.id}
                  className="flex flex-col justify-between border border-border/70 bg-card p-8 transition-colors hover:border-primary/50"
                >
                  <Quote className="size-5 text-primary" />
                  <blockquote className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-8 border-t border-border/60 pt-5">
                    <div className="flex gap-1">
                      {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mt-3 font-display text-sm">{r.name}</p>
                    {r.role && (
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {r.role}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        <section className="grid-etch border-t border-border/60">
          <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
            <p className="eyebrow">Partilhe a sua experiência</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              Adicionar <span className="text-gold-gradient">testemunho</span>
            </h2>

            <form onSubmit={submit} className="mt-10 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Nome
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-primary"
                  />
                </label>
                <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Cargo / Empresa (opcional)
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-primary"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Testemunho
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  required
                  rows={5}
                  className="border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-primary"
                />
              </label>

              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Classificação
                </span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} estrelas`}
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className="p-0.5"
                  >
                    <Star
                      className={`size-5 ${n <= form.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
              >
                {sending && <Loader2 className="size-4 animate-spin" />}
                Enviar testemunho
              </button>
              <p className="text-xs text-muted-foreground">
                Os testemunhos são publicados após validação da equipa Laser4y.
              </p>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
