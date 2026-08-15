"use client";

import Link from "next/link";
import { Eyebrow, cx } from "@/components/ui";
import { useProgress } from "@/lib/progress";

export type HomeTrack = {
  id: string;
  n: string;
  sub: string;
  lessonIds: string[];
};

/** Compact row buttons — smaller than the shared Ghost/Gold buttons by design. */
const ROW_BUTTON =
  "font-mono text-xs rounded-md px-4 py-2.5 border transition-colors shrink-0";
const OPEN_BUTTON = "text-ink-muted border-line-strong hover:text-ink hover:border-ink-faint";
const EXAM_BUTTON = "text-gold border-gold-line hover:bg-gold hover:text-gold-surface";

export function TrackSequence({ tracks }: { tracks: HomeTrack[] }) {
  const { done, passed, unlocked, examBlocked, showShield } = useProgress();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
        <Eyebrow>The sequence</Eyebrow>
        <span className="font-mono text-xs text-ink-faint">
          Each track unlocks when you pass the one before it
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tracks.map((track, index) => {
          const total = track.lessonIds.length;
          const doneHere = track.lessonIds.filter((id) => done[id]).length;
          const previous = tracks[index - 1];
          const isLocked = !unlocked[track.id];

          const row = (
            <>
              <span className="font-mono text-[13px] text-ink-faint w-[26px] shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* A real basis, not flex-1: it is what pushes the progress bar
                  and the buttons onto their own line on a narrow screen. */}
              <span className="flex flex-col gap-[3px] grow basis-[13rem] min-w-0">
                <span className="text-[17px] font-semibold">{track.n}</span>
                <span className="text-sm text-ink-dim">
                  {isLocked
                    ? `🔒 Locked — pass the ${previous?.n ?? ""} exam to unlock`
                    : track.sub}
                </span>
              </span>

              <span className="flex flex-col gap-1.5 w-[110px] shrink-0">
                <span className="font-mono text-[11px] text-ink-faint">
                  {doneHere}/{total} done
                </span>
                <span className="block h-[3px] bg-line rounded-sm overflow-hidden">
                  <span
                    className="block h-full bg-accent rounded-sm transition-[width] duration-500"
                    style={{ width: `${Math.round((doneHere / total) * 100)}%` }}
                  />
                </span>
              </span>
            </>
          );

          const shell = cx(
            "flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-[18px] px-4 py-4 sm:px-[18px] bg-surface border rounded-lg transition-all",
            passed[track.id] ? "border-accent-line" : "border-line",
          );

          // A locked row is one target, not four: the whole thing explains the
          // gate rather than presenting buttons that silently do nothing.
          if (isLocked) {
            return (
              <button
                key={track.id}
                type="button"
                onClick={() =>
                  showShield({
                    title: "Track locked",
                    message: `Pass the ${previous?.n ?? "previous"} exam to unlock ${track.n}. The gate is the point: every track assumes the one before it.`,
                  })
                }
                className={cx(shell, "w-full text-left opacity-[0.42] cursor-pointer")}
              >
                {row}
                <span className={cx(ROW_BUTTON, OPEN_BUTTON)}>Open</span>
                <span className={cx(ROW_BUTTON, EXAM_BUTTON)}>Exam</span>
              </button>
            );
          }

          const blocked = examBlocked(track.id);

          return (
            <div key={track.id} className={shell}>
              {row}
              <Link
                href={`/lesson/${track.lessonIds[0]}`}
                className={cx(ROW_BUTTON, OPEN_BUTTON)}
              >
                Open
              </Link>
              {blocked ? (
                <span
                  title="Redo the lessons this exam flagged before sitting it again"
                  className={cx(ROW_BUTTON, "text-ink-faint border-line cursor-not-allowed")}
                >
                  Exam
                </span>
              ) : (
                <Link href={`/exam/${track.id}`} className={cx(ROW_BUTTON, EXAM_BUTTON)}>
                  Exam
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
