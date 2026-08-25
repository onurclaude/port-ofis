import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  /** Renders just the pen-nib mark, without the wordmark — for tight spaces (favicons, admin collapsed state). */
  markOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { icon: 26, text: "text-lg", script: "text-xl" },
  md: { icon: 32, text: "text-xl", script: "text-2xl" },
  lg: { icon: 44, text: "text-3xl", script: "text-4xl" },
} as const;

/**
 * Fountain-pen nib mark, inspired by (not a copy of) references/brand/logo.png:
 * a gold cap tapering into an ivory nib body with a center slit and breather
 * hole, paired with the "Port" + cursive gold "ofis" wordmark.
 */
export function Logo({ className, markClassName, markOnly = false, size = "md" }: LogoProps) {
  const dims = SIZE_MAP[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <svg
        width={dims.icon}
        height={dims.icon * 1.25}
        viewBox="0 0 32 40"
        fill="none"
        aria-hidden="true"
        className={cn("shrink-0", markClassName)}
      >
        <path d="M4 16 H28 L16 38 Z" fill="var(--color-ivory)" />
        <rect x="10" y="2" width="12" height="15" rx="1.5" fill="var(--color-gold)" />
        <rect x="10" y="2" width="6" height="15" rx="1.5" fill="var(--color-gold-light)" opacity="0.55" />
        <line x1="16" y1="17" x2="16" y2="32" stroke="var(--color-ink)" strokeWidth="1.4" />
        <circle cx="16" cy="22.5" r="2.1" fill="var(--color-ink)" />
      </svg>
      {!markOnly && (
        <span className="inline-flex items-baseline leading-none">
          <span className={cn("font-display font-semibold tracking-wide text-ivory", dims.text)}>Port</span>
          <span className={cn("font-script text-gold-light -ml-0.5 -translate-y-0.5", dims.script)}>ofis</span>
        </span>
      )}
    </span>
  );
}
