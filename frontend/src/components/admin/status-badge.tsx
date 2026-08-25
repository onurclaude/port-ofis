import { cn } from "@/lib/utils";

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        active ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-400" : "border-hairline-soft text-muted",
      )}
    >
      <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-400" : "bg-muted")} />
      {active ? "Aktif" : "Pasif"}
    </span>
  );
}

export function MessageStatusBadge({ status }: { status: "NEW" | "READ" }) {
  const isNew = status === "NEW";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        isNew ? "border-gold/40 bg-gold/10 text-gold" : "border-hairline-soft text-muted",
      )}
    >
      <span className={cn("size-1.5 rounded-full", isNew ? "bg-gold" : "bg-muted")} />
      {isNew ? "Yeni" : "Okundu"}
    </span>
  );
}
