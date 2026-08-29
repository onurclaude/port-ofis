import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<Variant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-light active:scale-[0.98]",
  secondary: "border border-hairline text-text hover:border-gold hover:text-gold active:scale-[0.98]",
  ghost: "text-text hover:text-gold",
};

type LinkButtonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type NativeButtonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export function Button({ variant = "primary", className, children, ...rest }: LinkButtonProps | NativeButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
