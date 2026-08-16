"use client";

import { useState } from "react";
import { Eyebrow, Panel, cx } from "@/components/ui";

const W = 640;
const H = 96;
const LIM = 12;
const AXIS_Y = 52;

const px = (n: number) => ((n + LIM) / (2 * LIM)) * W;
const sign = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

type Rel = "<" | "≤" | ">" | "≥";

/** Multiplying or dividing by a negative reverses the relation. This is that table. */
const FLIP: Record<Rel, Rel> = { "<": ">", "≤": "≥", ">": "<", "≥": "≤" };

const isStrict = (rel: Rel) => rel === "<" || rel === ">";
const pointsRight = (rel: Rel) => rel === ">" || rel === "≥";

/**
 * Solving a linear inequality, one step at a time, with the solution shaded.
 *
 * The whole demo exists for one moment: dividing by a negative k flips the
 * relation. It is the single most-missed rule in the topic, and it is missed
 * because it is taught as a rule. Here the flip is visible — the shading jumps
 * to the other side of the line the instant k crosses zero.
 */
export function InequalityDemo() {
  const [k, setK] = useState(-2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(7);
  const [rel, setRel] = useState<Rel>("<");

  const flipped = k < 0;
  const solvedRel = flipped ? FLIP[rel] : rel;
  const bound = (c - b) / k;

  const shadeFrom = pointsRight(solvedRel) ? px(bound) : 0;
  const shadeWidth = pointsRight(solvedRel) ? W - px(bound) : px(bound);

  const ticks: number[] = [];
  for (let t = -LIM; t <= LIM; t++) ticks.push(t);

  const relButton = (r: Rel) => (
    <button
      key={r}
      onClick={() => setRel(r)}
      className={cx(
        "font-mono text-sm rounded-[5px] px-4 py-2 border cursor-pointer transition-colors",
        rel === r
          ? "bg-accent text-accent-ink border-accent"
          : "bg-transparent text-ink-muted border-line-strong hover:text-ink hover:border-ink-faint",
      )}
    >
      {r}
    </button>
  );

  const slider = (
    label: string,
    value: number,
    set: (n: number) => void,
    min: number,
    max: number,
    skipZero = false,
  ) => (
    <label className="flex flex-col gap-2 flex-1 min-w-[min(100%,10rem)]">
      <span className="font-mono text-xs text-ink-muted">
        {label} = {sign(value)}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          // k = 0 is not an inequality in x at all, so it is stepped over.
          set(skipZero && next === 0 ? (next > value ? 1 : -1) : next);
        }}
        className="w-full accent-accent cursor-pointer"
      />
    </label>
  );

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-col gap-[7px]">
        <Eyebrow tone="accent">Solve it</Eyebrow>
        <div className="font-mono text-[16px] sm:text-[19px] font-medium text-ink break-words">
          {sign(k)}x {b < 0 ? "−" : "+"} {Math.abs(b)} {rel} {sign(c)}
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {[
          {
            line: `${sign(k)}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} ${rel} ${sign(c)}`,
            why: "the inequality as given",
          },
          {
            line: `${sign(k)}x ${rel} ${sign(c - b)}`,
            why: `subtract ${sign(b)} from both sides — the relation is untouched`,
          },
          {
            line: `x ${solvedRel} ${Number.isInteger(bound) ? sign(bound) : bound.toFixed(2)}`,
            why: flipped
              ? `divide by ${sign(k)} — negative, so ${rel} becomes ${solvedRel}`
              : `divide by ${sign(k)} — positive, so the relation survives`,
          },
        ].map((step, i) => (
          <li
            key={i}
            className={cx(
              "flex flex-col gap-1 px-4 py-3 rounded-md border",
              i === 2 && flipped
                ? "bg-gold-surface border-gold-line"
                : "bg-surface-2 border-line",
            )}
          >
            <span
              className={cx(
                "font-mono text-[15px]",
                i === 2 ? "text-ink font-medium" : "text-ink-muted",
              )}
            >
              {step.line}
            </span>
            <span
              className={cx(
                "font-mono text-[12px]",
                i === 2 && flipped ? "text-gold" : "text-ink-faint",
              )}
            >
              {step.why}
            </span>
          </li>
        ))}
      </ol>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Number line shaded where x ${solvedRel} ${bound.toFixed(2)}`}
        className="w-full h-auto bg-inset border border-line rounded-md"
      >
        <rect
          x={Math.max(0, shadeFrom)}
          y={AXIS_Y - 16}
          width={Math.max(0, Math.min(W, shadeWidth))}
          height="32"
          fill="var(--accent)"
          opacity="0.16"
        />
        <line x1="0" y1={AXIS_Y} x2={W} y2={AXIS_Y} stroke="var(--line-strong)" strokeWidth="1.5" />

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={px(t)}
              y1={AXIS_Y - (t % 4 === 0 ? 6 : 3)}
              x2={px(t)}
              y2={AXIS_Y + (t % 4 === 0 ? 6 : 3)}
              stroke={t === 0 ? "var(--ink-faint)" : "var(--line-strong)"}
            />
            {t % 4 === 0 && (
              <text
                x={px(t)}
                y={AXIS_Y + 22}
                fill="var(--ink-ghost)"
                fontSize="11"
                textAnchor="middle"
                className="font-mono"
              >
                {sign(t)}
              </text>
            )}
          </g>
        ))}

        {/* Open for a strict inequality, filled for one that includes the bound. */}
        {Math.abs(bound) <= LIM && (
          <circle
            cx={px(bound)}
            cy={AXIS_Y}
            r="6"
            fill={isStrict(solvedRel) ? "var(--bg)" : "var(--gold)"}
            stroke="var(--gold)"
            strokeWidth="2.5"
          />
        )}
      </svg>

      <p className="font-mono text-[13px] leading-[1.6] text-ink-muted">
        {isStrict(solvedRel) ? "Hollow" : "Filled"} circle:{" "}
        {isStrict(solvedRel)
          ? "the boundary itself is not a solution."
          : "the boundary is included."}{" "}
        Drag k through zero and watch the shading jump sides.
      </p>

      <div className="flex flex-wrap gap-5">
        {slider("k", k, setK, -4, 4, true)}
        {slider("b", b, setB, -8, 8)}
        {slider("c", c, setC, -8, 8)}
      </div>

      <div className="flex gap-2">{(["<", "≤", ">", "≥"] as Rel[]).map(relButton)}</div>
    </Panel>
  );
}
