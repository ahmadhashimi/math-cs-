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
import { FINAL_PER_TRACK } from "@/lib/course";
import { useProgress } from "@/lib/progress";
import {
  FINAL_EXAM_ID,
  FINAL_PASS_MARK,
  PASS_MARK,
  STRIKE_LIMIT,
  type ExamPrompt,
  type ExamVerdict,
} from "@/lib/types";

/**
 * A track exam is its whole pool in a fresh order; the final samples every
 * track, then shuffles so the tracks interleave rather than arriving in blocks.
 */
function buildPaper(pools: ExamPrompt[][], isFinal: boolean): ExamPrompt[] {
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
  /** Prompts only — the answer key never reaches this component. */
  pools: ExamPrompt[][];
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
    captureAttempts,
    lastLesson,
  } = useProgress();

  const isFinal = trackId === FINAL_EXAM_ID;
  const passMark = isFinal ? FINAL_PASS_MARK : PASS_MARK;

  const [attempt, setAttempt] = useState(0);
  const [paper, setPaper] = useState<ExamPrompt[]>([]);
  const [picked, setPicked] = useState<Record<number, number>>({});
  // The score arrives from the server or not at all. `scored` is derived from
  // it rather than tracked separately, so there is no state in which the paper
  // is marked without a verdict behind it.
  const [verdict, setVerdict] = useState<ExamVerdict | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The paper is not rendered at all until the learner accepts the proctoring
  // terms, and every retake asks again — consent is per attempt, not per visit.
  const [consented, setConsented] = useState(false);

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
    setVerdict(null);
    setSubmitError(null);
    setConsented(false);
  }, [pools, isFinal, attempt]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // The lockdown lives in the provider: the curtain, the clipboard denials and
  // the counters. It is armed for exactly as long as an accepted attempt is
  // unscored — never before consent, never after the score.
  const scored = verdict !== null;
  const live = consented && !scored;
  useEffect(() => {
    setExamLive(live);
    return () => setExamLive(false);
  }, [live, setExamLive]);

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

  // Every number on the result page comes from the server's verdict. Nothing
  // here recomputes a score, because nothing here knows the answers.
  const right = verdict?.right ?? 0;
  const pct = verdict?.pct ?? 0;
  const pass = verdict?.pass ?? false;
  const marks = useMemo(
    () => new Map((verdict?.results ?? []).map((r) => [r.id, r])),
    [verdict],
  );
  const blocked = examBlocked(trackId);
  const attemptNo = attempts[trackId] ?? 0;

  async function submit() {
    if (scored) {
      if (blocked) return;
      setAttempt((n) => n + 1);
      return;
    }
    // `total` is 0 until the paper is drawn on mount; submitting an empty
    // paper would burn an attempt and record a 0%.
    if (total === 0 || answered < total || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          answers: paper.map((question, i) => ({
            id: question.id,
            pick: picked[i],
          })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        // The attempt is NOT recorded on a failed submit. A network blip must
        // not cost a strike, and three of those would lock the track.
        setSubmitError(
          (body as { error?: string } | null)?.error ??
            "The exam could not be scored. Nothing was recorded — try submitting again.",
        );
        return;
      }

      const scoredVerdict = (await response.json()) as ExamVerdict;
      recordExam({
        trackId,
        passed: scoredVerdict.pass,
        missed: scoredVerdict.missed,
      });
      setVerdict(scoredVerdict);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "Could not reach the server, so nothing was scored or recorded. Check your connection and submit again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Integrity flags read the same in the live header and on the result.
  const flags: string[] = [];
  if (focusLost > 0) {
    flags.push(`${focusLost} tab ${focusLost === 1 ? "switch" : "switches"}`);
  }
  if (captureAttempts > 0) {
    flags.push(
      `${captureAttempts} screen ${captureAttempts === 1 ? "capture" : "captures"}`,
    );
  }

  const verdictLabel = pass ? (isFinal ? "Graduated" : "Pass") : "Not yet";
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
              flags.length === 0 ? "text-accent" : "text-danger",
            )}
          >
            {flags.length === 0
              ? consented
                ? "● proctored session"
                : "● proctoring armed"
              : `● ${flags.join(" · ")} recorded`}
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
              {verdictLabel}
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

      {!consented && !scored && (
        <ProctorGate
          questionCount={plannedCount}
          passMark={passMark}
          onAccept={() => setConsented(true)}
          onLeave={() => router.push(`/lesson/${lastLesson ?? backLessonId}`)}
        />
      )}

      {/* `contents` keeps the flex layout while giving print one element to
          hide — a live paper must not survive a Cmd+P. */}
      <div data-proctored={live ? "1" : undefined} className="contents">
      {(consented || scored) && paper.map((question, index) => {
        const choice = picked[index];
        const mark = marks.get(question.id);
        const correct = mark?.correct ?? false;
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
                      : option === mark?.a
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

            {scored && mark && (
              <p className="text-[15px] leading-[1.65] text-ink-muted border-l-2 border-line-strong pl-3.5">
                {mark.e}
              </p>
            )}
          </div>
        );
      })}
      </div>

      {(consented || scored) && (
      <div className="flex flex-col gap-3 border-t border-line pt-6">
      {submitError && (
        <p
          role="alert"
          className="text-[15px] leading-[1.6] text-danger bg-danger-soft border border-danger-line rounded-md px-4 py-3"
        >
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <PrimaryButton
          onClick={submit}
          disabled={
            scored ? blocked : total === 0 || answered < total || submitting
          }
        >
          {scored
            ? blocked
              ? "Locked — redo the flagged lessons first"
              : "Retake with fresh order"
            : submitting
              ? "Scoring…"
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
      )}
    </div>
  );
}

/** What the lockdown does, stated before it is switched on. */
const PROCTOR_TERMS: string[] = [
  "Copy, cut, paste, text selection and the right-click menu are switched off for the whole attempt.",
  "Leaving this tab — to another window, another app, or a second screen — blanks the paper and is counted on your result.",
  "Pressing a screen-capture shortcut blanks the paper as it fires and is counted on your result.",
  "The paper will not print. A print is a capture with a nicer name.",
];

/**
 * The exam does not begin until this is accepted, and the paper is not in the
 * DOM to be read until it is. Consent is asked again on every retake, because
 * an attempt that starts by scrolling past the terms is not proctored, it is
 * decorated.
 */
function ProctorGate({
  questionCount,
  passMark,
  onAccept,
  onLeave,
}: {
  questionCount: number;
  passMark: number;
  onAccept: () => void;
  onLeave: () => void;
}) {
  const [ticked, setTicked] = useState(false);

  return (
    <section className="flex flex-col gap-5 px-6 py-7 sm:px-7 bg-gold-surface border border-gold-line border-l-[3px] border-l-gold rounded-lg animate-rise">
      <div className="flex flex-col gap-1.5">
        <Eyebrow tone="gold">Proctored session · read before you begin</Eyebrow>
        <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em]">
          This attempt is locked down.
        </h2>
        <p className="text-[15.5px] leading-[1.6] text-gold-ink max-w-[68ch]">
          {questionCount} questions, {passMark}% to pass. The paper stays hidden
          until you accept, and the lockdown stays on until you submit.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {PROCTOR_TERMS.map((term) => (
          <li
            key={term}
            className="flex gap-3 text-[15px] leading-[1.55] text-ink bg-gold-inset border border-gold-line rounded-md px-3.5 py-3"
          >
            <span className="font-mono text-[11px] text-gold-dim shrink-0 pt-1">
              LOCKED
            </span>
            <span className="min-w-0">{term}</span>
          </li>
        ))}
      </ul>

      {/* Stated plainly rather than overclaimed: a page that promises more
          protection than a browser can deliver teaches the wrong lesson about
          what security is. */}
      <p className="text-[14px] leading-[1.6] text-ink-muted max-w-[68ch]">
        Honest limit: a web page cannot truly stop a screen capture — a phone
        pointed at the monitor always works. What this does is blank the paper
        at the moment of capture and record every attempt on your result, which
        is what proctoring software does too. The rest is on you.
      </p>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={ticked}
          onChange={(event) => setTicked(event.target.checked)}
          className="mt-1 size-4 shrink-0 accent-gold cursor-pointer"
        />
        <span className="text-[15px] leading-[1.55] text-ink">
          I will sit this attempt without notes, another tab, or help of any
          kind, and I accept that violations are recorded.
        </span>
      </label>

      <div className="flex flex-wrap gap-3 items-center">
        <GoldButton disabled={!ticked} onClick={onAccept}>
          {ticked ? "Begin the proctored exam" : "Accept the terms to begin"}
        </GoldButton>
        <GhostButton onClick={onLeave}>Not now — back to lessons</GhostButton>
      </div>
    </section>
  );
}
