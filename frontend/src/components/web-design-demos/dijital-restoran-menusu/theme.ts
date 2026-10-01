import type { MenuTenant } from "./menu-data";

/**
 * Ported from cafe-menu's src/lib/theme.ts: every restaurant picks just two
 * colors (brand + accent) and a light/dark mode, and every other tone the
 * menu needs (backgrounds, borders, muted text) is derived from those seeds.
 * The variables are scoped to the demo's wrapper element, so they never
 * leak into the rest of the site's theme.
 */

type HSL = { h: number; s: number; l: number };

function parseHex(hex: string): number {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return parseInt(full, 16);
}

function hexToHsl(hex: string): HSL {
  const bigint = parseHex(hex);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: HSL): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function hexToRgba(hex: string, alpha: number): string {
  const bigint = parseHex(hex);
  return `rgba(${(bigint >> 16) & 255},${(bigint >> 8) & 255},${bigint & 255},${alpha})`;
}

export type MenuThemeVars = Record<
  | "--bg"
  | "--surface"
  | "--surface-2"
  | "--ink"
  | "--ink-2"
  | "--ink-3"
  | "--line"
  | "--gold"
  | "--gold-hi"
  | "--gold-soft"
  | "--on-gold"
  | "--success"
  | "--warn"
  | "--hot",
  string
>;

export function buildMenuThemeVars(
  tenant: Pick<MenuTenant, "brandColor" | "accentColor" | "themeMode">
): MenuThemeVars {
  const brand = hexToHsl(tenant.brandColor);
  const accent = hexToHsl(tenant.accentColor);
  const sat = clamp(brand.s, 18, 55);

  if (tenant.themeMode === "dark") {
    const bg = hslToHex({ h: brand.h, s: sat * 0.62, l: 9 });
    const ink = "#f4efe4";
    return {
      "--bg": bg,
      "--surface": hslToHex({ h: brand.h, s: sat * 0.55, l: 14 }),
      "--surface-2": hslToHex({ h: brand.h, s: sat * 0.5, l: 19 }),
      "--ink": ink,
      "--ink-2": hexToRgba(ink, 0.6),
      "--ink-3": hexToRgba(ink, 0.36),
      "--line": hexToRgba(ink, 0.09),
      "--gold": tenant.accentColor,
      "--gold-hi": hslToHex({ h: accent.h, s: accent.s, l: clamp(accent.l + 12, 0, 92) }),
      "--gold-soft": hexToRgba(tenant.accentColor, 0.13),
      "--on-gold": bg,
      "--success": "#5fd39a",
      "--warn": "#e8a05a",
      "--hot": "#e87a5a",
    };
  }

  const ink = hslToHex({ h: brand.h, s: clamp(brand.s, 25, 45), l: 14 });
  const goldDeep = hslToHex({ h: accent.h, s: clamp(accent.s, 35, 70), l: clamp(accent.l - 28, 22, 45) });
  return {
    "--bg": hslToHex({ h: brand.h, s: sat * 0.28, l: 97 }),
    "--surface": "#ffffff",
    "--surface-2": hslToHex({ h: brand.h, s: sat * 0.24, l: 93 }),
    "--ink": ink,
    "--ink-2": hexToRgba(ink, 0.6),
    "--ink-3": hexToRgba(ink, 0.38),
    "--line": hexToRgba(ink, 0.09),
    "--gold": goldDeep,
    "--gold-hi": hslToHex({ h: accent.h, s: clamp(accent.s, 35, 70), l: clamp(accent.l - 40, 15, 35) }),
    "--gold-soft": hexToRgba(goldDeep, 0.09),
    "--on-gold": "#ffffff",
    "--success": "#186b4c",
    "--warn": "#a8621d",
    "--hot": "#b8452a",
  };
}
