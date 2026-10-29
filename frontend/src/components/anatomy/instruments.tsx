"use client";

import { AnatomyStage, Threads, type AnatomyPart } from "@/components/anatomy/anatomy-stage";

const LINE = "var(--color-ivory)";
const SW = 1.2;

/** Cylinder-ish body: flat fill, a light stripe on top and a shade stripe underneath. */
function Body({
  w,
  h,
  fill,
  rx = 0,
  opacity = 1,
}: {
  w: number;
  h: number;
  fill: string;
  rx?: number;
  opacity?: number;
}) {
  return (
    <g>
      <rect x={0} y={-h} width={w} height={2 * h} rx={rx} fill={fill} fillOpacity={opacity} stroke={LINE} strokeWidth={SW} />
      <line x1={rx + 2} x2={w - rx - 2} y1={-h * 0.5} y2={-h * 0.5} stroke="#fff" strokeOpacity={0.3} strokeWidth={1.2} />
      <line x1={rx + 2} x2={w - rx - 2} y1={h * 0.55} y2={h * 0.55} stroke="#000" strokeOpacity={0.18} strokeWidth={1.2} />
    </g>
  );
}

/** Tapered body, wide on the left. */
function Taper({ w, h1, h2, fill }: { w: number; h1: number; h2: number; fill: string }) {
  return (
    <g>
      <path d={`M0 ${-h1} L${w} ${-h2} L${w} ${h2} L0 ${h1} Z`} fill={fill} stroke={LINE} strokeWidth={SW} />
      <line x1={3} x2={w - 3} y1={-(h1 + h2) / 4} y2={-(h1 + h2) / 4} stroke="#fff" strokeOpacity={0.28} strokeWidth={1.2} />
    </g>
  );
}

const STEEL = "#c8c9cb";
const DARK = "#2b2724";
const GOLD = "#c9a24a";

/* ---------- LAMY 2000 · pistonlu dolma kalem ---------- */

const LAMY_PARTS: AnatomyPart[] = [
  {
    label: "Piston düğmesi",
    note: "Çevirince pistonu oynatır",
    w: 34,
    h: 15,
    asm: 0,
    lag: 0.05,
    draw: (w) => (
      <g>
        <Body w={w} h={15} fill="#3a3633" rx={5} />
        {[10, 17, 24].map((x) => (
          <line key={x} x1={x} x2={x} y1={-13} y2={13} stroke="#fff" strokeOpacity={0.22} />
        ))}
      </g>
    ),
  },
  {
    label: "Vidalı piston mili",
    note: "Dönüşü harekete çevirir",
    w: 120,
    h: 4.5,
    asm: 34,
    z: -3,
    lag: 0.4,
    threaded: true,
    draw: (w, t) => (
      <g>
        <Body w={w} h={4.5} fill="#b9babc" />
        <Threads t={t} w={w} h={4.5} pitch={5} turns={9} />
      </g>
    ),
  },
  {
    label: "Piston contası",
    note: "Mürekkebi sızdırmaz tutar",
    w: 22,
    h: 12,
    asm: 154,
    z: -3,
    lag: 0.42,
    draw: (w) => (
      <g>
        <Body w={w} h={12} fill="#4a4540" rx={3} />
        <line x1={7} x2={7} y1={-12} y2={12} stroke="#fff" strokeOpacity={0.3} />
        <line x1={15} x2={15} y1={-12} y2={12} stroke="#fff" strokeOpacity={0.3} />
      </g>
    ),
  },
  {
    label: "Fiberglas gövde",
    note: "Mürekkep penceresi var",
    w: 240,
    h: 17,
    asm: 30,
    lag: 0.24,
    draw: (w) => (
      <g>
        <Body w={w} h={17} fill={DARK} />
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1={8 + i * 15} x2={14 + i * 15} y1={-12} y2={12} stroke="#fff" strokeOpacity={0.07} />
        ))}
        <rect x={150} y={-6} width={52} height={12} rx={3} fill="#e9eef5" stroke={LINE} strokeWidth={0.8} />
        <rect x={150} y={0} width={52} height={6} rx={2} fill="#2f5fbf" fillOpacity={0.75} />
      </g>
    ),
  },
  {
    label: "Vidalı tutacak",
    note: "Gövdeye vidalanır",
    w: 110,
    h: 15,
    asm: 240,
    z: -1,
    lag: 0.12,
    threaded: true,
    draw: (w, t) => (
      <g>
        <Taper w={w} h1={15} h2={10} fill="#3a3633" />
        <rect x={0} y={-9} width={34} height={18} fill="#8d8f92" stroke={LINE} strokeWidth={SW} />
        <Threads t={t} w={34} h={9} pitch={5} turns={9} />
      </g>
    ),
  },
  {
    label: "Besleyici",
    note: "Mürekkebi uca eşit taşır",
    w: 60,
    h: 7,
    asm: 330,
    z: -2,
    lag: 0.3,
    draw: (w) => (
      <g>
        <Body w={w} h={7} fill="#55514d" />
        {[12, 21, 30, 39, 48].map((x) => (
          <line key={x} x1={x} x2={x} y1={-7} y2={7} stroke="#fff" strokeOpacity={0.3} />
        ))}
      </g>
    ),
  },
  {
    label: "Kapalı altın uç",
    note: "14 ayar altın, platin kaplama",
    w: 95,
    h: 10,
    asm: 340,
    z: -1,
    lag: 0.28,
    draw: (w) => (
      <g>
        <path d={`M0 -10 L44 -10 Q${w - 14} -9 ${w} -1 L${w} 1 Q${w - 14} 9 44 10 L0 10 Z`} fill="#d6d7d9" stroke={LINE} strokeWidth={SW} />
        <line x1={8} x2={w - 14} y1={-4} y2={-4} stroke="#fff" strokeOpacity={0.5} />
        <circle cx={w - 3} cy={0} r={1.6} fill={GOLD} />
      </g>
    ),
  },
  {
    label: "Kapak ve klips",
    note: "Yaylı klips, cebe tutunur",
    w: 170,
    h: 19,
    asm: 285,
    z: 2,
    lag: 0,
    draw: (w) => (
      <g>
        <Body w={w} h={19} fill={DARK} rx={4} />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={10 + i * 15} x2={16 + i * 15} y1={-14} y2={14} stroke="#fff" strokeOpacity={0.07} />
        ))}
        <path d={`M16 -19 v-8 h${w - 60} a4 4 0 0 1 4 4 v4`} fill="none" stroke={STEEL} strokeWidth={5} strokeLinecap="round" />
        <rect x={w - 14} y={-19} width={8} height={38} fill={STEEL} stroke={LINE} strokeWidth={0.8} />
      </g>
    ),
  },
];

export function Lamy2000Anatomy() {
  return (
    <AnatomyStage
      eyebrow="Anatomi · Lamy 2000 · 1966"
      title="Bauhaus'tan çıkan dolma kalem."
      description="Gerd A. Müller'in tasarımı, Lamy'nin sayfalarında red dot, iF, German Design Award ve Good Design Award ile anılıyor. İçinde vidalı bir mil, dönüşü pistona çevirir."
      parts={LAMY_PARTS}
      gap={14}
      tone="paper"
    />
  );
}

/* ---------- UNI KURU TOGA · kendi kendine dönen kurşun ---------- */

function Sawtooth({ side, w, h, fill }: { side: "left" | "right"; w: number; h: number; fill: string }) {
  const teeth = 5;
  const tw = 5;
  const step = (2 * h) / teeth;
  const edgeX = side === "right" ? w : 0;
  const dir = side === "right" ? 1 : -1;
  let d = `M${side === "right" ? 0 : w} ${-h} L${edgeX} ${-h}`;
  for (let i = 0; i < teeth; i++) {
    const y0 = -h + i * step;
    d += ` L${edgeX - dir * tw} ${y0 + step * 0.5} L${edgeX} ${y0 + step}`;
  }
  d += ` L${side === "right" ? 0 : w} ${h} Z`;
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={SW} strokeLinejoin="round" />;
}

const TOGA_PARTS: AnatomyPart[] = [
  {
    label: "Silgi",
    note: "Çıkarılıp yenilenebilir",
    w: 44,
    h: 8,
    asm: 0,
    lag: 0.05,
    draw: (w) => (
      <g>
        <Body w={16} h={8} fill={STEEL} />
        <rect x={16} y={-7} width={w - 16} height={14} rx={3} fill="#f0b9b3" stroke={LINE} strokeWidth={SW} />
      </g>
    ),
  },
  {
    label: "Metal gövde",
    note: "Tırtıllı tutacak bölümü",
    w: 290,
    h: 14,
    asm: 40,
    lag: 0.22,
    draw: (w) => (
      <g>
        <Body w={w} h={14} fill="#6f7378" />
        <rect x={w - 110} y={-14} width={110} height={28} fill="#5b5f64" stroke={LINE} strokeWidth={SW} />
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={w - 106 + i * 6} x2={w - 100 + i * 6} y1={-14} y2={14} stroke="#fff" strokeOpacity={0.25} />
        ))}
      </g>
    ),
  },
  {
    label: "Kurşun tüpü",
    note: "Kurşunlar burada bekler",
    w: 150,
    h: 4.5,
    asm: 70,
    z: -3,
    lag: 0.5,
    draw: (w) => (
      <g>
        <Body w={w} h={4.5} fill="#ececec" />
        <line x1={4} x2={w - 4} y1={-1.2} y2={-1.2} stroke="#333" strokeWidth={1} />
        <line x1={4} x2={w - 4} y1={1.4} y2={1.4} stroke="#333" strokeWidth={1} />
      </g>
    ),
  },
  {
    label: "Yay",
    note: "Motoru geri iter",
    w: 72,
    h: 9,
    asm: 222,
    z: -3,
    lag: 0.46,
    draw: (w) => {
      const turns = 9;
      const step = w / turns;
      let d = `M0 0`;
      for (let i = 0; i < turns; i++) d += ` L${i * step + step * 0.25} -9 L${i * step + step * 0.75} 9 L${(i + 1) * step} 0`;
      return <path d={d} fill="none" stroke={LINE} strokeWidth={1.6} strokeLinejoin="round" />;
    },
  },
  {
    label: "Sabit dişli disk",
    note: "Motorun ilk yarısı",
    w: 30,
    h: 11,
    asm: 294,
    z: -3,
    lag: 0.42,
    draw: (w) => <Sawtooth side="right" w={w} h={11} fill="#b9bcc0" />,
  },
  {
    label: "Dönen dişli disk",
    note: "Her vuruşta kurşunu çevirir",
    w: 30,
    h: 11,
    asm: 324,
    z: -3,
    lag: 0.38,
    draw: (w) => <Sawtooth side="left" w={w} h={11} fill="#d9dbde" />,
  },
  {
    label: "Mandren",
    note: "Kurşunu tutar ve bırakır",
    w: 52,
    h: 7,
    asm: 354,
    z: -3,
    lag: 0.34,
    draw: (w) => (
      <g>
        <Body w={w} h={7} fill="#a9acb0" />
        <path d={`M${w - 22} -7 L${w} -2 M${w - 22} 7 L${w} 2`} stroke={LINE} strokeWidth={1.2} fill="none" />
        <line x1={w - 22} x2={w - 22} y1={-7} y2={7} stroke={LINE} strokeWidth={0.8} />
      </g>
    ),
  },
  {
    label: "Vidalı konik uç",
    note: "Gövdeye vidalanır",
    w: 100,
    h: 14,
    asm: 326,
    z: -1,
    lag: 0.14,
    threaded: true,
    draw: (w, t) => (
      <g>
        <Taper w={w} h1={14} h2={6} fill="#6f7378" />
        <rect x={0} y={-10} width={34} height={20} fill="#9a9da1" stroke={LINE} strokeWidth={SW} />
        <Threads t={t} w={34} h={10} pitch={5} turns={9} />
      </g>
    ),
  },
  {
    label: "Uç borusu",
    note: "Kurşun buradan çıkar",
    w: 70,
    h: 5,
    asm: 410,
    z: -2,
    lag: 0.06,
    draw: (w) => (
      <g>
        <Body w={w} h={5} fill="#c9cbce" />
        <line x1={w - 22} x2={w - 22} y1={-5} y2={5} stroke={LINE} strokeWidth={0.8} />
        <rect x={w} y={-1} width={16} height={2} fill="#333" />
      </g>
    ),
  },
];

export function KuruTogaAnatomy() {
  return (
    <AnatomyStage
      eyebrow="Anatomi · Uni Kuru Toga Metal"
      title="Kurşunu kendi çeviren kalem."
      description="Üreticiye göre Kuru Toga Metal 2024'te Japonya'da Good Design Award aldı. İki dişli disk, her yazışta kurşunu biraz çevirip ucu sivri tutar."
      parts={TOGA_PARTS}
      gap={12}
      tone="paper"
    />
  );
}

/* ---------- BIC CRISTAL · MoMA koleksiyonunda ---------- */

const BIC_BLUE = "#2f5fbf";

function HexLines({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <line x1={0} x2={w} y1={-h * 0.5} y2={-h * 0.5} stroke={LINE} strokeOpacity={0.5} strokeWidth={0.9} />
      <line x1={0} x2={w} y1={h * 0.5} y2={h * 0.5} stroke={LINE} strokeOpacity={0.5} strokeWidth={0.9} />
    </g>
  );
}

const BIC_PARTS: AnatomyPart[] = [
  {
    label: "Arka tıkaç",
    note: "Mürekkep rengini taşır",
    w: 30,
    h: 9,
    asm: 0,
    lag: 0.08,
    draw: (w) => <Body w={w} h={9} fill={BIC_BLUE} rx={3} />,
  },
  {
    label: "Altıgen gövde",
    note: "Yan delik basıncı dengeler",
    w: 320,
    h: 10.5,
    asm: 26,
    lag: 0.2,
    draw: (w) => (
      <g>
        <Body w={w} h={10.5} fill="#dfe8f2" opacity={0.7} />
        <HexLines w={w} h={10.5} />
        <circle cx={96} cy={-5.2} r={1.7} fill={LINE} />
      </g>
    ),
  },
  {
    label: "Mürekkep tüpü",
    note: "Mürekkep yerçekimiyle uca iner",
    w: 304,
    h: 4,
    asm: 36,
    z: -3,
    lag: 0.45,
    draw: (w) => (
      <g>
        <Body w={w} h={4} fill="#f4f6f9" />
        <rect x={1} y={-3} width={w * 0.72} height={6} fill={BIC_BLUE} fillOpacity={0.85} />
      </g>
    ),
  },
  {
    label: "Pirinç uç yuvası",
    note: "Bilyayı yuvasında tutar",
    w: 52,
    h: 5.5,
    asm: 340,
    z: -1,
    lag: 0.3,
    draw: (w) => (
      <g>
        <Taper w={w} h1={5.5} h2={2.8} fill="#c8a35e" />
        <line x1={14} x2={14} y1={-5} y2={5} stroke={LINE} strokeWidth={0.8} />
      </g>
    ),
  },
  {
    label: "Tungsten karbür bilya",
    note: "1 mm, yazdıkça döner",
    w: 8,
    h: 3.2,
    asm: 389,
    z: 1,
    lag: 0.36,
    draw: () => (
      <g>
        <circle cx={4} cy={0} r={3.4} fill="#8c8f94" stroke={LINE} strokeWidth={SW} />
        <circle cx={3} cy={-1.1} r={0.9} fill="#fff" fillOpacity={0.7} />
      </g>
    ),
  },
  {
    label: "Kapak",
    note: "Delik, boğulma riskine karşı",
    w: 154,
    h: 11.5,
    asm: 258,
    z: 2,
    lag: 0,
    draw: (w) => (
      <g>
        <Body w={w} h={11.5} fill={BIC_BLUE} rx={3} />
        <HexLines w={w} h={11.5} />
        <circle cx={w - 12} cy={0} r={2.2} fill="#fff" stroke={LINE} strokeWidth={0.8} />
        <path d={`M14 -11.5 v-4 h${w - 70} v4`} fill="none" stroke={BIC_BLUE} strokeWidth={4} strokeLinecap="round" />
      </g>
    ),
  },
];

export function BicCristalAnatomy() {
  return (
    <AnatomyStage
      eyebrow="Anatomi · Bic Cristal · 1950"
      title="Müzeye giren tükenmez kalem."
      description="MoMA'nın kalıcı koleksiyonunda yer alıyor ve dünyanın en çok satan kalemi sayılıyor. Altı parça, altıgen bir gövde ve 1 mm'lik bir bilya."
      parts={BIC_PARTS}
      gap={22}
      tone="soft"
    />
  );
}
