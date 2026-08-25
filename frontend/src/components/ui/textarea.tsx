import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full resize-y rounded-sm border border-hairline-soft bg-ink-soft px-3.5 py-3 text-sm text-ivory placeholder:text-muted/60 transition-colors focus-visible:border-gold focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-red-500/60 focus-visible:border-red-500",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
