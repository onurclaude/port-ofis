/**
 * Shared visual content for the site-wide Open Graph / Twitter card image.
 * Rendered via `next/og`'s `ImageResponse` (Satori) — plain inline styles only,
 * no Tailwind classes, every multi-child node needs an explicit `display`.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_IMAGE_ALT = "Port Ofis Kırtasiye — Eryaman Kırtasiye ve Dijital Baskı Merkezi";

const INK = "#090909";
const IVORY = "#F5F5F0";
const GOLD = "#C9A24A";
const MUTED = "#A5A5A5";

export function BrandOgImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: INK,
      }}
    >
      {/* thin gold rule lines, top and bottom — brand's signature framing device */}
      <div
        style={{ position: "absolute", top: 64, left: 96, right: 96, height: 1, background: "rgba(201,162,74,0.4)" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: 96,
          right: 96,
          height: 1,
          background: "rgba(201,162,74,0.4)",
        }}
      />

      {/* fountain-pen nib mark, matching src/app/icon.tsx */}
      <div style={{ display: "flex", marginBottom: 30 }}>
        <svg width="52" height="65" viewBox="0 0 32 40" fill="none">
          <path d="M4 16 H28 L16 38 Z" fill={IVORY} />
          <rect x="10" y="2" width="12" height="15" fill={GOLD} />
          <line x1="16" y1="17" x2="16" y2="32" stroke={INK} strokeWidth="1.6" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: 92, color: IVORY, letterSpacing: -1 }}>Port Ofis</div>
        <div style={{ display: "flex", fontSize: 34, color: GOLD, letterSpacing: 16, marginTop: 10 }}>
          KIRTASİYE
        </div>
      </div>

      <div style={{ display: "flex", width: 64, height: 2, background: GOLD, marginTop: 36 }} />

      <div style={{ display: "flex", fontSize: 24, color: MUTED, letterSpacing: 1, marginTop: 28 }}>
        Kırtasiye · Dijital Baskı · Kurumsal Çözümler
      </div>
    </div>
  );
}
