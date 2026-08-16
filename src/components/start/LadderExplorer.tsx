"use client";

import { useState } from "react";
import { GraphPanel } from "@/components/lesson/GraphPanel";
import { Eyebrow, cx } from "@/components/ui";
import type { GraphKey } from "@/lib/types";

export type Rung = {
  /** Short label for the step strip. */
  tab: string;
  move: string;
  plain: string;
  /** Reads downward: this move is built out of what is on the right. */
  rests: string;
  /** The live figure for this move, where the course already has one. */
  graph?: GraphKey;
  figureNote?: string;
};

/**
 * The five moves, one at a time, each with the figure it corresponds to. Shown
 * as a stepper rather than a list because the point is that they are performed
 * in order, on the same numbers, over and over — a list of five bullet points
 * says nothing that reading them one at a time does not say better.
 */
export function LadderExplorer({ rungs }: { rungs: Rung[] }) {
  const [active, setActive] = useState(0);
  const rung = rungs[active];

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="The five moves of a neural network"
        className="grid grid-cols-2 sm:grid-cols-5 gap-2"
      >
        {rungs.map((entry, i) => (
          <button
            key={entry.tab}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cx(
              "flex flex-col gap-1.5 text-left px-3.5 py-3 rounded-lg border cursor-pointer transition-all duration-200",
              i === active
                ? "bg-accent-soft border-accent text-accent"
                : "bg-surface border-line text-ink-muted hover:border-line-strong hover:text-ink",
            )}
          >
            <span className="font-mono text-[10px] tracking-[0.14em]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[13.5px] leading-[1.3] font-medium">
              {entry.tab}
            </span>
          </button>
        ))}
      </div>

      {/* Keyed on the step so the panel re-mounts and replays its entrance —
          the movement is what tells you the step changed. */}
      <div key={active} className="flex flex-col gap-4 animate-rise">
        <div className="flex flex-col gap-2.5 p-5 sm:p-[22px] bg-surface border border-line rounded-lg">
          <div className="text-[17px] sm:text-[19px] font-semibold">
            {rung.move}
          </div>
          <p className="text-[15.5px] leading-[1.65] text-ink-muted max-w-[66ch]">
            {rung.plain}
          </p>
          <p className="font-mono text-[12.5px] leading-[1.6] text-accent border-l-2 border-accent-line pl-3">
            {rung.rests}
          </p>
        </div>

        {rung.graph ? (
          <>
            <GraphPanel graphKey={rung.graph} />
            {rung.figureNote && (
              <p className="text-[14.5px] leading-[1.6] text-ink-faint max-w-[66ch]">
                {rung.figureNote}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2 p-5 bg-inset border border-line rounded-lg">
            <Eyebrow>No figure — this one is arithmetic</Eyebrow>
            <p className="text-[15px] leading-[1.6] text-ink-muted max-w-[66ch]">
              {rung.figureNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
