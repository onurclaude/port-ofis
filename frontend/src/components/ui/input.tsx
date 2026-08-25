import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-sm border border-hairline-soft bg-ink-soft px-3.5 text-sm text-ivory placeholder:text-muted/60 transition-colors focus-visible:border-gold focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-red-500/60 focus-visible:border-red-500",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";
