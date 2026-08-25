"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border border-hairline-soft bg-ink-soft transition-colors data-[state=checked]:border-gold data-[state=checked]:bg-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-1 rounded-full bg-ivory transition-transform data-[state=checked]:translate-x-6" />
    </SwitchPrimitive.Root>
  );
}
