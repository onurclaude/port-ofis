import { Container } from "../../standart-web-sitesi/ui/Container";
import { formatAddress, mapsSearchUrl } from "../../standart-web-sitesi/address";
import type { DemoConfig } from "../../standart-web-sitesi/demo-config";
import { Reveal } from "@/components/shared/reveal";
import { telHref } from "../styles";

// The one dark band on the page: a closing call-to-action plus contact
// details, so the visitor's next step is always one tap away.
export function Contact({ config }: { config: DemoConfig }) {
  const { contact } = config;
  const directionsUrl = contact.mapUrl ?? mapsSearchUrl(contact.address);

  return (
    <section id="iletisim" aria-label="İletişim" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="rounded-[28px] bg-ink py-20 text-text sm:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <p className="text-eyebrow font-sans uppercase text-gold">İletişim</p>
            <h2 className="text-display-2 mt-4 font-display">
              Fikrinizi anlatın, <em className="text-gold">gerisini biz</em> halledelim.
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={telHref(contact.phone)}
                className="inline-flex items-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-light"
              >
                Hemen Arayın
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-hairline px-6 py-3 text-sm font-medium text-text transition-colors hover:border-gold hover:text-gold"
              >
                Yol Tarifi Al
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-eyebrow text-muted">Telefon</dt>
                <dd className="mt-1 text-lg">
                  <a href={telHref(contact.phone)} className="transition-colors hover:text-gold">
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-eyebrow text-muted">Adres</dt>
                <dd className="mt-1 text-lg">{formatAddress(contact.address)}</dd>
              </div>
              {contact.email ? (
                <div>
                  <dt className="text-eyebrow text-muted">E-posta</dt>
                  <dd className="mt-1 text-lg">
                    <a href={`mailto:${contact.email}`} className="transition-colors hover:text-gold">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contact.workingHours ? (
                <div>
                  <dt className="text-eyebrow text-muted">Çalışma Saatleri</dt>
                  <dd className="mt-1 text-lg">{contact.workingHours}</dd>
                </div>
              ) : null}
            </dl>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
