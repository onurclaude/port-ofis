import Image from "next/image";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { PlaceholderMedia } from "../ui/PlaceholderMedia";
import { Reveal } from "@/components/shared/reveal";
import { demoAsset } from "../assets";
import type { DemoConfig } from "../demo-config";

export function FeaturedCapabilities({ config }: { config: DemoConfig }) {
  const featured = config.services.filter((s) => s.featured);
  if (featured.length === 0) return null;

  return (
    <Section id="uretim" className="bg-surface/40" ariaLabel="Öne çıkan üretim alanları">
      <SectionHeading eyebrow="Neler Üretiyoruz" title="Öne çıkan üretim alanlarımız" description={config.meta.description} />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5">
        {featured.map((service, index) => {
          const pattern = index % 3;
          const span = pattern === 0 ? "sm:col-span-7" : pattern === 1 ? "sm:col-span-5" : "sm:col-span-4";
          return (
            <Reveal key={service.id} delay={(index % 3) * 0.08} className={span}>
              <div className="group relative">
                {service.image ? (
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] border border-hairline">
                    <Image
                      src={demoAsset(service.image)}
                      alt={service.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <PlaceholderMedia
                    label={service.title}
                    variant={index}
                    className="aspect-[5/4] transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}
                {service.description ? <p className="mt-3 text-sm text-muted">{service.description}</p> : null}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
