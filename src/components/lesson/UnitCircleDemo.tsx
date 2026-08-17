"use client";

import { useRef, useState } from "react";
import { Eyebrow, Panel, cx } from "@/components/ui";

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
/** Pixels per unit. The circle has radius 1, so this is also the radius. */
const R = 150;

const px = (x: number) => CX + x * R;
const py = (y: number) => CY - y * R;

const TAU = Math.PI * 2;

/** The angles worth landing on exactly, as multiples of π. */
const LANDMARKS: [label: string, theta: number][] = [
  ["0", 0],
  ["π/6", Math.PI / 6],
  ["π/4", Math.PI / 4],
  ["π/3", Math.PI / 3],
  ["π/2", Math.PI / 2],
  ["2π/3", (2 * Math.PI) / 3],
  ["3π/4", (3 * Math.PI) / 4],
  ["π", Math.PI],
  ["3π/2", (3 * Math.PI) / 2],
];

/** −0.50 rather than -0.50, and a real minus sign. */
const num = (n: number) => {
  const s = n.toFixed(3);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
};

/**
 * The unit circle, draggable.
 *
 * This lesson's whole content is that the two coordinates of a point on a
 * circle of radius 1 ARE the cosine and the sine, and that the angle is the
 * arc length rather than an abstract quantity. Both are facts about a picture,
 * and the course taught them for a long time without one.
 *
 * The arc is drawn in the same colour as the angle readout on purpose: the
 * radian measure and the length of that arc are literally the same number, and
 * that identity is what makes d/dθ sin θ = cos θ come out with no stray
 * constant — the argument the rigor layer makes for this lesson.
 */
export function UnitCircleDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [theta, setTheta] = useState(Math.PI / 6);
  const [dragging, setDragging] = useState(false);

  function moveTo(clientX: number, clientY: number) {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    // Into the SVG's own coordinates, then into plane coordinates.
    const x = ((clientX - box.left) / box.width) * SIZE - CX;
    const y = CY - ((clientY - box.top) / box.height) * SIZE;
    const next = Math.atan2(y, x);
    setTheta(next < 0 ? next + TAU : next);
  }

  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const degrees = (theta * 180) / Math.PI;
  // tan is the ratio, and it is genuinely undefined where cos is zero.
  const cosNearZero = Math.abs(cos) < 1e-9;

  // The travelled arc, as an SVG path. The large-arc flag is what keeps it
  // correct once past half a turn.
  const arc = [
    `M ${px(1)} ${py(0)}`,
    `A ${R} ${R} 0 ${theta > Math.PI ? 1 : 0} 0 ${px(cos)} ${py(sin)}`,
  ].join(" ");

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">Turn it</Eyebrow>
          <div className="font-mono text-[16px] sm:text-[19px] font-medium text-ink break-words">
            (cos θ, sin θ) = ({num(cos)}, {num(sin)})
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-xs">
          <span className="text-gold">θ = {theta.toFixed(3)} rad</span>
          <span className="text-ink-faint">{degrees.toFixed(1)}°</span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="slider"
        aria-label="Angle on the unit circle"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(degrees)}
        aria-valuetext={`${Math.round(degrees)} degrees, cosine ${cos.toFixed(2)}, sine ${sin.toFixed(2)}`}
        tabIndex={0}
        className="w-full h-auto bg-inset border border-line rounded-md touch-none cursor-crosshair"
        /* Turning the point is a drag, which no keyboard can perform — so the
           arrows turn it instead. A degree per press, fifteen with shift, so
           the landmark angles are reachable without hunting. */
        onKeyDown={(event) => {
          const dir =
            event.key === "ArrowRight" || event.key === "ArrowUp"
              ? 1
              : event.key === "ArrowLeft" || event.key === "ArrowDown"
                ? -1
                : 0;
          if (dir === 0) return;
          event.preventDefault();
          const stepDeg = event.shiftKey ? 15 : 1;
          setTheta((t) => {
            const next = t + (dir * stepDeg * Math.PI) / 180;
            return ((next % TAU) + TAU) % TAU;
          });
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          moveTo(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => dragging && moveTo(event.clientX, event.clientY)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <line x1="0" y1={CY} x2={SIZE} y2={CY} stroke="var(--line-strong)" />
        <line x1={CX} y1="0" x2={CX} y2={SIZE} stroke="var(--line-strong)" />

        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1.5"
        />

        {/* The arc actually travelled — its length is θ, which is the definition. */}
        <path d={arc} fill="none" stroke="var(--gold)" strokeWidth="4" />

        {/* cos is the horizontal leg, sin the vertical one. Same colours as the
            readouts below, so the correspondence needs no explaining. */}
        <line
          x1={CX}
          y1={CY}
          x2={px(cos)}
          y2={CY}
          stroke="var(--series-2)"
          strokeWidth="3"
        />
        <line
          x1={px(cos)}
          y1={CY}
          x2={px(cos)}
          y2={py(sin)}
          stroke="var(--series-4)"
          strokeWidth="3"
        />

        <line
          x1={CX}
          y1={CY}
          x2={px(cos)}
          y2={py(sin)}
          stroke="var(--accent)"
          strokeWidth="2"
        />

        <circle
          cx={px(cos)}
          cy={py(sin)}
          r={dragging ? 9 : 7}
          fill="var(--gold)"
          className="transition-all duration-150"
        />
      </svg>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          ["cos θ", num(cos), "var(--series-2)"],
          ["sin θ", num(sin), "var(--series-4)"],
          ["tan θ", cosNearZero ? "undefined" : num(sin / cos), "var(--accent)"],
          ["arc length", theta.toFixed(3), "var(--gold)"],
        ].map(([label, value, colour]) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-3 py-2.5 bg-surface-2 border border-line rounded-md"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              {label}
            </span>
            <span className="font-mono text-[14px]" style={{ color: colour }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[13px] leading-[1.65] text-ink-muted">
        The gold arc and the angle are the same number — that is what a radian
        is. tan θ is undefined at π/2 because cos θ is zero there and the ratio
        has nothing to divide by.
      </p>

      <div className="flex flex-wrap gap-2">
        {LANDMARKS.map(([label, value]) => (
          <button
            key={label}
            onClick={() => setTheta(value)}
            className={cx(
              "font-mono text-[12.5px] px-3 py-2 rounded-md border cursor-pointer transition-colors",
              Math.abs(theta - value) < 1e-6
                ? "bg-accent-soft border-accent text-accent"
                : "border-line text-ink-muted hover:text-ink hover:border-line-strong",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </Panel>
  );
}
