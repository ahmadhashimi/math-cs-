"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow, Panel, cx } from "@/components/ui";
import type { Formula } from "@/lib/types";

/**
 * The six re-teach styles. The label is what the learner picks; the instruction
 * is what the tutor is actually told to do, and the two are deliberately not the
 * same words — "Visually" is a promise, the instruction is the method.
 */
const STYLES: [label: string, instruction: string][] = [
  [
    "Like I’m 12",
    "Explain it to a bright twelve-year-old. Everyday words, one concrete story, no jargon that is not immediately unpacked. Do not talk down.",
  ],
  [
    "Show me the steps",
    "Work one representative problem end to end, numbered, showing every algebraic step and stating the rule used at each line.",
  ],
  [
    "Just the code",
    "Explain it through code. Give a short, commented, language-agnostic implementation and connect each line back to the mathematics.",
  ],
  [
    "Visually",
    "Explain it through what it looks like: shape, direction, size, movement. Describe the picture precisely in words so the reader can draw it.",
  ],
  [
    "Why do I care",
    "Explain where this actually shows up in real engineering work, with two specific concrete situations where not knowing it causes a real bug or a bad decision.",
  ],
  [
    "Where I go wrong",
    "Name the three most common mistakes people make with this topic, why each is tempting, and the exact check that catches each one.",
  ],
];

const QUESTION_MODE = "Your question";

export function TutorPanel({
  lessonId,
  title,
  idea,
  cs,
  formulas,
  analogy,
}: {
  lessonId: string;
  title: string;
  idea: string;
  cs: string;
  formulas: Formula[];
  analogy: string;
}) {
  const [mode, setMode] = useState<string | null>(null);
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [question, setQuestion] = useState("");

  const inFlight = useRef<AbortController | null>(null);

  /*
   * An answer belongs to the lesson it was asked about, so a lesson change
   * clears it. Adjusting during render rather than in an effect avoids painting
   * the previous lesson's answer once under the new lesson's heading.
   */
  const [shownFor, setShownFor] = useState(lessonId);
  if (shownFor !== lessonId) {
    setShownFor(lessonId);
    setMode(null);
    setOut("");
    setQuestion("");
    setBusy(false);
  }

  /** Abandon a response still arriving for a lesson the learner has left. */
  useEffect(() => {
    return () => {
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [lessonId]);

  async function run(label: string, instruction: string, asked?: string) {
    if (busy) return;

    const controller = new AbortController();
    inFlight.current = controller;
    setBusy(true);
    setMode(label);
    setOut("");

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          lessonTitle: title,
          idea,
          cs,
          formulas: formulas.map(([formulaLabel, expr]) => [formulaLabel, expr]),
          analogy,
          mode: instruction,
          question: asked,
        }),
      });
      if (!response.ok || !response.body) throw new Error(String(response.status));

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) setOut((prev) => prev + chunk);
      }
    } catch {
      // A cancelled request is a lesson change, not a failure — it has no reader left.
      if (!controller.signal.aborted) {
        setOut("Could not reach the tutor just now. Try again in a moment.");
      }
    } finally {
      if (inFlight.current === controller) {
        inFlight.current = null;
        setBusy(false);
      }
    }
  }

  function ask() {
    const asked = question.trim();
    // The instruction is unused once a question is present, but the route
    // requires a non-empty `mode`, so the label doubles as it here.
    if (asked) void run(QUESTION_MODE, QUESTION_MODE, asked);
  }

  const showOutput = Boolean(out) || busy;

  return (
    <Panel className="bg-surface-3 p-5 sm:p-6 flex flex-col gap-4 sm:gap-[18px]">
      <div className="flex flex-col gap-[7px]">
        <Eyebrow tone="accent">Explain it my way</Eyebrow>
        <div className="text-[17px] sm:text-[19px] font-medium">
          Not landing? Have it re-taught in the way you learn.
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STYLES.map(([label, instruction]) => (
          <button
            key={label}
            type="button"
            disabled={busy}
            onClick={() => void run(label, instruction)}
            className={cx(
              "font-mono text-[12.5px] rounded-full px-4 py-[9px] border transition-colors",
              "disabled:cursor-wait",
              mode === label
                ? "bg-accent text-accent-ink border-accent"
                : "bg-surface-2 text-ink-muted border-line-strong hover:text-ink hover:border-ink-faint",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-[10px]">
        <input
          value={question}
          disabled={busy}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              ask();
            }
          }}
          placeholder="or ask anything about this lesson…"
          className={cx(
            "flex-1 min-w-0 sm:min-w-[240px] text-[15px] sm:text-base px-4 py-3",
            "bg-inset text-ink border border-line-strong rounded-md",
            "placeholder:text-ink-faint focus:outline-none focus:border-accent",
            "disabled:cursor-wait",
          )}
        />
        <button
          type="button"
          disabled={busy}
          onClick={ask}
          className={cx(
            "font-mono text-[13px] font-semibold rounded-md px-6 py-3 transition-colors",
            "bg-accent text-bg hover:opacity-90",
            "disabled:bg-line disabled:text-ink-faint disabled:hover:opacity-100",
            busy && "cursor-wait",
          )}
        >
          {busy ? "Thinking…" : "Ask"}
        </button>
      </div>

      {showOutput && (
        <div
          className={cx(
            "bg-inset border border-line-strong border-l-[3px] border-l-accent",
            "rounded-md px-5 py-5 sm:px-6 animate-rise transition-opacity",
            busy && "opacity-55",
          )}
        >
          <Eyebrow tone="accent" className="mb-3">
            {busy ? `${mode} · thinking…` : mode}
          </Eyebrow>
          <p className="m-0 text-base sm:text-[17px] leading-[1.75] text-ink-muted whitespace-pre-wrap">
            {out}
          </p>
        </div>
      )}
    </Panel>
  );
}
