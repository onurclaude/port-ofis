import { Container } from "@/components/layout/container";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Reveal } from "@/components/shared/reveal";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-hairline-soft bg-ink-soft pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div
        className="bg-noise pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative">
        {/*
          This block contains the page's H1, almost always the Largest Contentful
          Paint element (PageHero renders above the fold on every non-home page).
          mode="mount" + fade={false} lets it paint fully opaque immediately instead
          of being gated behind an IntersectionObserver callback and an opacity fade.
        */}
        <Reveal mode="mount" fade={false}>
          {eyebrow && <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
          <h1 className="max-w-3xl font-display text-4xl font-semibold text-ivory sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <GoldDivider className="mt-6" />
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
