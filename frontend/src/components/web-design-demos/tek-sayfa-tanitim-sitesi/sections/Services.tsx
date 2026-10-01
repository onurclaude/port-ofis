import { Container } from "../../standart-web-sitesi/ui/Container";
import { ServiceIcon } from "../../standart-web-sitesi/ui/icons";
import type { DemoConfig } from "../../standart-web-sitesi/demo-config";
import { Reveal } from "@/components/shared/reveal";
import { accentText, eyebrow } from "../styles";

export function Services({ config }: { config: DemoConfig }) {
  return (
    <section id="hizmetler" aria-label="Hizmetler" className="py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <Reveal>
          <p className={eyebrow}>Hizmetlerimiz</p>
          <h2 className="text-display-2 mt-4 font-display text-ink">Tek adreste, her ihtiyaca</h2>
          <p className="text-body-lg mt-4 text-ink/70">
            {config.services.length} farklı alanda üretim ve satış; fikrinizi dinliyor, size en uygun çözümü
            öneriyoruz.
          </p>
        </Reveal>

        <ol className="border-t border-ink/10">
          {config.services.map((service, index) => (
            <li key={service.id} className="border-b border-ink/10">
              <Reveal delay={Math.min(index, 4) * 0.05} className="grid grid-cols-[auto_1fr] gap-x-5 py-6 sm:grid-cols-[3rem_auto_1fr] sm:items-baseline">
                <span className={`hidden font-display text-lg sm:block ${accentText}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ServiceIcon id={service.id} width={24} height={24} className={`self-center ${accentText}`} />
                <div>
                  <h3 className="font-display text-2xl text-ink">{service.title}</h3>
                  <p className="mt-1 text-ink/70">{service.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
