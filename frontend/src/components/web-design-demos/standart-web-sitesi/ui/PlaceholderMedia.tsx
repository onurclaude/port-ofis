import { cn } from "@/lib/utils";

export function PlaceholderMedia({
  label,
  className,
  variant = 0,
}: {
  label: string;
  className?: string;
  variant?: number;
}) {
  const angle = 18 + (variant % 4) * 9;

  return (
    <div
      data-placeholder="true"
      className={cn(
        "relative flex items-start overflow-hidden rounded-[20px] border border-hairline bg-surface-hover",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(${angle}deg, var(--color-gold) 0px, var(--color-gold) 1px, transparent 1px, transparent 28px)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 90% at 15% 0%, rgba(9,9,9,0.55), transparent 60%)",
        }}
      />
      <span className="relative z-10 p-5 font-sans text-xs uppercase tracking-[0.14em] text-muted">{label}</span>
    </div>
  );
}
