"use client";

import { useState } from "react";
import { cx, Eyebrow, GhostButton, Panel, PrimaryButton } from "@/components/ui";

const SIZE = 64;
const TARGET = 41;

type Range = { lo: number; hi: number; steps: number };

const START: Range = { lo: 0, hi: SIZE - 1, steps: 0 };

/** Binary search run one comparison at a time, on a bar per array slot. */
export function BinarySearchDemo() {
  const [{ lo, hi, steps }, setRange] = useState<Range>(START);
  const found = lo === hi;

  const halve = () =>
    setRange((prev) => {
      if (prev.lo >= prev.hi) return prev;
      const mid = Math.floor((prev.lo + prev.hi) / 2);
      return mid < TARGET
        ? { lo: mid + 1, hi: prev.hi, steps: prev.steps + 1 }
        : { lo: prev.lo, hi: mid, steps: prev.steps + 1 };
    });

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-[22px]">
      <div className="flex flex-wrap justify-between items-end gap-5">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">Run it</Eyebrow>
          <div className="text-[17px] sm:text-[19px] font-medium text-ink break-words">
            binary_search(sorted[64], target=41)
          </div>
        </div>
        <div className="flex gap-6 sm:gap-[26px] font-mono">
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">STEPS</span>
            <span className="text-[28px] sm:text-[32px] leading-none text-accent">
              {steps}
            </span>
          </div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">RANGE</span>
            <span className="text-[28px] sm:text-[32px] leading-none text-ink">
              {hi - lo + 1}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-[2px] sm:gap-[3px] items-end h-[46px]" aria-hidden>
        {Array.from({ length: SIZE }, (_, i) => {
          const inRange = i >= lo && i <= hi;
          const isTarget = i === TARGET;
          return (
            <div
              key={i}
              className={cx(
                "flex-1 min-w-0 rounded-[2px]",
                "transition-[height,background-color] duration-[350ms] ease-[cubic-bezier(.4,0,.2,1)]",
                inRange ? "h-[42px]" : "h-[10px]",
                found && isTarget
                  ? "bg-accent"
                  : inRange
                    ? isTarget
                      ? ""
                      : "bg-ink-ghost"
                    : "bg-line",
              )}
              // The target inside a live range reads as a dimmed accent — no token
              // for it, and mixing against the page keeps it right in both themes.
              style={
                inRange && isTarget && !found
                  ? { background: "color-mix(in oklab, var(--accent) 58%, var(--bg))" }
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        <PrimaryButton onClick={halve}>halve()</PrimaryButton>
        <GhostButton onClick={() => setRange(START)}>reset()</GhostButton>
        <span className="font-mono text-[13px] sm:text-sm text-ink-dim">
          {found
            ? `found — ${steps} comparisons over 64 items = log₂(64)`
            : "// each call discards half the range"}
        </span>
      </div>
    </Panel>
  );
}
