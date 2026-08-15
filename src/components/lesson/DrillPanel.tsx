"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eyebrow, GhostButton, Panel, PrimaryButton, cx } from "@/components/ui";
import { GEN, makeDrills } from "@/data/course-gen";
import { answerMatches, freshSeed, norm } from "@/lib/answers";
import { useProgress } from "@/lib/progress";
import type { Drill } from "@/lib/types";

const REPS = 5;
/** Long enough to read the tick, short enough that a streak keeps its rhythm. */
const ADVANCE_MS = 700;

type Status = "ok" | "no" | null;

type DrillState = {
  index: number;
  value: string;
  status: Status;
  streak: number;
  solved: number;
  /** Per-rep outcome: 1 solved, 0 missed, undefined not reached yet. */
  history: (0 | 1 | undefined)[];
};

const START: DrillState = {
  index: 0,
  value: "",
  status: null,
  streak: 0,
  solved: 0,
  history: [],
};

export function DrillPanel({
  lessonId,
  title,
  fallback,
}: {
  lessonId: string;
  title: string;
  fallback: Drill[];
}) {
  const { addToQueue, hydrated } = useProgress();
  const [stored, setState] = useState<DrillState>(START);
  const [storedSeed, setSeed] = useState<number | null>(null);
  const [seedFor, setSeedFor] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * The seed comes off the clock, so it can only be drawn once the client has
   * hydrated: picking one during the first render would make the server HTML
   * and the client disagree and cost the whole subtree. Next also reuses this
   * component across lessons, so the same branch re-seeds and clears the reps
   * on a lesson change — rep 4 of the last lesson must not carry into the
   * first rep of this one. Everything below reads the cleared values, not the
   * stale ones React has yet to re-render with.
   */
  const changed = seedFor !== lessonId;
  if (hydrated && changed) {
    setSeedFor(lessonId);
    setSeed(freshSeed());
    setState(START);
  }
  const state = changed ? START : stored;
  const seed = changed ? null : storedSeed;

  // Drops an advance still pending when the lesson changes or the panel goes.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [lessonId],
  );

  const generated = Boolean(GEN[lessonId]);
  const drills = useMemo(
    () => (seed === null ? [] : makeDrills(lessonId, seed, fallback, REPS)),
    [seed, lessonId, fallback],
  );

  const ready = drills.length > 0;
  const finished = ready && state.index >= drills.length;
  const at = Math.min(state.index, Math.max(drills.length - 1, 0));
  const current: Drill | undefined = drills[at];
  const ok = state.status === "ok";
  const missed = state.status === "no";

  const mark = (outcome: 0 | 1) => {
    const history = state.history.slice();
    history[at] = outcome;
    return history;
  };

  /** A new seed, not a reshuffle of the old one — the set should be unfamiliar. */
  const restart = () => {
    setSeed((prev) =>
      prev === null ? freshSeed() : (prev * 1103515245 + 12345) % 2147483647 || 7,
    );
    setState(START);
  };

  const check = () => {
    if (!ready || !current) return;
    if (finished) return restart();
    // An already-correct rep is mid-advance; a second Enter must not double-count.
    if (ok) return;
    if (!norm(state.value)) return;

    if (answerMatches(state.value, current[1], current[2])) {
      setState((prev) => ({
        ...prev,
        status: "ok",
        streak: prev.streak + 1,
        solved: prev.solved + 1,
        history: mark(1),
      }));
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          index: prev.index + 1,
          value: "",
          status: null,
        }));
      }, ADVANCE_MS);
      return;
    }

    setState((prev) => ({ ...prev, status: "no", streak: 0, history: mark(0) }));
    addToQueue(lessonId, "quiz", title);
  };

  const skip = () => {
    if (!ready) return;
    if (finished) return restart();
    addToQueue(lessonId, "quiz", title);
    setState((prev) => ({
      ...prev,
      index: prev.index + 1,
      value: "",
      status: null,
      streak: 0,
      history: mark(0),
    }));
  };

  const question = !ready
    ? "Preparing your reps…"
    : finished
      ? "Set complete."
      : (current?.[0] ?? "");

  const message = !ready
    ? ""
    : finished
      ? `${state.solved} of ${drills.length} solved on the first try.${
          generated ? " Skip to generate a new set." : ""
        }`
      : ok
        ? "✓ correct"
        : missed
          ? `answer: ${current?.[1] ?? ""}`
          : "";

  const dots = Array.from({ length: drills.length || REPS });

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-end gap-5">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="accent">Drill it in</Eyebrow>
          <div className="text-[17px] sm:text-[19px] font-medium text-ink">
            Five quick reps. Type the answer, press Enter.
          </div>
          {generated && (
            <div className="font-mono text-xs text-accent">
              fresh numbers every round — nothing to memorise
            </div>
          )}
        </div>

        <div className="flex gap-6 sm:gap-[26px] font-mono">
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">
              STREAK
            </span>
            <span
              className={cx(
                "inline-block text-[28px] sm:text-[32px] leading-none origin-left",
                "transition-[transform,color] duration-300 ease-[cubic-bezier(.3,1.6,.5,1)]",
                state.streak > 0 ? "text-accent" : "text-ink-faint",
                ok && "scale-[1.22]",
              )}
            >
              {state.streak}
            </span>
          </div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">
              SOLVED
            </span>
            {/* Keyed on the count so each solve replays the pop. */}
            <span
              key={state.solved}
              className="inline-block text-[28px] sm:text-[32px] leading-none animate-pop"
            >
              {state.solved}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5" aria-hidden>
        {dots.map((_, i) => (
          <div
            key={i}
            className={cx(
              "flex-1 h-1 rounded-sm transition-colors duration-300",
              state.history[i] === 1
                ? "bg-accent"
                : state.history[i] === 0
                  ? "bg-danger"
                  : i === at && !finished
                    ? "bg-line-strong"
                    : "bg-line",
            )}
          />
        ))}
      </div>

      <div
        className={cx(
          "flex flex-col gap-4 p-5 sm:p-6 bg-inset border rounded-lg transition-colors duration-300",
          ok ? "border-accent" : missed ? "border-danger" : "border-line",
        )}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          Rep {finished ? drills.length : at + 1} of {drills.length || REPS}
        </div>
        <div className="font-mono text-xl sm:text-[27px] leading-[1.35] text-ink break-words">
          {question}
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          <label className="sr-only" htmlFor={`drill-${lessonId}`}>
            Your answer
          </label>
          <input
            id={`drill-${lessonId}`}
            value={state.value}
            disabled={!ready}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                value: event.target.value,
                status: null,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") check();
            }}
            placeholder="answer"
            className={cx(
              "text-[17px] sm:text-lg px-4 py-3 w-full sm:w-[190px] rounded-md",
              "bg-inset text-ink border transition-colors duration-200",
              ok ? "border-accent" : missed ? "border-danger" : "border-line-strong",
            )}
          />
          <PrimaryButton onClick={check} disabled={!ready} className="px-6">
            Check
          </PrimaryButton>
          <GhostButton onClick={skip} disabled={!ready} className="text-ink-dim">
            Skip
          </GhostButton>
          <span
            role="status"
            className={cx(
              "font-mono text-sm transition-colors duration-200",
              ok ? "text-accent" : missed ? "text-danger" : "text-ink-dim",
            )}
          >
            {message}
          </span>
        </div>
      </div>
    </Panel>
  );
}
