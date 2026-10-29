import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  /** Renders just the "P" + nib mark, without the wordmark — for tight spaces (favicons, admin collapsed state). */
  markOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { icon: 26, text: "text-base", script: "text-xl" },
  md: { icon: 32, text: "text-xl", script: "text-2xl" },
  lg: { icon: 44, text: "text-3xl", script: "text-4xl" },
} as const;

/**
 * Redraw of references/brand/logo (business card): a "P" whose stem opens into
 * a gold block on top and a fountain-pen nib below, plus "PORT" + script
 * "ofis". Colors come from tokens, so it flips with `.theme-dark`.
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
        {/* bowl of the P */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 1h6a9 9 0 0 1 0 18h-6V1Zm0 5h5a4 4 0 0 1 0 8h-5V6Z"
          fill="var(--color-ivory)"
        />
        {/* gold stem block */}
        <rect x="2" y="1" width="12" height="18" fill="var(--color-gold)" />
        {/* nib */}
        <path d="M2 21h12l-6 17-6-17Z" fill="var(--color-ivory)" />
        <line x1="8" y1="26" x2="8" y2="38" stroke="var(--color-ink)" strokeWidth="1.1" />
        <circle cx="8" cy="26" r="1.7" fill="var(--color-ink)" />
      </svg>
      {!markOnly && (
        <span className="inline-flex items-baseline leading-none">
          <span className={cn("font-display font-extrabold uppercase tracking-[0.04em] text-ivory", dims.text)}>
            Port
          </span>
          <span className={cn("font-script text-gold -ml-0.5 translate-y-0.5 pl-1", dims.script)}>ofis</span>
        </span>
      )}
    </span>
  );
}
