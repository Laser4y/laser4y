import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/laser4y-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="Laser4y" className="h-12 w-12 rounded-full" width={48} height={48} loading="lazy" />
            <span className="font-display text-sm tracking-[0.28em] text-gold-gradient">LASER4Y</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Fabrico digital de precisão. Corte e gravação a laser, sublimação e impressão 3D —
            da ideia ao produto final.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: "https://facebook.com/Laser4y", Icon: Facebook, label: "Facebook" },
              { href: "https://instagram.com/Laser4y", Icon: Instagram, label: "Instagram" },
              { href: "https://www.linkedin.com/company/laser4y", Icon: Linkedin, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-sm border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow">Navegação</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {[
              { to: "/sobre", label: "Sobre" },
              { to: "/servicos", label: "Serviços" },
              { to: "/testemunhos", label: "Testemunhos" },
              { to: "/equipa", label: "Equipa" },
              { to: "/registo", label: "Registo de cliente" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Contactos</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-primary" /> geral@laser4y.pt
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-primary" /> +351 910 000 000
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-primary" /> Portugal
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} LASER4Y · CORTE E GRAVAÇÃO A LASER
      </div>
    </footer>
  );
}
