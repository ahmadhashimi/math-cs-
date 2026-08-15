"use client";

import Link from "next/link";
import { useState } from "react";
import { cx } from "@/components/ui";
import type { ThreadView } from "@/lib/course";

/**
 * The eight returning ideas. Threads open independently — the point is to
 * compare two of them side by side, so opening one never closes another.
 */
export function ThreadAccordion({ threads }: { threads: ThreadView[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-2.5">
      {threads.map((thread) => {
        const isOpen = Boolean(open[thread.id]);
        return (
          <div
            key={thread.id}
            className={cx(
              "bg-surface border rounded-[9px] overflow-hidden transition-colors",
              isOpen ? "border-line-strong" : "border-line",
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() =>
                setOpen((prev) => ({ ...prev, [thread.id]: !prev[thread.id] }))
              }
              className="flex items-start gap-3 w-full text-left px-4 sm:px-[22px] py-4 sm:py-[18px] cursor-pointer"
            >
              <span
                className={cx(
                  "shrink-0 pt-[5px] text-[11px] text-ink-faint transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
                aria-hidden="true"
              >
                ▸
              </span>
              <span className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-[17px] font-semibold">{thread.n}</span>
                <span className="text-sm sm:text-[14.5px] leading-[1.5] text-ink-muted">
                  {thread.line}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                {thread.steps.length} lessons
              </span>
            </button>

            {isOpen && (
              <div className="flex flex-col gap-3.5 px-4 sm:pl-[46px] sm:pr-[22px] pb-5 sm:pb-[22px] animate-rise">
                <p className="text-[15px] sm:text-base leading-[1.7] text-ink-muted max-w-[72ch]">
                  {thread.why}
                </p>
                <div className="flex flex-wrap items-stretch gap-2">
                  {thread.steps.map((step) =>
                    step.exists ? (
                      <Link
                        key={step.lessonId}
                        href={`/lesson/${step.lessonId}`}
                        className="flex flex-col gap-[3px] font-mono text-[12.5px] leading-[1.45] bg-surface-2 border border-line rounded-[7px] px-3.5 py-2.5 max-w-full transition-colors hover:border-line-strong"
                      >
                        <span className="text-ink">{step.title}</span>
                        <span className="text-ink-dim">{step.note}</span>
                      </Link>
                    ) : (
                      <span
                        key={step.lessonId}
                        className="flex flex-col gap-[3px] font-mono text-[12.5px] leading-[1.45] bg-surface-2 border border-line rounded-[7px] px-3.5 py-2.5 max-w-full opacity-50"
                      >
                        <span className="text-ink">{step.title}</span>
                        <span className="text-ink-dim">{step.note}</span>
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
