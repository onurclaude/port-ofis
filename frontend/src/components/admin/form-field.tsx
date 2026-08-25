import { Label } from "@/components/ui/label";

export function FormField({
  htmlFor,
  label,
  error,
  children,
  className,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
