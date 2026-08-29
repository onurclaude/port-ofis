import type { DemoConfig } from "./demo-config";

type Address = DemoConfig["contact"]["address"];

export function formatAddress(address: Address): string {
  return [address.line1, address.district, address.city, address.country]
    .filter((part): part is string => Boolean(part))
    .join(", ");
}

export function mapsSearchUrl(address: Address): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(address))}`;
}
