import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "@/components/shared/reveal";
import { HoverLift } from "../ui/HoverLift";
import { ServiceIcon } from "../ui/icons";
import type { DemoConfig } from "../demo-config";

// Asymmetric composition, not a uniform card grid: every third item is
// rendered "large" (index-driven, so it works for any service count).
export function Services({ config }: { config: DemoConfig }) {
  return (
    <Section id="hizmetler" ariaLabel="Hizmetlerimiz">
      <SectionHeading eyebrow="Hizmetlerimiz" title="Tek adreste, uçtan uca üretim" description={config.meta.sector} />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5">
        {config.services.map((service, index) => {
          const large = index % 3 === 0;
          return (
            <Reveal key={service.id} delay={(index % 6) * 0.06} className={large ? "sm:col-span-4" : "sm:col-span-2"}>
              <HoverLift className="h-full">
                <div
                  className={
                    "flex h-full rounded-[20px] border border-hairline bg-surface p-6 " +
                    (large ? "flex-row items-center gap-6 sm:p-8" : "flex-col gap-4")
                  }
                >
                  <span
                    className={
                      "flex shrink-0 items-center justify-center rounded-full border border-hairline text-gold " +
                      (large ? "h-14 w-14" : "h-11 w-11")
                    }
                  >
                    <ServiceIcon id={service.id} width={large ? 24 : 20} height={large ? 24 : 20} />
                  </span>
                  <div>
                    <h3 className={"font-display text-text " + (large ? "text-2xl" : "text-lg")}>{service.title}</h3>
                    {service.description ? <p className="mt-2 text-sm text-muted">{service.description}</p> : null}
                  </div>
                </div>
              </HoverLift>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
