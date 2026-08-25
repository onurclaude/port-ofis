import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getServiceIcon } from "@/lib/icon-map";
import { getServices } from "@/lib/api";

/**
 * Optional cross-link strip pulling specific services by slug, for the
 * static Baskı Merkezi / Kurumsal pages. Degrades to nothing on failure or
 * an empty match — the surrounding page must remain fully functional
 * without it, per FRONTEND_SPEC §4/§5.
 */
export async function RelatedServices({ slugs, heading = "İlgili Hizmetler" }: { slugs: string[]; heading?: string }) {
  let matched: Awaited<ReturnType<typeof getServices>> = [];
  try {
    const all = await getServices();
    matched = all.filter((s) => slugs.includes(s.slug));
  } catch {
    return null;
  }

  if (matched.length === 0) return null;

  return (
    <section className="border-t border-hairline-soft bg-ink-soft py-20 sm:py-24">
      <Container>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold">{heading}</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {matched.map((service) => {
            const Icon = getServiceIcon(service.iconKey);
            return (
              <Link
                key={service.id}
                href={`/hizmetler#${service.slug}`}
                className="group flex items-start gap-4 rounded-sm border border-hairline-soft p-6 transition-colors hover:border-gold/50 hover:bg-surface"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block font-display text-lg font-medium text-ivory">{service.name}</span>
                  <span className="mt-1 block text-sm text-muted">{service.shortDescription}</span>
                </span>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted transition-colors group-hover:text-gold"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
