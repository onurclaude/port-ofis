import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("mb-2 block text-xs font-medium uppercase tracking-wide text-muted", className)}
      {...props}
    />
  );
}
