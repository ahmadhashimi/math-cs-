"use client";

import { useState } from "react";
import { GRAPHS, graphDefaults, type GraphDef } from "@/lib/graphs";
import type { GraphKey } from "@/lib/types";
import { Eyebrow, Panel } from "@/components/ui";

const W = 640;
const H = 320;
/** Samples per curve. Enough for a smooth kink; cheap enough to redraw per drag. */
const SAMPLES = 160;

type Plot = {
  title: string;
  note: string;
  zeroX: string;
  zeroY: string;
  legend: { color: string; label: string }[];
  paths: { color: string; points: string }[];
  dots: { x: string; y: string; r: number; fill: string; stroke?: string }[];
};

function plot(def: GraphDef, v: Record<string, number>): Plot {
  const xr = typeof def.x === "function" ? def.x(v) : def.x;
  const yr = typeof def.y === "function" ? def.y(v) : def.y;
  const span = yr[1] - yr[0];
  const px = (x: number) => ((x - xr[0]) / (xr[1] - xr[0])) * W;
  const py = (y: number) => H - ((y - yr[0]) / span) * H;
  const curves = def.curves(v);

  return {
    title: def.title(v),
    note: def.note(v),
    zeroX: Math.max(2, Math.min(W - 2, px(0))).toFixed(1),
    zeroY: Math.max(2, Math.min(H - 2, py(0))).toFixed(1),
    legend: curves.map((c) => ({ color: c.color, label: c.label })),
    paths: curves
      .filter((c) => c.fn)
      .map((c) => {
        const points: string[] = [];
        for (let j = 0; j <= SAMPLES; j++) {
          const x = xr[0] + ((xr[1] - xr[0]) * j) / SAMPLES;
          const y = c.fn!(x);
          // A gap in the domain (a hole, an asymptote) must stay a gap.
          if (!Number.isFinite(y)) continue;
          // One span of overshoot keeps the exit angle honest without stretching
          // the viewBox to fit a curve that has already left the frame.
          const clamped = Math.max(yr[0] - span, Math.min(yr[1] + span, y));
          points.push(`${px(x).toFixed(1)},${py(clamped).toFixed(1)}`);
        }
        return { color: c.color, points: points.join(" ") };
      }),
    dots: (def.dots ? def.dots(v) : []).map((d) => ({
      x: px(d.x).toFixed(1),
      y: py(Math.max(yr[0], Math.min(yr[1], d.y))).toFixed(1),
      r: d.r ?? 4,
      fill: d.fill ?? "none",
      stroke: d.stroke,
    })),
  };
}

/** The "See it" figure: one graph, driven by its own sliders. */
export function GraphPanel({ graphKey }: { graphKey: GraphKey }) {
  const def = GRAPHS[graphKey];
  const [stored, setValues] = useState(() => graphDefaults(def));
  const [shownKey, setShownKey] = useState(graphKey);

  // Navigating between lessons reuses this component, so a new figure must
  // start from its own defaults rather than the previous lesson's sliders —
  // and this pass must already draw with them, since the stored values are
  // keyed to the old figure's sliders and would plot NaN.
  let values = stored;
  if (shownKey !== graphKey) {
    values = graphDefaults(def);
    setShownKey(graphKey);
    setValues(values);
  }

  const view = plot(def, values);

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">See it</Eyebrow>
          <div className="font-mono text-[16px] sm:text-[19px] font-medium text-ink break-words">
            {view.title}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {view.legend.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-[7px] font-mono text-xs"
              style={{ color: entry.color }}
            >
              <span
                aria-hidden
                className="inline-block w-3.5 h-[3px] rounded-[2px]"
                style={{ background: entry.color }}
              />
              <span>{entry.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={view.title}
        className="w-full h-auto bg-inset border border-line rounded-md"
      >
        <line
          x1="0"
          y1={view.zeroY}
          x2={W}
          y2={view.zeroY}
          stroke="var(--line-strong)"
          strokeWidth="1"
        />
        <line
          x1={view.zeroX}
          y1="0"
          x2={view.zeroX}
          y2={H}
          stroke="var(--line-strong)"
          strokeWidth="1"
        />
        {view.paths.map((path, i) => (
          <polyline
            key={i}
            points={path.points}
            fill="none"
            stroke={path.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ))}
        {view.dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill={dot.fill}
            stroke={dot.stroke}
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="flex flex-wrap gap-x-7 gap-y-4">
        {def.sliders.map((slider) => (
          <label
            key={slider.k}
            className="flex flex-col gap-2 flex-1 min-w-0 basis-[220px] max-w-full sm:max-w-[300px]"
          >
            <span className="font-mono text-xs text-ink-muted">
              {slider.label} = {values[slider.k]}
            </span>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={values[slider.k]}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  [slider.k]: parseFloat(event.target.value),
                }))
              }
              className="w-full cursor-pointer"
            />
          </label>
        ))}
      </div>

      <div className="font-mono text-[13px] sm:text-sm text-ink-dim">{view.note}</div>
    </Panel>
  );
}
