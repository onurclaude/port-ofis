import { Section } from "../ui/Section";
import { InkLine } from "../ui/InkLine";
import { Reveal } from "@/components/shared/reveal";
import type { DemoConfig } from "../demo-config";

export function TrustStats({ config }: { config: DemoConfig }) {
  const stats =
    config.stats.length > 0
      ? config.stats
      : [
          { value: String(config.services.length), label: "hizmet kategorisi" },
          {
            value: config.contact.address.district ?? config.contact.address.city,
            label: "içinde hizmet noktası",
          },
          { value: config.contact.phone, label: "üzerinden doğrudan iletişim" },
        ];

  return (
    <Section className="py-16 sm:py-20" ariaLabel="Öne çıkan bilgiler">
      <Reveal>
        <div className="flex flex-col divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline sm:flex-row sm:divide-x sm:divide-y-0">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="flex flex-1 items-center gap-4 p-6 sm:p-8">
              <InkLine orientation="vertical" className="hidden h-10 sm:block" />
              <div>
                <p className="text-display-3 font-display text-gold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
