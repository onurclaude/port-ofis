import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServiceIcon } from "@/lib/icon-map";
import type { Service } from "@/lib/types";

/** Flat feature card for the homepage: icon, bold name, slate description. */
export function ServiceCard({ service }: { service: Service }) {
  // Stable module-level icon lookup, see getServiceIcon.
  const Icon = getServiceIcon(service.iconKey);

  return (
    <Link
      href={`/hizmetler#${service.slug}`}
      className="group flex h-full flex-col rounded-lg border border-hairline-soft bg-ink p-[30px] transition-colors hover:border-hairline"
    >
      <span className="flex size-11 items-center justify-center rounded-lg bg-ivory">
        {/* eslint-disable-next-line react-hooks/static-components -- stable module-level icon lookup, see getServiceIcon */}
        <Icon className="size-5 text-ink" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-2xl font-bold leading-tight tracking-[-0.04em] text-ivory">{service.name}</h3>
      <p className="mt-3 text-base leading-snug tracking-[-0.02em] text-muted">{service.shortDescription}</p>
      <ArrowUpRight
        className="mt-8 size-5 self-end text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory"
        aria-hidden="true"
      />
    </Link>
  );
}
