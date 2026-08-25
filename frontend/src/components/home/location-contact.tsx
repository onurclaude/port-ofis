import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { FALLBACK_ADDRESS, FALLBACK_PHONE } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

export function LocationContact({ settings }: { settings: SiteSettings | null }) {
  const address = settings?.address || FALLBACK_ADDRESS;
  const phone = settings?.phone || FALLBACK_PHONE;
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className="border-t border-hairline-soft bg-ink-soft py-24 sm:py-28">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-gold">Bizi Ziyaret Edin</p>
          <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">Eryaman Port AVM&apos;de</h2>
          <GoldDivider className="mt-5" />
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-3.5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
              <span className="text-base text-ivory/85">{address}</span>
            </li>
            <li className="flex items-center gap-3.5">
              <Phone className="size-5 shrink-0 text-gold" aria-hidden="true" />
              <a href={telHref} className="text-base text-ivory/85 transition-colors hover:text-gold">
                {phone}
              </a>
            </li>
          </ul>
          <Button asChild className="mt-9">
            <Link href="/iletisim">
              İletişime Geç <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="min-h-64 overflow-hidden rounded-sm border border-hairline">
          {settings?.mapEmbedUrl ? (
            <iframe
              src={settings.mapEmbedUrl}
              title="Port Ofis Kırtasiye Konum"
              className="h-full min-h-64 w-full grayscale invert-[0.92] contrast-[0.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full min-h-64 flex-col items-center justify-center gap-3 bg-ink text-center transition-colors hover:bg-surface"
            >
              <MapPin className="size-8 text-gold" aria-hidden="true" />
              <span className="text-sm text-muted">Haritada Görüntüle</span>
            </a>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
