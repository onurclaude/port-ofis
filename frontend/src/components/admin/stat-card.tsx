import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-sm border border-hairline-soft bg-ink-soft p-6 transition-colors hover:border-gold/50"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold text-ivory">{value}</p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <Icon className="size-6 text-gold" aria-hidden="true" />
        <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-gold" aria-hidden="true" />
      </div>
    </Link>
  );
}
