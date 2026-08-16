"use client";

import { useRef, useState } from "react";
import { Eyebrow, Panel } from "@/components/ui";

const SIZE = 400;
/** The plane runs −LIM…+LIM on both axes. */
const LIM = 10;
/** Gridlines every unit, labels every STEP. */
const STEP = 5;

/** Plane coordinate → SVG coordinate. y flips, because SVG counts downward. */
const sx = (x: number) => ((x + LIM) / (2 * LIM)) * SIZE;
const sy = (y: number) => ((LIM - y) / (2 * LIM)) * SIZE;

const clamp = (n: number) => Math.max(-LIM, Math.min(LIM, n));

/**
 * Which quadrant a point is in, by the classical numbering: I is upper-right
 * and they run anticlockwise. On an axis it belongs to none of them, which is
 * worth saying out loud — zero is the case people forget.
 */
function quadrantOf(x: number, y: number): { name: string; note: string } {
  if (x === 0 && y === 0) {
    return { name: "the origin", note: "Both coordinates zero — the centre." };
  }
  if (x === 0) return { name: "the y-axis", note: "x is zero, so it sits on the vertical." };
  if (y === 0) return { name: "the x-axis", note: "y is zero, so it sits on the horizontal." };
  if (x > 0 && y > 0) return { name: "quadrant I", note: "Both positive." };
  if (x < 0 && y > 0) return { name: "quadrant II", note: "x negative, y positive." };
  if (x < 0 && y < 0) return { name: "quadrant III", note: "Both negative." };
  return { name: "quadrant IV", note: "x positive, y negative." };
}

/**
 * The first idea in the course, made draggable: a position is a pair of
 * numbers, and the sign of each one is what a quadrant actually is. Everything
 * later that turns an object into a vector is this, with more than two numbers.
 */
export function Quadrant() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [point, setPoint] = useState({ x: 6, y: 4 });
  const [dragging, setDragging] = useState(false);

  /** Reads a pointer position off the live box, so it survives any resize. */
  function moveTo(clientX: number, clientY: number) {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const px = ((clientX - box.left) / box.width) * 2 * LIM - LIM;
    const py = LIM - ((clientY - box.top) / box.height) * 2 * LIM;
    setPoint({ x: clamp(Math.round(px)), y: clamp(Math.round(py)) });
  }

  const quadrant = quadrantOf(point.x, point.y);
  const length = Math.sqrt(point.x ** 2 + point.y ** 2);

  const ticks: number[] = [];
  for (let t = -LIM; t <= LIM; t++) ticks.push(t);

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">Drag it</Eyebrow>
          <div className="font-mono text-[16px] sm:text-[19px] font-medium text-ink break-words">
            v = [{point.x}, {point.y}]
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-xs">
          <span className="text-gold">{quadrant.name}</span>
          <span className="text-ink-faint">‖v‖ = {length.toFixed(2)}</span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`A point at x ${point.x}, y ${point.y}, in ${quadrant.name}`}
        className="w-full h-auto bg-inset border border-line rounded-md touch-none cursor-crosshair"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          moveTo(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (!dragging) return;
          moveTo(event.clientX, event.clientY);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {/* The lit quadrant. Tinting the region the point is in is what makes
            the sign rule visible rather than stated. */}
        {point.x !== 0 && point.y !== 0 && (
          <rect
            x={point.x > 0 ? sx(0) : 0}
            y={point.y > 0 ? 0 : sy(0)}
            width={SIZE / 2}
            height={SIZE / 2}
            fill="var(--accent)"
            opacity="0.07"
          />
        )}

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={sx(t)}
              y1="0"
              x2={sx(t)}
              y2={SIZE}
              stroke="var(--line)"
              strokeWidth={t % STEP === 0 ? 1 : 0.5}
            />
            <line
              x1="0"
              y1={sy(t)}
              x2={SIZE}
              y2={sy(t)}
              stroke="var(--line)"
              strokeWidth={t % STEP === 0 ? 1 : 0.5}
            />
          </g>
        ))}

        <line x1="0" y1={sy(0)} x2={SIZE} y2={sy(0)} stroke="var(--line-strong)" strokeWidth="1.5" />
        <line x1={sx(0)} y1="0" x2={sx(0)} y2={SIZE} stroke="var(--line-strong)" strokeWidth="1.5" />

        {[-STEP, STEP].map((t) => (
          <g key={t} className="font-mono">
            <text x={sx(t)} y={sy(0) + 14} fill="var(--ink-ghost)" fontSize="11" textAnchor="middle">
              {t}
            </text>
            <text x={sx(0) - 7} y={sy(t) + 4} fill="var(--ink-ghost)" fontSize="11" textAnchor="end">
              {t}
            </text>
          </g>
        ))}

        {/* The two legs: how far across, then how far up. The components. */}
        <line
          x1={sx(0)}
          y1={sy(0)}
          x2={sx(point.x)}
          y2={sy(0)}
          stroke="var(--ink-ghost)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1={sx(point.x)}
          y1={sy(0)}
          x2={sx(point.x)}
          y2={sy(point.y)}
          stroke="var(--ink-ghost)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <line
          x1={sx(0)}
          y1={sy(0)}
          x2={sx(point.x)}
          y2={sy(point.y)}
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
        <circle
          cx={sx(point.x)}
          cy={sy(point.y)}
          r={dragging ? 9 : 7}
          fill="var(--gold)"
          stroke="var(--gold)"
          className="transition-all duration-150"
        />
      </svg>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[13px] leading-[1.6] text-ink-muted">
          {quadrant.note} Drag the point, or use the arrows below.
        </p>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["x − 1", { x: clamp(point.x - 1), y: point.y }],
              ["x + 1", { x: clamp(point.x + 1), y: point.y }],
              ["y − 1", { x: point.x, y: clamp(point.y - 1) }],
              ["y + 1", { x: point.x, y: clamp(point.y + 1) }],
              ["reset", { x: 6, y: 4 }],
            ] as const
          ).map(([label, next]) => (
            <button
              key={label}
              onClick={() => setPoint(next)}
              className="font-mono text-[12.5px] px-3 py-2 rounded-md border border-line text-ink-muted hover:text-ink hover:border-line-strong cursor-pointer transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
