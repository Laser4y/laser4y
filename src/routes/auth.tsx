import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar na Área de Cliente — Laser4y" },
      {
        name: "description",
        content:
          "Aceda à sua conta Laser4y com Google ou email para acompanhar pedidos e gerir conteúdos.",
      },
      { property: "og:title", content: "Entrar — Laser4y" },
      { property: "og:description", content: "Login na área reservada da Laser4y." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function signInGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Conta criada. Confirme o email para entrar.");
          return;
        }
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PageHeader
          eyebrow="Área reservada"
          title="Entrar na Laser4y"
          intro="Aceda com a sua conta Google ou com email e palavra-passe."
        />

        <section className="mx-auto max-w-md px-5 pb-24 sm:px-8">
          <button
            type="button"
            onClick={signInGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 border border-primary/60 px-5 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
              <path
                fill="currentColor"
                d="M24 9.5c3.5 0 6.3 1.2 8.4 3.2l6.2-6.2C34.9 2.9 29.9 1 24 1 14.6 1 6.5 6.4 2.6 14.3l7.3 5.7C11.7 14 17.3 9.5 24 9.5z"
              />
              <path
                fill="currentColor"
                opacity=".7"
                d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.2h12.6c-.3 2.1-1.6 5.2-4.7 7.3l7.2 5.6c4.3-4 7-9.9 7-17z"
              />
              <path
                fill="currentColor"
                opacity=".5"
                d="M9.9 28.4A14.6 14.6 0 0 1 9.1 24c0-1.5.3-3 .8-4.4l-7.3-5.7A23 23 0 0 0 0 24c0 3.7.9 7.2 2.6 10.1l7.3-5.7z"
              />
              <path
                fill="currentColor"
                opacity=".85"
                d="M24 47c6 0 11-2 14.6-5.4l-7.2-5.6c-1.9 1.3-4.5 2.3-7.4 2.3-6.7 0-12.3-4.5-14.1-10.5l-7.3 5.7C6.5 41.6 14.6 47 24 47z"
              />
            </svg>
            Continuar com Google
          </button>

          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Palavra-passe"
              className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary px-5 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
            >
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-6 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {mode === "login" ? "Ainda não tem conta? Criar conta" : "Já tem conta? Entrar"}
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Quer apenas enviar um pedido?{" "}
            <Link to="/contactos" className="text-primary hover:underline">
              Fale connosco
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
