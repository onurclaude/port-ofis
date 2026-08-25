import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { FacebookIcon, InstagramIcon } from "@/components/shared/social-icons";
import { NAV_LINKS, FALLBACK_ADDRESS, FALLBACK_PHONE } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const address = settings?.address || FALLBACK_ADDRESS;
  const phone = settings?.phone || FALLBACK_PHONE;
  const footerNote = settings?.footerNote || `© ${new Date().getFullYear()} Port Ofis Kırtasiye. Tüm hakları saklıdır.`;
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <footer className="border-t border-hairline-soft bg-ink-soft">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Kırtasiyeden dijital baskıya, kurumsal ofis çözümlerinden kişiye özel ürünlere — Eryaman&apos;da tek
            adres.
          </p>
          {(settings?.instagramUrl || settings?.facebookUrl) && (
            <div className="mt-6 flex items-center gap-4">
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-muted transition-colors hover:text-gold"
                >
                  <InstagramIcon />
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-muted transition-colors hover:text-gold"
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
          )}
        </div>

        <nav aria-label="Hızlı bağlantılar">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Hızlı Bağlantılar</h3>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ivory/80 transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">İletişim</h3>
          <ul className="mt-5 space-y-4">
            <li className="flex items-start gap-3 text-sm text-ivory/80">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-ivory/80">
              <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
              <a href={telHref} className="transition-colors hover:text-gold">
                {phone}
              </a>
            </li>
            {settings?.workingHours && (
              <li className="text-sm text-ivory/80">
                <span className="text-muted">Çalışma Saatleri: </span>
                {settings.workingHours}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Bize Ulaşın</h3>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Bir projeniz mi var, yoksa kurumsal teklif mi almak istiyorsunuz? Bize yazın, en kısa sürede dönüş
            yapalım.
          </p>
          <Link
            href="/iletisim"
            className="mt-5 inline-block border-b border-gold pb-0.5 text-sm font-medium text-gold transition-colors hover:text-gold-light"
          >
            İletişim Formu →
          </Link>
        </div>
      </Container>

      <div className="border-t border-hairline-soft">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>{footerNote}</p>
          <p>Eryaman Port AVM · Etimesgut / Ankara</p>
        </Container>
      </div>
    </footer>
  );
}
