"use client";

import { useState } from "react";
import { Eyebrow, Panel, cx } from "@/components/ui";

const W = 640;
const H = 132;
/** The line runs −LIM…+LIM. Both operands cap at 10, so a sum can reach 20. */
const LIM = 20;
const AXIS_Y = 86;

const px = (n: number) => ((n + LIM) / (2 * LIM)) * W;

/** −4 rather than -4: the minus sign in this lesson is a direction, and it should look like one. */
const sign = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

/**
 * The first lesson's claim, made visible: subtracting is adding the opposite,
 * and a minus sign is a direction rather than a different kind of number. The
 * two hops are drawn separately because that is the step people skip — they
 * try to hold `a − (−b)` in their head as one move and lose the sign.
 */
export function NumberLineDemo() {
  const [a, setA] = useState(-7);
  const [b, setB] = useState(-3);
  const [subtract, setSubtract] = useState(true);

  // The whole point: subtraction is rewritten as addition of the opposite, and
  // the second hop is drawn from the rewritten value, never from the original.
  const effective = subtract ? -b : b;
  const result = a + effective;

  const ticks: number[] = [];
  for (let t = -LIM; t <= LIM; t++) ticks.push(t);

  const arrow = (from: number, to: number, color: string, lift: number) => {
    if (from === to) return null;
    const y = AXIS_Y - lift;
    const dir = to > from ? -1 : 1;
    return (
      <g>
        <line
          x1={px(from)}
          y1={y}
          x2={px(to)}
          y2={y}
          stroke={color}
          strokeWidth="2.5"
        />
        <line x1={px(from)} y1={y} x2={px(from)} y2={AXIS_Y} stroke={color} strokeWidth="1" strokeDasharray="3 3" />
        <line x1={px(to)} y1={y} x2={px(to)} y2={AXIS_Y} stroke={color} strokeWidth="1" strokeDasharray="3 3" />
        <polygon
          points={`${px(to)},${y} ${px(to) + dir * 8},${y - 5} ${px(to) + dir * 8},${y + 5}`}
          fill={color}
        />
      </g>
    );
  };

  const control = (
    label: string,
    value: number,
    set: (n: number) => void,
  ) => (
    <label className="flex flex-col gap-2 flex-1 min-w-[min(100%,11rem)]">
      <span className="font-mono text-xs text-ink-muted">
        {label} = {sign(value)}
      </span>
      <input
        type="range"
        min={-10}
        max={10}
        step={1}
        value={value}
        onChange={(event) => set(Number(event.target.value))}
        className="w-full accent-accent cursor-pointer"
      />
    </label>
  );

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">Walk it</Eyebrow>
          <div className="font-mono text-[16px] sm:text-[19px] font-medium text-ink break-words">
            {sign(a)} {subtract ? "−" : "+"} {b < 0 ? `(${sign(b)})` : b} ={" "}
            <span className="text-gold">{sign(result)}</span>
          </div>
        </div>
        <button
          onClick={() => setSubtract((v) => !v)}
          className="font-mono text-[13px] px-4 py-2.5 rounded-md border border-line-strong text-ink-muted hover:text-ink hover:border-ink-faint cursor-pointer transition-colors"
        >
          switch to {subtract ? "adding" : "subtracting"}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Number line showing ${a} ${subtract ? "minus" : "plus"} ${b} equals ${result}`}
        className="w-full h-auto bg-inset border border-line rounded-md"
      >
        <line x1="0" y1={AXIS_Y} x2={W} y2={AXIS_Y} stroke="var(--line-strong)" strokeWidth="1.5" />

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={px(t)}
              y1={AXIS_Y - (t % 5 === 0 ? 7 : 4)}
              x2={px(t)}
              y2={AXIS_Y + (t % 5 === 0 ? 7 : 4)}
              stroke={t === 0 ? "var(--ink-faint)" : "var(--line-strong)"}
              strokeWidth={t === 0 ? 1.5 : 1}
            />
            {t % 5 === 0 && (
              <text
                x={px(t)}
                y={AXIS_Y + 24}
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

        {/* Hop one: nothing but travelling out to a. */}
        {arrow(0, a, "var(--ink-ghost)", 26)}
        {/* Hop two: the rewritten move, which is where the sign is won or lost. */}
        {arrow(a, result, "var(--accent)", 50)}

        <circle cx={px(result)} cy={AXIS_Y} r="6" fill="var(--gold)" />
        <text
          x={px(result)}
          y={AXIS_Y - 12}
          fill="var(--gold)"
          fontSize="12"
          textAnchor="middle"
          className="font-mono"
        >
          {sign(result)}
        </text>
      </svg>

      <p className="font-mono text-[13px] leading-[1.65] text-ink-muted">
        {subtract ? (
          <>
            {sign(a)} − ({sign(b)}) is rewritten as {sign(a)} + ({sign(effective)}),
            then walked: start at {sign(a)}, move {Math.abs(effective)}{" "}
            {effective < 0 ? "left" : "right"}, land on {sign(result)}.
          </>
        ) : (
          <>
            Start at {sign(a)}, move {Math.abs(effective)}{" "}
            {effective < 0 ? "left" : "right"}, land on {sign(result)}.
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-5">
        {control("a", a, setA)}
        {control("b", b, setB)}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["−7 − (−3)", -7, -3, true],
            ["5 − 8", 5, 8, true],
            ["−4 + 9", -4, 9, false],
            ["−6 − 2", -6, 2, true],
          ] as const
        ).map(([label, na, nb, sub]) => (
          <button
            key={label}
            onClick={() => {
              setA(na);
              setB(nb);
              setSubtract(sub);
            }}
            className={cx(
              "font-mono text-[12.5px] px-3 py-2 rounded-md border cursor-pointer transition-colors",
              a === na && b === nb && subtract === sub
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
