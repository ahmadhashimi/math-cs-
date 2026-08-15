"use client";

import { useState } from "react";
import { cx, Eyebrow, Panel } from "@/components/ui";

const CHOICES = [2, 4, 8, 16, 64];
/** ∫₀³ x² dx — the number the rectangles are converging on. */
const EXACT = 9;

/** Right-endpoint rectangles under y = x² on [0, 3], refined on demand. */
export function RiemannDemo() {
  const [n, setN] = useState(8);

  const width = 3 / n;
  const heights = Array.from({ length: n }, (_, i) => {
    const x = (i + 1) * width;
    return x * x;
  });
  const estimate = heights.reduce((sum, y) => sum + y * width, 0);

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-[22px]">
      <div className="flex flex-wrap justify-between items-end gap-5">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">Run it</Eyebrow>
          <div className="text-[17px] sm:text-[19px] font-medium text-ink">
            Rectangles under y = x² from 0 to 3
          </div>
        </div>
        <div className="flex gap-6 sm:gap-[26px] font-mono">
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">ESTIMATE</span>
            <span className="text-[28px] sm:text-[32px] leading-none text-accent">
              {estimate.toFixed(3)}
            </span>
          </div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">EXACT</span>
            <span className="text-[28px] sm:text-[32px] leading-none text-ink">
              {EXACT}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex gap-[2px] items-end h-[150px] border-b border-line-strong"
        aria-hidden
      >
        {heights.map((y, i) => (
          <div
            key={i}
            className="flex-1 min-w-0 rounded-t-[2px] opacity-85 transition-[height] duration-[400ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{
              height: `${(y / EXACT) * 100}%`,
              background:
                "linear-gradient(180deg, var(--accent), color-mix(in oklab, var(--accent) 45%, var(--bg)))",
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {CHOICES.map((value) => (
          <button
            key={value}
            onClick={() => setN(value)}
            aria-pressed={value === n}
            className={cx(
              "font-mono text-[13px] rounded-[5px] px-4 py-2.5 border cursor-pointer transition-colors",
              value === n
                ? "bg-accent text-accent-ink border-accent"
                : "bg-transparent text-ink-muted border-line-strong hover:text-ink hover:border-ink-faint",
            )}
          >
            n = {value}
          </button>
        ))}
        <span className="font-mono text-[13px] sm:text-sm text-ink-dim sm:ml-1.5">
          {n} rectangles overshoot by {(estimate - EXACT).toFixed(3)}
        </span>
      </div>
    </Panel>
  );
}
