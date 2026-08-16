"use client";

import { useProgress } from "@/lib/progress";

/** The id of the tutor section this button jumps to. */
export const TUTOR_ANCHOR = "tutor";

/**
 * A floating jump to the tutor. The panel sits below the drills and the quiz,
 * which is the right reading order and the wrong place to be when you are stuck
 * three paragraphs into the explanation — so the button follows you down.
 *
 * It is hidden while an exam is live. A one-tap route to an AI during a
 * proctored attempt would undo the entire lockdown, and it would do it with a
 * button the course itself put on the screen.
 */
export function AskAIButton() {
  const { examLive } = useProgress();
  if (examLive) return null;

  return (
    <button
      data-noprint="1"
      onClick={() => {
        const target = document.getElementById(TUTOR_ANCHOR);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Focus lands after the scroll so the panel is reachable by keyboard
        // too, without the browser jumping ahead of the animation.
        window.setTimeout(() => {
          target.querySelector<HTMLElement>("button, input, textarea")?.focus();
        }, 500);
      }}
      aria-label="Jump to the AI tutor for this lesson"
      className="fixed z-30 bottom-5 right-5 sm:bottom-7 sm:right-7 flex items-center gap-2.5 font-mono text-[13px] font-semibold px-5 py-3.5 rounded-full cursor-pointer bg-accent text-accent-ink border border-accent shadow-[0_6px_24px_rgba(0,0,0,0.35)] hover:bg-accent-hover transition-colors"
    >
      <span aria-hidden className="text-[15px] leading-none">
        ✦
      </span>
      Ask AI
    </button>
  );
}
