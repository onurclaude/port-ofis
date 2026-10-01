import { Container } from "../../standart-web-sitesi/ui/Container";
import { Logo } from "../../standart-web-sitesi/ui/Logo";
import type { DemoConfig } from "../../standart-web-sitesi/demo-config";
import { secondaryButton, telHref } from "../styles";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#galeri", label: "Galeri" },
  { href: "#iletisim", label: "İletişim" },
];

// top-11 leaves room for the "canlı örnek" preview bar rendered above this
// demo by app/web-tasarimlari/[slug]/page.tsx. The logo artwork is designed
// for a black background, so it sits on a small ink badge here.
export function Header({ config }: { config: DemoConfig }) {
  return (
    <header className="fixed inset-x-0 top-11 z-50 border-b border-ink/10 bg-ivory/90 backdrop-blur">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <a
          href="#top"
          className="flex items-center rounded-full bg-ink px-3 py-1"
          aria-label={`${config.meta.companyName} anasayfa`}
        >
          <Logo src={config.images.logo} alt={config.meta.companyName} priority className="h-10 w-auto" />
        </a>

        <nav aria-label="Ana menü" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-ink/70 transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <a href={telHref(config.contact.phone)} className={cn(secondaryButton, "px-4 py-2 sm:px-6")}>
          {config.contact.phone}
        </a>
      </Container>
    </header>
  );
}
