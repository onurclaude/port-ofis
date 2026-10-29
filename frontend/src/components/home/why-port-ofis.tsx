import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { WHY_PORT_OFIS } from "@/lib/constants";

export function WhyPortOfis() {
  return (
    <section className="border-y border-hairline-soft bg-ink-soft py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Neden Port Ofis" title="Güvenle Tercih Edilen Bir Adres" />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_PORT_OFIS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <span className="text-sm font-bold tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</span>
              <div className="mt-3 border-t border-hairline pt-5">
                <h3 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-ivory">{item.title}</h3>
                <p className="mt-3 text-base leading-snug tracking-[-0.02em] text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
