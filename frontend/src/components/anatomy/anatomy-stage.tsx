"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/layout/container";

/**
 * Exploded view of a pen/pencil drawn horizontally (tip to the right).
 *
 * Every part is drawn in its own frame (x from 0 to `w`, pen axis at y = 0) and has an
 * assembled position (`asm`). The exploded positions are laid out automatically, in array
 * order, evenly spread along the axis. `t` runs 0 (assembled) → 1 (exploded).
 *
 * Assembly order comes from `lag`: a part starts leaving its seat once t passes `lag`, so on
 * the way back (t → 0) parts with a large lag settle first and the outer shell closes last.
 * Threaded parts (`threaded`) stop travelling a little earlier than everything else and keep
 * turning in place — their thread lines (see `Threads`) are driven by the whole 0..1 range —
 * which reads as the final turns of tightening a screw.
 */

export interface AnatomyPart {
  label: string;
  note: string;
  /** length of the part along the axis */
  w: number;
  /** half thickness, used to anchor the leader line */
  h: number;
  /** left edge when assembled */
  asm: number;
  /** draw order; inner parts use negative values so the outer shell hides them */
  z?: number;
  /** extra sideways lift when exploded (negative = up) */
  lift?: number;
  /** 0..0.6 — larger settles earlier when assembling */
  lag?: number;
  threaded?: boolean;
  draw: (w: number, t: MotionValue<number>) => React.ReactNode;
}

interface AnatomyStageProps {
  eyebrow: string;
  title: string;
  description: string;
  parts: AnatomyPart[];
  /** gap between neighbouring parts when exploded */
  gap?: number;
  tone?: "paper" | "soft";
}

const VIEW_W = 1100;
const VIEW_H = 400;
const AXIS = 200;
const TIGHTEN = 0.16;

/** Slanted thread lines that creep along the part as `t` changes, so the part seems to turn. */
export function Threads({
  t,
  w,
  h,
  x0 = 0,
  pitch = 6,
  turns = 7,
}: {
  t: MotionValue<number>;
  w: number;
  h: number;
  x0?: number;
  pitch?: number;
  turns?: number;
}) {
  const id = useId().replace(/:/g, "");
  const phase = useTransform(t, (v) => (v * turns * pitch) % pitch);
  const count = Math.ceil(w / pitch) + 4;

  return (
    <g>
      <clipPath id={id}>
        <rect x={x0} y={-h} width={w} height={2 * h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <motion.g style={{ x: phase }}>
          {Array.from({ length: count }, (_, i) => {
            const x = x0 + (i - 2) * pitch;
            return (
              <line
                key={i}
                x1={x}
                y1={-h}
                x2={x + h * 0.8}
                y2={h}
                stroke="var(--color-ivory)"
                strokeWidth={1}
                strokeOpacity={0.6}
              />
            );
          })}
        </motion.g>
      </g>
    </g>
  );
}

function StagePart({
  t,
  part,
  dx,
  children,
}: {
  t: MotionValue<number>;
  part: AnatomyPart;
  dx: number;
  children: React.ReactNode;
}) {
  const lag = part.lag ?? 0;
  const start = lag + (part.threaded ? TIGHTEN : 0);
  // Each part travels in its own window, so the parts arrive one after another.
  const end = Math.min(start + 0.45, 1);
  const x = useTransform(t, [start, end], [0, dx]);
  const y = useTransform(t, [start, end], [0, part.lift ?? 0]);
  return <motion.g style={{ x, y }}>{children}</motion.g>;
}

function StageCallout({
  t,
  cx,
  side,
  level,
  anchor,
  title,
  note,
}: {
  t: MotionValue<number>;
  cx: number;
  side: "up" | "down";
  /** 0 = far from the pen, 1 = near; neighbours on one side alternate so wide labels never collide */
  level: 0 | 1;
  anchor: number;
  title: string;
  note: string;
}) {
  const opacity = useTransform(t, [0.75, 1], [0, 1]);
  const up = side === "up";
  const target = up ? AXIS - anchor : AXIS + anchor;
  const inset = level === 0 ? 0 : 66;
  const lineEnd = up ? 78 + inset : VIEW_H - 78 - inset;
  const titleY = up ? 36 + inset : VIEW_H - 46 - inset;
  const noteY = up ? 56 + inset : VIEW_H - 26 - inset;

  return (
    <motion.g style={{ opacity }}>
      <line x1={cx} x2={cx} y1={lineEnd} y2={target} stroke="var(--color-hairline)" strokeWidth={1} />
      <circle cx={cx} cy={target} r={2.8} fill="var(--color-gold)" />
      <text x={cx} y={titleY} textAnchor="middle" fill="var(--color-ivory)" fontSize={15} fontWeight={700} letterSpacing={-0.3}>
        {title}
      </text>
      <text x={cx} y={noteY} textAnchor="middle" fill="var(--color-muted)" fontSize={12.5} letterSpacing={-0.2}>
        {note}
      </text>
    </motion.g>
  );
}

export function AnatomyStage({ eyebrow, title, description, parts, gap = 18, tone = "soft" }: AnatomyStageProps) {
  const reduceMotion = useReducedMotion();
  const t = useMotionValue(0);
  const [open, setOpen] = useState(false);
  const touched = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.6 });

  const go = (next: boolean) => {
    setOpen(next);
    animate(t, next ? 1 : 0, {
      duration: reduceMotion ? 0 : next ? 1.6 : 4.2,
      ease: next ? [0.22, 1, 0.36, 1] : [0.3, 0, 0.3, 1],
    });
  };

  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => {
      if (!touched.current) go(true);
    }, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const totalW = parts.reduce((s, p) => s + p.w, 0) + gap * (parts.length - 1);
  const asmMin = Math.min(...parts.map((p) => p.asm));
  const asmMax = Math.max(...parts.map((p) => p.asm + p.w));
  const asmShift = VIEW_W / 2 - (asmMin + asmMax) / 2;

  const laid = parts.map((p, i) => {
    const exLeft = (VIEW_W - totalW) / 2 + parts.slice(0, i).reduce((s, q) => s + q.w + gap, 0);
    const asmLeft = p.asm + asmShift;
    return { part: p, asmLeft, dx: exLeft - asmLeft, cx: exLeft + p.w / 2, i };
  });
  const drawOrder = [...laid].sort((a, b) => (a.part.z ?? 0) - (b.part.z ?? 0));

  const axisOpacity = useTransform(t, [0.1, 0.7], [0, 1]);

  return (
    <section
      aria-label={`${title} — anatomi`}
      className={tone === "soft" ? "border-y border-hairline-soft bg-ink-soft py-24 sm:py-28" : "bg-ink py-24 sm:py-28"}
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.045em] text-ivory sm:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-snug tracking-[-0.02em] text-muted">{description}</p>
        </div>

        <div ref={stageRef} className="mt-12 overflow-x-auto">
          <button
            type="button"
            aria-pressed={open}
            aria-label={open ? "Parçaları vidalayıp topla" : "Parçalarına ayır"}
            onClick={() => {
              touched.current = true;
              go(!open);
            }}
            className="mx-auto block w-full min-w-[900px] max-w-6xl cursor-pointer rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-gold"
          >
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-hidden="true" className="block h-auto w-full">
              <motion.line
                x1={20}
                x2={VIEW_W - 20}
                y1={AXIS}
                y2={AXIS}
                stroke="var(--color-hairline)"
                strokeWidth={1}
                strokeDasharray="3 7"
                style={{ opacity: axisOpacity }}
              />
              {drawOrder.map(({ part, asmLeft, dx }) => (
                <g key={part.label} transform={`translate(${asmLeft} ${AXIS})`}>
                  <StagePart t={t} part={part} dx={dx}>
                    {part.draw(part.w, t)}
                  </StagePart>
                </g>
              ))}
              {laid.map(({ part, cx, i }) => (
                <StageCallout
                  key={part.label}
                  t={t}
                  cx={cx}
                  side={i % 2 === 0 ? "up" : "down"}
                  level={Math.floor(i / 2) % 2 === 0 ? 0 : 1}
                  anchor={part.h + 12 + Math.abs(part.lift ?? 0)}
                  title={part.label}
                  note={part.note}
                />
              ))}
            </svg>
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              touched.current = true;
              go(!open);
            }}
            className="inline-flex h-11 items-center rounded-lg bg-ivory px-6 text-sm font-bold tracking-tight text-ink transition-colors hover:bg-gold"
          >
            {open ? "Vidala ve topla" : "Parçalarına ayır"}
          </button>
        </div>
      </Container>
    </section>
  );
}
