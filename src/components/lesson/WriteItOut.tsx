"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow, GoldButton, Panel, cx } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import type { Formula } from "@/lib/types";

/** Matches the server's floor: shorter than this is a fragment, not an answer. */
const MIN_ANSWER = 12;
/** At or above this the answer stands; below it the lesson goes back on the queue. */
const PASS = 4;

type Marked = { score: number | null; feedback: string };

export function WriteItOut({
  lessonId,
  title,
  idea,
  formulas,
}: {
  lessonId: string;
  title: string;
  idea: string;
  formulas: Formula[];
}) {
  const { addToQueue, clearFromQueue } = useProgress();

  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [marked, setMarked] = useState<Marked | null>(null);

  const inFlight = useRef<AbortController | null>(null);

  /*
   * A written answer and its mark belong to one lesson. Adjusting during render
   * rather than in an effect avoids showing the previous lesson's mark once
   * against the new lesson's prompt.
   */
  const [shownFor, setShownFor] = useState(lessonId);
  if (shownFor !== lessonId) {
    setShownFor(lessonId);
    setValue("");
    setMarked(null);
    setBusy(false);
  }

  /** Abandon a mark still arriving for a lesson the learner has left. */
  useEffect(() => {
    return () => {
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [lessonId]);

  const answer = value.trim();
  const tooShort = answer.length < MIN_ANSWER;

  async function submit() {
    if (busy || tooShort) return;

    const controller = new AbortController();
    inFlight.current = controller;
    setBusy(true);
    setMarked(null);

    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          lessonTitle: title,
          idea,
          formulas: formulas.map(([label, expr]) => [label, expr]),
          answer,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));

      const result = (await response.json()) as Marked;
      setMarked(result);

      /*
       * An unparseable mark is not a failed one — only a real score below the
       * pass mark puts the lesson back in the review queue.
       */
      if (result.score !== null && result.score < PASS) {
        addToQueue(lessonId, "write", title);
      } else if (result.score !== null) {
        clearFromQueue(lessonId, "write");
      }
    } catch {
      if (!controller.signal.aborted) {
        setMarked({
          score: null,
          feedback: "Could not reach the marker just now. Try again in a moment.",
        });
      }
    } finally {
      if (inFlight.current === controller) {
        inFlight.current = null;
        setBusy(false);
      }
    }
  }

  const passed = marked !== null && marked.score !== null && marked.score >= PASS;
  const showResult = busy || marked !== null;

  const hint = tooShort
    ? "Write at least a sentence."
    : busy
      ? "An examiner is reading your answer."
      : "Scores under 4 are added to your review queue.";

  const verdict = busy
    ? "marking"
    : marked === null || marked.score === null
      ? ""
      : marked.score >= PASS
        ? "solid"
        : marked.score >= 2
          ? "partial — queued for review"
          : "not there yet — queued for review";

  return (
    <Panel className="p-5 sm:p-6 flex flex-col gap-4 sm:gap-[18px]">
      <div className="flex flex-col gap-[7px]">
        <Eyebrow tone="gold">Write it out</Eyebrow>
        <div className="text-[17px] sm:text-[19px] font-medium">
          {`${idea.replace(/\.$/, "")} — explain this in your own words and justify why it is true.`}
        </div>
        <p className="m-0 text-[14.5px] leading-[1.55] text-ink-muted">
          Multiple choice tests whether you recognise an answer. This tests whether you
          can produce one — which is what a real exam asks. Marked out of 5 with
          specific feedback.
        </p>
      </div>

      <textarea
        value={value}
        disabled={busy}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Write your answer in full sentences. Show your reasoning, not just the result."
        className={cx(
          "w-full min-h-[130px] resize-y font-sans text-[15px] sm:text-base leading-[1.65] p-4",
          "bg-inset text-ink border rounded-md transition-colors",
          "placeholder:text-ink-faint focus:outline-none disabled:cursor-wait",
          marked === null || marked.score === null
            ? "border-line-strong focus:border-gold"
            : passed
              ? "border-accent-line"
              : "border-gold-line",
        )}
      />

      <div className="flex flex-wrap items-center gap-[10px]">
        <GoldButton disabled={busy || tooShort} onClick={() => void submit()}>
          {busy ? "Marking…" : "Submit for marking"}
        </GoldButton>
        <span className="font-mono text-[13px] text-ink-dim">{hint}</span>
      </div>

      {showResult && (
        <div
          className={cx(
            "bg-inset border border-line-strong border-l-[3px] rounded-md",
            "px-5 py-5 sm:px-6 animate-rise transition-opacity",
            passed ? "border-l-accent text-accent" : "border-l-gold text-gold",
            busy && "opacity-55",
          )}
        >
          <div className="flex items-baseline gap-[14px] mb-3">
            <span className="font-mono text-[26px] sm:text-[30px] leading-none font-semibold">
              {marked === null || marked.score === null ? "—" : `${marked.score} / 5`}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
              {verdict}
            </span>
          </div>
          <p className="m-0 text-[15px] sm:text-base leading-[1.7] text-ink-muted whitespace-pre-wrap">
            {marked?.feedback ?? ""}
          </p>
        </div>
      )}
    </Panel>
  );
}
