"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-sm border border-hairline-soft bg-ink-soft px-3.5 text-sm text-ivory transition-colors focus-visible:border-gold focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted/60",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 text-muted" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-sm border border-hairline bg-ink-soft shadow-2xl",
          className,
        )}
        position="popper"
        sideOffset={4}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm text-ivory outline-none data-[highlighted]:bg-surface data-[highlighted]:text-gold",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2.5 inline-flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 text-gold" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
