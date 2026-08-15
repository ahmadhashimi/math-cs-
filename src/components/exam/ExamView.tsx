"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Eyebrow,
  GhostButton,
  GoldButton,
  PrimaryButton,
  cx,
} from "@/components/ui";
import { freshSeed, shuffle } from "@/lib/answers";
import { useProgress, type WeakLesson } from "@/lib/progress";
import {
  FINAL_EXAM_ID,
  FINAL_PASS_MARK,
  PASS_MARK,
  STRIKE_LIMIT,
  type ExamQuestion,
} from "@/lib/types";

/** Questions the final takes from each track's pool. */
const FINAL_PER_TRACK = 2;

/**
 * A track exam is its whole pool in a fresh order; the final samples every
 * track, then shuffles so the tracks interleave rather than arriving in blocks.
 */
function buildPaper(pools: ExamQuestion[][], isFinal: boolean): ExamQuestion[] {
  const seed = freshSeed();
  const drawn = isFinal
    ? pools.flatMap((pool, i) =>
        shuffle(pool.length, seed + i * 7919)
          .slice(0, FINAL_PER_TRACK)
          .map((j) => pool[j]),
      )
    : pools.flat();
  return shuffle(drawn.length, seed).map((i) => drawn[i]);
}

export function ExamView({
  trackId,
  title,
  pools,
  backLessonId,
}: {
  trackId: string;
  title: string;
  /** One pool for a track exam, one pool per track for the final. */
  pools: ExamQuestion[][];
  backLessonId: string;
}) {
  const router = useRouter();
  const {
    attempts,
    weak,
    recordExam,
    examBlocked,
    setExamLive,
    focusLost,
    lastLesson,
  } = useProgress();

  const isFinal = trackId === FINAL_EXAM_ID;
  const passMark = isFinal ? FINAL_PASS_MARK : PASS_MARK;

  const [attempt, setAttempt] = useState(0);
  const [paper, setPaper] = useState<ExamQuestion[]>([]);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [scored, setScored] = useState(false);

  // The paper is drawn on the client so the server render and the first client
  // render agree; bumping `attempt` is what a retake does. The pools arrive
  // from a server component and never change identity, so nothing else here
  // can reshuffle a paper that is already part-answered.
  /* eslint-disable react-hooks/set-state-in-effect --
     The draw reads the clock, so it cannot run during render without the
     server and the first client render disagreeing. Seeding state from an
     external source (the clock) on mount is exactly what an effect is for. */
  useEffect(() => {
    setPaper(buildPaper(pools, isFinal));
    setPicked({});
    setScored(false);
  }, [pools, isFinal, attempt]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Copy-blocking and tab-switch counting live in the provider; they stay armed
  // for exactly as long as this attempt is unscored.
  useEffect(() => {
    setExamLive(!scored);
    return () => setExamLive(false);
  }, [scored, setExamLive]);

  // Known before the paper exists, so the header never counts up from zero.
  const plannedCount = useMemo(
    () =>
      pools.reduce(
        (n, pool) => n + (isFinal ? Math.min(FINAL_PER_TRACK, pool.length) : pool.length),
        0,
      ),
    [pools, isFinal],
  );

  const total = paper.length;
  const answered = Object.keys(picked).length;
  const right = paper.reduce(
    (n, question, i) => n + (picked[i] === question.a ? 1 : 0),
    0,
  );
  // Integer arithmetic so the pass check is exact: `right / total ≥ mark%`
  // with no float error and no rounding. Math.round here once let a 69.6%
  // score round up to 70 and pass below the mark. The displayed percentage is
  // floored so it always agrees with the verdict (floor(pct) ≥ mark exactly
  // when pct ≥ mark, since the mark is a whole number).
  const pct = total ? Math.floor((right * 100) / total) : 0;
  const pass = total > 0 && right * 100 >= passMark * total;
  const blocked = examBlocked(trackId);
  const attemptNo = attempts[trackId] ?? 0;

  function submit() {
    if (scored) {
      if (blocked) return;
      setAttempt((n) => n + 1);
      return;
    }
    // `total` is 0 until the paper is drawn on mount; scoring an empty paper
    // would burn an attempt and record a 0%.
    if (total === 0 || answered < total) return;

    // One entry per lesson: three misses from the same lesson is still one
    // lesson to redo.
    const missed: WeakLesson[] = [];
    for (const [i, question] of paper.entries()) {
      if (picked[i] === question.a) continue;
      if (missed.some((m) => m.id === question.lessonId)) continue;
      missed.push({ id: question.lessonId, title: question.from });
    }

    recordExam({ trackId, passed: pass, missed });
    setScored(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const verdict = pass ? (isFinal ? "Graduated" : "Pass") : "Not yet";
  const summary =
    isFinal && pass
      ? `${right} of ${total} correct across every track in the course. Your certificate is ready.`
      : pass
        ? `${right} of ${total} correct. Review anything you missed below, then move on to the next track.`
        : `${right} of ${total} correct — ${passMark}% is the pass mark. The explanations below name the lesson each question came from; work through those and retake it.`;

  const remedialNote =
    attemptNo >= STRIKE_LIMIT
      ? `Attempt ${attemptNo}. The exam is now locked: the lessons below have been un-marked and you must complete each one again — read it, clear the drills, mark it complete — before you can retake.`
      : attemptNo >= STRIKE_LIMIT - 1
        ? `That is attempt ${attemptNo} on this track. One more failure locks the exam and un-marks the lessons below — you would have to redo them in full before retaking.`
        : "These are the lessons your missed questions came from. Work through each one — the drills especially — then retake the exam.";

  return (
    <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 lg:px-14 pt-8 sm:pt-12 lg:pt-14 pb-24 lg:pb-30 flex flex-col gap-8 sm:gap-9 animate-rise">
      <header className="flex flex-col gap-3 border-b border-line pb-6">
        <div className="flex flex-wrap justify-between items-center gap-x-5 gap-y-2">
          <Eyebrow tone="gold">Objective assessment</Eyebrow>
          <span
            className={cx(
              "font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]",
              focusLost === 0 ? "text-accent" : "text-danger",
            )}
          >
            {focusLost === 0
              ? "● proctored session"
              : `● ${focusLost} tab ${focusLost === 1 ? "switch" : "switches"} recorded`}
          </span>
          <Eyebrow>
            {plannedCount} questions · pass at {passMark}%
          </Eyebrow>
        </div>
        <h1 className="text-[clamp(2rem,7vw,3.25rem)] leading-none font-semibold tracking-[-0.03em]">
          {title}
        </h1>
        <p className="text-[17px] leading-[1.6] text-ink-muted">
          Every question is drawn from the lessons in this track. Answer them
          all, then submit for a score and a full review.
        </p>
      </header>

      {scored && (
        <div
          className={cx(
            "bg-surface border border-line border-l-[3px] rounded-lg px-6 py-6 sm:px-7 animate-rise",
            pass ? "border-l-accent text-accent" : "border-l-danger text-danger",
          )}
        >
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="font-mono text-[clamp(2.75rem,11vw,3.875rem)] leading-none font-semibold">
              {pct}%
            </span>
            <span className="font-mono text-[15px] uppercase tracking-[0.14em]">
              {verdict}
            </span>
          </div>
          <p className="mt-2.5 text-[17px] leading-[1.6] text-ink-muted">
            {summary}
          </p>
        </div>
      )}

      {isFinal && scored && pass && (
        <GoldButton
          onClick={() => router.push("/certificate")}
          className="self-start"
        >
          View your certificate →
        </GoldButton>
      )}

      {scored && !pass && (
        <div className="bg-gold-surface border border-gold-line border-l-[3px] border-l-gold rounded-lg px-6 py-6 flex flex-col gap-3.5">
          <Eyebrow tone="gold">Your review plan · attempt {attemptNo}</Eyebrow>
          <p className="text-[17px] leading-[1.65] text-gold-ink">
            {remedialNote}
          </p>
          <div className="flex flex-col gap-[7px]">
            {(weak[trackId] ?? []).map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center gap-3 text-base text-ink bg-gold-inset border border-gold-line rounded-md px-3.5 py-2.5"
              >
                <span className="font-mono text-[11px] text-gold-dim shrink-0">
                  REDO
                </span>
                <span className="min-w-0">{lesson.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {paper.map((question, index) => {
        const choice = picked[index];
        const correct = choice === question.a;
        return (
          <div
            key={`${attempt}-${index}`}
            className={cx(
              "flex flex-col gap-3.5 p-5 sm:p-[22px] bg-surface-3 border rounded-lg transition-colors duration-300",
              !scored
                ? "border-line"
                : correct
                  ? "border-accent-line"
                  : "border-danger-line",
            )}
          >
            <div className="flex gap-3.5 items-baseline">
              <span className="font-mono text-xs text-ink-faint shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <p className="text-lg sm:text-[19px] leading-[1.45] font-medium">
                  {question.q}
                </p>
                <span className="font-mono text-[11px] text-ink-faint">
                  {question.from}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {question.o.map((label, option) => (
                <button
                  key={option}
                  onClick={() =>
                    setPicked((prev) => ({ ...prev, [index]: option }))
                  }
                  disabled={scored}
                  aria-pressed={choice === option}
                  className={cx(
                    "font-mono text-[15px] text-left px-4 py-3.5 rounded-md border transition-all duration-200 min-w-0 break-words",
                    scored
                      ? "cursor-default"
                      : "cursor-pointer hover:border-line-strong",
                    !scored
                      ? choice === option
                        ? "bg-surface-2 border-gold text-gold"
                        : "bg-surface-2 border-line text-ink"
                      : option === question.a
                        ? "bg-accent-soft border-accent text-accent"
                        : option === choice
                          ? "bg-danger-soft border-danger text-danger"
                          : "bg-surface-2 border-line text-ink-faint",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {scored && (
              <p className="text-[15px] leading-[1.65] text-ink-muted border-l-2 border-line-strong pl-3.5">
                {question.e}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3 items-center border-t border-line pt-6">
        <PrimaryButton
          onClick={submit}
          disabled={scored ? blocked : total === 0 || answered < total}
        >
          {scored
            ? blocked
              ? "Locked — redo the flagged lessons first"
              : "Retake with fresh order"
            : "Submit for a score"}
        </PrimaryButton>

        <GhostButton
          onClick={() => router.push(`/lesson/${lastLesson ?? backLessonId}`)}
        >
          Back to lessons
        </GhostButton>

        <span className="font-mono text-[13px] text-ink-dim">
          {scored
            ? `Scored · ${right}/${total}`
            : `${answered} of ${total} answered`}
        </span>
      </div>
    </div>
  );
}
