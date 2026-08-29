import { Container } from "../ui/Container";
import { InkLine } from "../ui/InkLine";
import { Logo } from "../ui/Logo";
import { socialIconMap } from "../ui/icons";
import { formatAddress } from "../address";
import type { DemoConfig } from "../demo-config";

const NAV_LINKS = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#neden-biz", label: "Neden Biz" },
  { href: "#vitrin", label: "Vitrin" },
  { href: "#iletisim", label: "İletişim" },
];

export function Footer({ config }: { config: DemoConfig }) {
  const socialEntries = Object.entries(config.social).filter((entry): entry is [string, string] => Boolean(entry[1]));
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <Container className="flex flex-col gap-10 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo src={config.images.logo} alt={config.meta.companyName} className="h-9 w-auto" />
            <p className="mt-4 text-sm text-muted">{config.meta.tagline}</p>
          </div>

          <nav aria-label="Alt menü" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted hover:text-gold">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2 text-sm text-muted">
            <a href={`tel:${config.contact.phone.replace(/\s+/g, "")}`} className="hover:text-gold">
              {config.contact.phone}
            </a>
            <span>{formatAddress(config.contact.address)}</span>
          </div>
        </div>

        {socialEntries.length > 0 ? (
          <div className="flex gap-3">
            {socialEntries.map(([key, url]) => {
              const Icon = socialIconMap[key];
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  {Icon ? <Icon width={16} height={16} /> : null}
                </a>
              );
            })}
          </div>
        ) : null}

        <InkLine orientation="horizontal" />

        <p className="text-xs text-muted">
          © {year} {config.meta.companyName}. Tüm hakları saklıdır.
        </p>
      </Container>
    </footer>
  );
}
