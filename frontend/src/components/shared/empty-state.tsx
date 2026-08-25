import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-hairline px-6 py-16 text-center",
        className,
      )}
    >
      <Icon className="size-8 text-gold/70" aria-hidden="true" />
      <p className="font-display text-xl text-ivory">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
