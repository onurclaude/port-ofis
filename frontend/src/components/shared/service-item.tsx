import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServiceIcon } from "@/lib/icon-map";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ServiceItemProps {
  service: Service;
  index: number;
  href?: string;
  className?: string;
}

/**
 * Editorial numbered row rather than a card — used in both the homepage
 * "Selected Services" strip and the full Hizmetler list, per the brief's
 * direction to avoid a wall of identical rounded cards.
 */
export function ServiceItem({ service, index, href, className }: ServiceItemProps) {
  // getServiceIcon looks up a stable, module-level icon component from a
  // static registry (no component is created at render time) — safe to use
  // as a JSX tag despite the dynamic lookup.
  const Icon = getServiceIcon(service.iconKey);
  const target = href ?? `/hizmetler#${service.slug}`;

  return (
    <Link
      href={target}
      id={service.slug}
      className={cn(
        "group grid scroll-mt-28 grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-hairline-soft py-7 transition-colors hover:bg-surface/40 sm:py-8",
        className,
      )}
    >
      <span className="font-display text-2xl text-gold/70 tabular-nums sm:text-3xl">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="min-w-0">
        <span className="mb-1.5 flex items-center gap-2.5">
          {/* eslint-disable-next-line react-hooks/static-components -- stable module-level icon lookup, see getServiceIcon */}
          <Icon className="size-4 text-gold" aria-hidden="true" />
          <span className="font-display text-xl font-medium text-ivory transition-colors group-hover:text-gold-light sm:text-2xl">
            {service.name}
          </span>
        </span>
        <span className="block max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {service.shortDescription}
        </span>
      </span>

      <ArrowUpRight
        className="size-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
        aria-hidden="true"
      />
    </Link>
  );
}
