import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatPrice(price: number | null): string | null {
  if (price === null || price === undefined) return null;
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price} TL`;
  }
}
