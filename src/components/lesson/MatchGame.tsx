"use client";

import { useEffect, useRef, useState } from "react";
import { shuffle } from "@/lib/answers";
import type { Formula } from "@/lib/types";
import { cx, Eyebrow, GhostButton, Panel } from "@/components/ui";

type Side = "L" | "R";

type Game = {
  order: number[];
  sel: { side: Side; i: number } | null;
  done: number[];
  moves: number;
  wrong: number | null;
};

/**
 * The opening order must be identical on the server and on the client, so it is
 * seeded from the lesson id rather than the clock. Shuffle takes a real one.
 */
function openingOrder(lessonId: string, count: number): number[] {
  return shuffle(count, ((lessonId.length * 7919 + count * 131) % 99991) + 1);
}

function newGame(order: number[]): Game {
  return { order, sel: null, done: [], moves: 0, wrong: null };
}

/** Match each formula to its meaning. At most five pairs — the first five. */
export function MatchGame({
  formulas,
  lessonId,
}: {
  formulas: Formula[];
  lessonId: string;
}) {
  const pairs = formulas.slice(0, 5);
  const count = pairs.length;

  const [stored, setGame] = useState<Game>(() =>
    newGame(openingOrder(lessonId, count)),
  );
  const [shownLesson, setShownLesson] = useState(lessonId);
  const missTimer = useRef<number | null>(null);

  // A new lesson reuses this component; its formulas are new, so is the board.
  // The rest of this pass has to read the fresh board too: the stored order can
  // hold indices past the new lesson's formula list, and rendering those would
  // throw before React got round to the re-render this schedules.
  let game = stored;
  if (shownLesson !== lessonId) {
    game = newGame(openingOrder(lessonId, count));
    setShownLesson(lessonId);
    setGame(game);
  }

  useEffect(
    () => () => {
      if (missTimer.current !== null) window.clearTimeout(missTimer.current);
    },
    [],
  );

  const solved = game.done.length === count;

  const pick = (side: Side, i: number) => {
    if (game.done.includes(i)) return;
    if (!game.sel) return setGame((g) => ({ ...g, sel: { side, i }, wrong: null }));
    // Clicking the same column again just moves the selection.
    if (game.sel.side === side)
      return setGame((g) => ({ ...g, sel: { side, i }, wrong: null }));

    const hit = game.sel.i === i;
    setGame((g) => ({
      ...g,
      sel: null,
      moves: g.moves + 1,
      done: hit ? [...g.done, i] : g.done,
      wrong: hit ? null : i,
    }));
    if (!hit) {
      if (missTimer.current !== null) window.clearTimeout(missTimer.current);
      missTimer.current = window.setTimeout(
        () => setGame((g) => ({ ...g, wrong: null })),
        550,
      );
    }
  };

  const cardClass = (i: number, side: Side) => {
    const done = game.done.includes(i);
    const selected = game.sel?.side === side && game.sel.i === i;
    const bad = game.wrong === i;
    return cx(
      "font-mono text-[12.5px] sm:text-[15px] leading-[1.45] text-left break-words",
      "px-3 py-3 sm:px-4 sm:py-3.5 border rounded-md transition-all duration-[220ms]",
      done
        ? "bg-accent-soft border-accent text-accent opacity-65 cursor-default"
        : bad
          ? "bg-danger-soft border-danger text-ink translate-x-[3px] cursor-pointer"
          : selected
            ? "bg-surface-2 border-gold text-ink cursor-pointer"
            : "bg-surface-2 border-line-strong text-ink cursor-pointer",
    );
  };

  return (
    <Panel className="p-5 sm:p-[26px] flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-[7px] min-w-0">
          <Eyebrow tone="gold">Play it</Eyebrow>
          <div className="text-[17px] sm:text-[19px] font-medium text-ink">
            Match each formula to what it means. Fewest moves wins.
          </div>
        </div>
        <div className="flex gap-6 sm:gap-[26px] font-mono">
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">PAIRED</span>
            <span
              className={cx(
                "text-[28px] sm:text-[32px] leading-none",
                solved ? "text-accent animate-pop" : "text-ink",
              )}
            >
              {game.done.length} / {count}
            </span>
          </div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[10px] tracking-[0.14em] text-ink-dim">MOVES</span>
            <span className="text-[28px] sm:text-[32px] leading-none text-ink">
              {game.moves}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="flex flex-col gap-2">
          {pairs.map((formula, i) => (
            <button
              key={i}
              onClick={() => pick("L", i)}
              className={cardClass(i, "L")}
            >
              {formula[1]}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {game.order.map((i, position) => (
            <button
              key={position}
              onClick={() => pick("R", i)}
              className={cardClass(i, "R")}
            >
              {pairs[i][0]} — {pairs[i][2]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <GhostButton
          onClick={() =>
            setGame(newGame(shuffle(count, Math.floor(Math.random() * 99991) + 1)))
          }
        >
          Shuffle
        </GhostButton>
        <span
          className={cx(
            "font-mono text-[13px] sm:text-sm",
            solved ? "text-accent" : "text-ink-dim",
          )}
        >
          {solved
            ? game.moves === count
              ? `Perfect — ${count} pairs in ${count} moves.`
              : `Cleared in ${game.moves} moves. Perfect is ${count}.`
            : game.sel
              ? "Now pick its match on the other side."
              : "Click a formula, then its meaning."}
        </span>
      </div>
    </Panel>
  );
}
