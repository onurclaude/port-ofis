// Light-theme class recipes shared by the sections of this demo. The rest of
// the site is dark-first, so these live here rather than in globals.css.
// Gold (#c9a24a) is too low-contrast for small text on ivory, so small
// accent text uses a darker bronze instead; plain gold stays for large type,
// lines and fills.

export const accentText = "text-[#7a5c22]";

export const eyebrow = "text-eyebrow font-sans uppercase text-[#7a5c22]";

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-ivory transition-colors duration-200 hover:bg-[#2a2a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a5c22]";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium tracking-wide text-ink transition-colors duration-200 hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a5c22]";

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
