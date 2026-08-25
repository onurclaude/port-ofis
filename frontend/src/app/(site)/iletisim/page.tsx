import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { getSiteSettings } from "@/lib/api";
import { FALLBACK_ADDRESS, FALLBACK_PHONE } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Port Ofis Kırtasiye ile iletişime geçin: Eryaman Port AVM, Etimesgut/Ankara. Telefon 0312 911 81 02.",
  alternates: {
    canonical: "/iletisim",
  },
};

async function loadSettings(): Promise<SiteSettings | null> {
  try {
    return await getSiteSettings();
  } catch {
    return null;
  }
}

export default async function IletisimPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const [settings, params] = await Promise.all([loadSettings(), searchParams]);
  const address = settings?.address || FALLBACK_ADDRESS;
  const phone = settings?.phone || FALLBACK_PHONE;
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Bize Ulaşın"
        description="Sorularınız, projeleriniz veya kurumsal teklif talepleriniz için formu doldurun, en kısa sürede size dönelim."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ivory">İletişim Bilgileri</h2>
            <ul className="mt-7 space-y-6">
              <li className="flex items-start gap-3.5">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-ivory/85 transition-colors hover:text-gold"
                >
                  Port Ofis Kırtasiye, {address}
                </a>
              </li>
              <li className="flex items-center gap-3.5">
                <Phone className="size-5 shrink-0 text-gold" aria-hidden="true" />
                <a href={telHref} className="text-base text-ivory/85 transition-colors hover:text-gold">
                  {phone}
                </a>
              </li>
              {settings?.websiteUrl && (
                <li className="flex items-center gap-3.5">
                  <Mail className="size-5 shrink-0 text-gold" aria-hidden="true" />
                  <a
                    href={settings.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-ivory/85 transition-colors hover:text-gold"
                  >
                    {settings.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
              {settings?.workingHours && (
                <li className="flex items-center gap-3.5">
                  <Clock className="size-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="text-base text-ivory/85">{settings.workingHours}</span>
                </li>
              )}
            </ul>

            <div className="mt-9 min-h-64 overflow-hidden rounded-sm border border-hairline">
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
                  className="flex h-full min-h-64 flex-col items-center justify-center gap-3 bg-ink-soft text-center transition-colors hover:bg-surface"
                >
                  <MapPin className="size-8 text-gold" aria-hidden="true" />
                  <span className="text-sm text-muted">Haritada Görüntüle</span>
                </a>
              )}
            </div>
          </div>

          <div className="rounded-sm border border-hairline-soft bg-ink-soft p-6 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-ivory">Mesaj Gönderin</h2>
            <p className="mt-2 text-sm text-muted">
              Formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin.
            </p>
            <div className="mt-8">
              <ContactForm initialSubject={params.subject ?? ""} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
