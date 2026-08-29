import Image from "next/image";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { PlaceholderMedia } from "../ui/PlaceholderMedia";
import { Reveal } from "@/components/shared/reveal";
import { demoAsset } from "../assets";
import type { DemoConfig } from "../demo-config";

type ShowcaseItem =
  | { key: string; kind: "image"; src: string; caption: string }
  | { key: string; kind: "placeholder"; label: string };

export function Showcase({ config }: { config: DemoConfig }) {
  const gallery = config.images.gallery;
  const featured = config.services.filter((s) => s.featured);
  const fallbackServices = (featured.length > 0 ? featured : config.services).slice(0, 6);

  const items: ShowcaseItem[] =
    gallery.length > 0
      ? gallery.map((g, i) => ({
          key: `${g.src}-${i}`,
          kind: "image",
          src: g.src,
          caption: g.caption ?? g.alt,
        }))
      : fallbackServices.map((s) => ({ key: s.id, kind: "placeholder", label: `${s.title} Örnekleri` }));

  return (
    <Section id="vitrin" ariaLabel="Vitrin">
      <SectionHeading eyebrow="Vitrin" title="Hizmet kategorilerimizden bir seçki" />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
        {items.map((item, index) => {
          const big = index % 5 === 0;
          return (
            <Reveal key={item.key} delay={(index % 6) * 0.05} className={big ? "sm:col-span-4" : "sm:col-span-2"}>
              {item.kind === "image" ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-hairline">
                  <Image
                    src={demoAsset(item.src)}
                    alt={item.caption}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <PlaceholderMedia label={item.label} variant={index} className="aspect-[4/3]" />
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
