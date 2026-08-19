import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import logo from "@/assets/laser4y-logo.png.asset.json";

const nav = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/servicos", label: "Serviços" },
  { to: "/testemunhos", label: "Testemunhos" },
  { to: "/equipa", label: "Equipa" },
  { to: "/contactos", label: "Contactos" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    setOpen(false);
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }


  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo.url} alt="Laser4y" className="h-11 w-11 rounded-full" width={44} height={44} />
          <span className="font-display text-sm tracking-[0.28em] text-gold-gradient">LASER4Y</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="text-[0.78rem] font-medium uppercase tracking-[0.18em] transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden rounded-sm px-3 py-2.5 font-display text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={signOut}
              className="hidden rounded-sm border border-primary/60 px-5 py-2.5 font-display text-[0.7rem] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-flex"
            >
              Sair
            </button>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden px-3 py-2.5 font-display text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
              >
                Entrar
              </Link>
              <Link
                to="/registo"
                className="hidden rounded-sm border border-primary/60 px-5 py-2.5 font-display text-[0.7rem] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-flex"
              >
                Registo
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-border p-2 text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/60 px-5 pb-6 pt-3 lg:hidden">
          {[...nav, { to: "/registo", label: "Registo" } as const].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-2.5 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
