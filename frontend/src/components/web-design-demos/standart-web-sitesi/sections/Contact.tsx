import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { PlaceholderMedia } from "../ui/PlaceholderMedia";
import { Reveal } from "@/components/shared/reveal";
import { formatAddress, mapsSearchUrl } from "../address";
import { socialIconMap } from "../ui/icons";
import type { DemoConfig } from "../demo-config";

export function Contact({ config }: { config: DemoConfig }) {
  const { contact, social } = config;
  const socialEntries = Object.entries(social).filter((entry): entry is [string, string] => Boolean(entry[1]));
  const directionsUrl = contact.mapUrl ?? mapsSearchUrl(contact.address);

  return (
    <Section id="iletisim" ariaLabel="İletişim">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow="İletişim" title="Bize ulaşın" />

          <dl className="mt-10 flex flex-col gap-6">
            <div>
              <dt className="text-eyebrow text-muted">Telefon</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="text-lg text-text transition-colors hover:text-gold"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-eyebrow text-muted">Adres</dt>
              <dd className="mt-1 text-lg text-text">{formatAddress(contact.address)}</dd>
            </div>

            {contact.email ? (
              <div>
                <dt className="text-eyebrow text-muted">E-posta</dt>
                <dd className="mt-1">
                  <a href={`mailto:${contact.email}`} className="text-lg text-text transition-colors hover:text-gold">
                    {contact.email}
                  </a>
                </dd>
              </div>
            ) : null}

            {contact.whatsapp ? (
              <div>
                <dt className="text-eyebrow text-muted">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    className="text-lg text-text transition-colors hover:text-gold"
                  >
                    {contact.whatsapp}
                  </a>
                </dd>
              </div>
            ) : null}

            {contact.workingHours ? (
              <div>
                <dt className="text-eyebrow text-muted">Çalışma Saatleri</dt>
                <dd className="mt-1 text-lg text-text">{contact.workingHours}</dd>
              </div>
            ) : null}
          </dl>

          {socialEntries.length > 0 ? (
            <div className="mt-8 flex gap-3">
              {socialEntries.map(([key, url]) => {
                const Icon = socialIconMap[key];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-text transition-colors hover:border-gold hover:text-gold"
                  >
                    {Icon ? <Icon width={18} height={18} /> : null}
                  </a>
                );
              })}
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-4">
          <PlaceholderMedia label={formatAddress(contact.address)} className="aspect-[4/3] w-full" />
          <Button href={directionsUrl} variant="secondary" target="_blank" rel="noopener noreferrer" className="self-start">
            Haritada Aç
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
