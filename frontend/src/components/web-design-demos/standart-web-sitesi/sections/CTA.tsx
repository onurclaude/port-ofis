import { Section } from "../ui/Section";
import { InkLine } from "../ui/InkLine";
import { Button } from "../ui/Button";
import { Reveal } from "@/components/shared/reveal";
import { mapsSearchUrl } from "../address";
import type { DemoConfig } from "../demo-config";

export function CTA({ config }: { config: DemoConfig }) {
  const directionsUrl = config.contact.mapUrl ?? mapsSearchUrl(config.contact.address);

  return (
    <Section ariaLabel="Bize ulaşın">
      <Reveal>
        <div className="relative overflow-hidden rounded-[20px] border border-hairline bg-surface-hover px-6 py-14 text-center shadow-soft sm:px-16 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(201,162,74,0.25), transparent 65%)" }}
          />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <InkLine orientation="horizontal" className="mx-auto mb-8" />
            <h2 className="text-display-2 font-display text-text">
              Bir sonraki işiniz için {config.meta.companyName}&apos;e uğrayın.
            </h2>
            <p className="text-body-lg mt-4 text-muted">{config.contact.address.line1}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={`tel:${config.contact.phone.replace(/\s+/g, "")}`} variant="primary">
                {config.contact.phone}
              </Button>
              <Button href={directionsUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
                Yol Tarifi Al
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
