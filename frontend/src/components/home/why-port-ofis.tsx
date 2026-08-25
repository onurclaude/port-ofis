import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { WHY_PORT_OFIS } from "@/lib/constants";

export function WhyPortOfis() {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Neden Port Ofis" title="Güvenle Tercih Edilen Bir Adres" align="center" />

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
          {WHY_PORT_OFIS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="flex gap-5">
              <span className="font-display text-3xl text-gold/60 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-lg font-medium text-ivory">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
