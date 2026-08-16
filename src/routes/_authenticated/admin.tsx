import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, Trash2, Upload, X, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { productImageUrl } from "@/lib/product-image";
import { processProductImage } from "@/lib/media.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Laser4y" },
      { name: "description", content: "Painel de gestão de conteúdos, produtos e testemunhos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const SERVICES = [
  { value: "laser", label: "Corte & Gravação a Laser" },
  { value: "sublimacao", label: "Sublimação" },
  { value: "impressao3d", label: "Impressão 3D" },
] as const;

const CONTENT_FIELDS = [
  { key: "home_hero_title", label: "Título principal (Início)" },
  { key: "home_hero_intro", label: "Texto de apresentação (Início)" },
  { key: "contact_email", label: "Email de contacto" },
  { key: "contact_phone", label: "Telefone de contacto" },
];

function AdminPage() {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"produtos" | "testemunhos" | "conteudos">("produtos");

  const products = useQuery({
    queryKey: ["admin", "products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const testimonials = useQuery({
    queryKey: ["admin", "testimonials"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const content = useQuery({
    queryKey: ["admin", "content"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data;
    },
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-32 text-center sm:px-8">
          <h1 className="text-3xl">Acesso restrito</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            A conta {user?.email} não tem permissões de administração.
          </p>
          <Link to="/" className="mt-8 inline-flex text-sm text-primary hover:underline">
            Voltar ao site
          </Link>
        </main>
      </div>
    );
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Administração"
          title="Gerir o site Laser4y"
          intro="Produtos por serviço, testemunhos de clientes e textos do site."
        />

        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex flex-wrap gap-2">
              {(["produtos", "testemunhos", "conteudos"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 font-display text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${
                    tab === t
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>

          {tab === "produtos" && (
            <ProductsPanel
              rows={products.data ?? []}
              loading={products.isLoading}
              refresh={() => qc.invalidateQueries({ queryKey: ["admin", "products"] })}
            />
          )}
          {tab === "testemunhos" && (
            <TestimonialsPanel
              rows={testimonials.data ?? []}
              loading={testimonials.isLoading}
              refresh={() => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] })}
            />
          )}
          {tab === "conteudos" && (
            <ContentPanel
              rows={content.data ?? []}
              refresh={() => qc.invalidateQueries({ queryKey: ["admin", "content"] })}
            />
          )}
        </div>
      </main>
    </div>
  );
}

type Product = {
  id: string;
  service: string;
  title: string;
  description: string | null;
  price: string | null;
  image_path: string | null;
  sort_order: number;
  published: boolean;
};

function ProductsPanel({
  rows,
  loading,
  refresh,
}: {
  rows: Product[];
  loading: boolean;
  refresh: () => void;
}) {
  const upload = useServerFn(processProductImage);
  const [service, setService] = useState<string>("laser");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const grouped = useMemo(
    () =>
      SERVICES.map((s) => ({ ...s, items: rows.filter((r) => r.service === s.value) })),
    [rows],
  );

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let imagePath: string | null = null;
      if (file) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Falha a ler o ficheiro"));
          reader.readAsDataURL(file);
        });
        toast.info("A aplicar o fundo da identidade Laser4y à imagem…");
        const res = await upload({ data: { dataUrl, fileName: file.name } });
        imagePath = res.path;
      }
      const { error } = await supabase.from("products").insert({
        service,
        title,
        description: description || null,
        price: price || null,
        image_path: imagePath,
      });
      if (error) throw error;
      toast.success("Produto adicionado.");
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível adicionar o produto.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(p: Product) {
    const { error } = await supabase
      .from("products")
      .update({ published: !p.published })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function remove(p: Product) {
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Produto removido.");
      refresh();
    }
  }

  return (
    <div className="space-y-14">
      <form onSubmit={addProduct} className="grid gap-4 border border-border/70 bg-card p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-display text-sm uppercase tracking-[0.2em] text-primary">
          Novo produto
        </h2>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome do produto"
          className="border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Preço (opcional, ex.: desde 25€)"
          className="border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <label className="flex cursor-pointer items-center gap-3 border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground hover:border-primary">
          <Upload className="size-4 text-primary" />
          <span className="truncate">{file ? file.name : "Carregar imagem do produto"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          rows={3}
          className="border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary md:col-span-2"
        />
        <p className="text-xs text-muted-foreground md:col-span-2">
          As imagens carregadas recebem automaticamente o fundo da identidade visual Laser4y (preto e
          dourado), mantendo o produto totalmente visível, íntegro e sem alterações de forma ou cor.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 font-display text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50 md:col-span-2"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {busy ? "A processar imagem…" : "Adicionar produto"}
        </button>
      </form>

      {loading && <Loader2 className="size-5 animate-spin text-primary" />}

      {grouped.map((g) => (
        <section key={g.value}>
          <h3 className="font-display text-sm uppercase tracking-[0.2em]">{g.label}</h3>
          {g.items.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Sem produtos.</p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p) => (
                <article key={p.id} className="border border-border/70 bg-card">
                  {p.image_path && (
                    <img
                      src={productImageUrl(p.image_path) ?? ""}
                      alt={p.title}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-5">
                    <p className="font-display text-sm">{p.title}</p>
                    {p.price && <p className="mt-1 text-xs text-primary">{p.price}</p>}
                    {p.description && (
                      <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <button
                        onClick={() => togglePublished(p)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {p.published ? "Despublicar" : "Publicar"}
                      </button>
                      <button
                        onClick={() => remove(p)}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" /> Apagar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

function TestimonialsPanel({
  rows,
  loading,
  refresh,
}: {
  rows: Testimonial[];
  loading: boolean;
  refresh: () => void;
}) {
  async function setApproved(t: Testimonial, approved: boolean) {
    const { error } = await supabase.from("testimonials").update({ approved }).eq("id", t.id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function remove(t: Testimonial) {
    const { error } = await supabase.from("testimonials").delete().eq("id", t.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Testemunho removido.");
      refresh();
    }
  }

  async function clearAll() {
    if (!confirm("Apagar TODOS os testemunhos? Esta ação não pode ser revertida.")) return;
    const { error } = await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) toast.error(error.message);
    else {
      toast.success("Testemunhos apagados.");
      refresh();
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {rows.filter((r) => !r.approved).length} por aprovar · {rows.length} no total
        </p>
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:border-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" /> Limpar tudo
        </button>
      </div>

      {loading && <Loader2 className="size-5 animate-spin text-primary" />}
      {!loading && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">Ainda não há testemunhos.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((t) => (
          <article key={t.id} className="border border-border/70 bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm">{t.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {t.role || "—"} · {t.rating}/5
                </p>
              </div>
              <span
                className={`px-2 py-1 text-[0.6rem] uppercase tracking-[0.16em] ${
                  t.approved ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {t.approved ? "Publicado" : "Pendente"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            <div className="mt-5 flex gap-4 text-xs">
              {t.approved ? (
                <button
                  onClick={() => setApproved(t, false)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                >
                  <X className="size-3.5" /> Retirar
                </button>
              ) : (
                <button
                  onClick={() => setApproved(t, true)}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Check className="size-3.5" /> Aprovar
                </button>
              )}
              <button
                onClick={() => remove(t)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" /> Apagar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ContentPanel({
  rows,
  refresh,
}: {
  rows: { key: string; value: string }[];
  refresh: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const base: Record<string, string> = {};
    for (const f of CONTENT_FIELDS) base[f.key] = "";
    for (const r of rows) base[r.key] = r.value;
    setValues(base);
  }, [rows]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = CONTENT_FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("site_content").upsert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Conteúdos guardados.");
      refresh();
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      {CONTENT_FIELDS.map((f) => (
        <label key={f.key} className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{f.label}</span>
          <input
            value={values[f.key] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            className="mt-2 w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={busy}
        className="bg-primary px-6 py-3 font-display text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
      >
        Guardar
      </button>
    </form>
  );
}
