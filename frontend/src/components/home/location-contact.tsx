import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { FALLBACK_ADDRESS, FALLBACK_PHONE } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

export function LocationContact({ settings }: { settings: SiteSettings | null }) {
  const address = settings?.address || FALLBACK_ADDRESS;
  const phone = settings?.phone || FALLBACK_PHONE;
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className="bg-ink py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Bizi Ziyaret Edin" title="Eryaman Port AVM'de" />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-lg border border-hairline-soft bg-ink-soft p-[30px]">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 size-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="text-xl font-bold leading-snug tracking-[-0.03em] text-ivory">{address}</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="size-5 shrink-0 text-gold" aria-hidden="true" />
                  <a
                    href={telHref}
                    className="text-xl font-bold tracking-[-0.03em] text-ivory transition-colors hover:text-gold"
                  >
                    {phone}
                  </a>
                </li>
              </ul>
              <Button asChild className="mt-10 self-start">
                <Link href="/iletisim">
                  İletişime Geç <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-h-72 overflow-hidden rounded-lg border border-hairline-soft lg:col-span-3">
            {settings?.mapEmbedUrl ? (
              <iframe
                src={settings.mapEmbedUrl}
                title="Port Ofis Kırtasiye Konum"
                className="h-full min-h-72 w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full min-h-72 flex-col items-center justify-center gap-3 bg-ink-soft text-center transition-colors hover:bg-surface"
              >
                <MapPin className="size-8 text-gold" aria-hidden="true" />
                <span className="text-sm font-medium text-muted">Haritada Görüntüle</span>
              </a>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
