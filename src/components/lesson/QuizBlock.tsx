"use client";

import { useState } from "react";
import { GhostButton, PrimaryButton, cx } from "@/components/ui";
import { answerMatches } from "@/lib/answers";
import { useProgress } from "@/lib/progress";
import type { Question } from "@/lib/types";

type AnswerState = {
  /** Index into the option list, once picked. */
  picked?: number;
  value: string;
  checked: boolean;
  steps: boolean;
};

const BLANK: AnswerState = { value: "", checked: false, steps: false };

type Answers = Record<number, AnswerState>;

const NONE: Answers = {};

/** True when this answer, as it stands, is the right one. */
function isRight(item: Question, state: AnswerState | undefined): boolean {
  if (!state) return false;
  return item.t === "mc"
    ? state.picked === item.a
    : state.checked && answerMatches(state.value, item.a, item.alt);
}

export function QuizBlock({
  lessonId,
  title,
  questions,
}: {
  lessonId: string;
  title: string;
  questions: Question[];
}) {
  const { addToQueue, clearFromQueue } = useProgress();
  const [stored, setAnswers] = useState<Answers>(NONE);

  /*
   * Next reuses this component across lessons. Without this, question 2 of the
   * next lesson opens already marked with the last lesson's verdict — and the
   * option indices behind it belong to a question nobody is looking at.
   */
  const [shownLesson, setShownLesson] = useState(lessonId);
  const changed = shownLesson !== lessonId;
  if (changed) {
    setShownLesson(lessonId);
    setAnswers(NONE);
  }
  const answers = changed ? NONE : stored;

  /** Bookkeeping only — the steps toggle must not touch the review queue. */
  const patch = (index: number, next: Partial<AnswerState>) =>
    setAnswers((prev) => ({
      ...prev,
      [index]: { ...BLANK, ...prev[index], ...next },
    }));

  /*
   * A miss puts the lesson in the review queue. It only comes off once every
   * question here is answered and right: clearing on a single correct answer
   * would drop a miss on another question that was never revisited.
   */
  const answer = (index: number, next: Partial<AnswerState>) => {
    const patched: AnswerState = { ...BLANK, ...answers[index], ...next };
    const after: Answers = { ...answers, [index]: patched };
    setAnswers(after);
    if (!isRight(questions[index], patched)) {
      addToQueue(lessonId, "quiz", title);
      return;
    }
    if (questions.every((item, i) => isRight(item, after[i]))) {
      clearFromQueue(lessonId, "quiz");
    }
  };

  return (
    <>
      {questions.map((item, index) => {
        const state = answers[index] ?? BLANK;
        const answered =
          item.t === "mc" ? state.picked != null : state.checked;
        const correct = isRight(item, state);

        return (
          <div
            key={index}
            className="flex flex-col gap-4 p-5 sm:p-6 bg-surface-3 border border-line rounded-lg"
          >
            <div className="flex gap-3 items-baseline">
              <span className="font-mono text-xs text-ink-faint shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-lg sm:text-[21px] leading-[1.45] font-medium">
                {item.q}
              </p>
            </div>

            {item.t === "mc" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {item.o.map((label, i) => {
                  const isAnswer = i === item.a;
                  const isPicked = state.picked === i;
                  return (
                    <button
                      key={i}
                      onClick={() => answer(index, { picked: i })}
                      className={cx(
                        "font-mono text-[15px] sm:text-base text-left px-4 py-4 rounded-md border cursor-pointer transition-all duration-200",
                        !answered
                          ? "bg-surface-2 border-line text-ink hover:border-line-strong"
                          : isAnswer
                            ? "bg-accent-soft border-accent text-accent"
                            : isPicked
                              ? "bg-danger-soft border-danger text-danger"
                              : "bg-surface-2 border-line text-ink-faint",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 items-center">
                <label className="sr-only" htmlFor={`quiz-${lessonId}-${index}`}>
                  Your answer
                </label>
                <input
                  id={`quiz-${lessonId}-${index}`}
                  value={state.value}
                  onChange={(event) =>
                    patch(index, { value: event.target.value, checked: false })
                  }
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    answer(index, { checked: true });
                  }}
                  placeholder="your answer"
                  className={cx(
                    "text-[17px] px-4 py-3 w-full sm:w-[200px] rounded-md",
                    "bg-inset text-ink border transition-colors duration-200",
                    !answered
                      ? "border-line-strong"
                      : correct
                        ? "border-accent"
                        : "border-danger",
                  )}
                />
                <PrimaryButton onClick={() => answer(index, { checked: true })}>
                  Check
                </PrimaryButton>
                {item.s && item.s.length > 0 && (
                  <GhostButton
                    onClick={() => patch(index, { steps: !state.steps })}
                    aria-expanded={state.steps}
                  >
                    {state.steps ? "Hide steps" : "Show steps"}
                  </GhostButton>
                )}
              </div>
            )}

            {item.t === "in" && state.steps && item.s && (
              <ol className="m-0 pl-6 flex flex-col gap-2.5 list-decimal">
                {item.s.map((step, i) => (
                  <li
                    key={i}
                    className="font-mono text-[15px] leading-[1.55] text-ink-muted"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            )}

            {answered && (
              <div
                className={cx(
                  "bg-inset border border-line border-l-[3px] rounded-md px-5 py-4",
                  correct ? "border-l-accent text-accent" : "border-l-danger text-danger",
                )}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] mb-2">
                  {correct ? "✓ correct" : "✗ not quite"}
                </div>
                <p className="text-base leading-[1.65] text-ink-muted">
                  {item.e}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
