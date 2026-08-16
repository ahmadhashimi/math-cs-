"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { AskAIButton, TUTOR_ANCHOR } from "@/components/lesson/AskAIButton";
import { BinarySearchDemo } from "@/components/lesson/BinarySearchDemo";
import { ConceptContextPanel } from "@/components/lesson/ConceptContextPanel";
import { DrillPanel } from "@/components/lesson/DrillPanel";
import { GraphPanel } from "@/components/lesson/GraphPanel";
import { MatchGame } from "@/components/lesson/MatchGame";
import { QuizBlock } from "@/components/lesson/QuizBlock";
import { InequalityDemo } from "@/components/lesson/InequalityDemo";
import { NumberLineDemo } from "@/components/lesson/NumberLineDemo";
import { RiemannDemo } from "@/components/lesson/RiemannDemo";
import { TruthTableDemo } from "@/components/lesson/TruthTableDemo";
import { TutorPanel } from "@/components/lesson/TutorPanel";
import { WriteItOut } from "@/components/lesson/WriteItOut";
import {
  CourseFooter,
  Eyebrow,
  GhostButton,
  PhaseRule,
  cx,
} from "@/components/ui";
import { GEN } from "@/data/course-gen";
import { LESSON_TRACK, TRACK_OUTLINES } from "@/lib/course";
import type { LessonConceptContext } from "@/lib/concept-graph";
import { useProgress } from "@/lib/progress";
import type { Analogy, Depth, Lesson, Why } from "@/lib/types";

/** Reps a generated set produces — mirrors DrillPanel, for the meta line only. */
const GENERATED_REPS = 5;

type Neighbour = { id: string; title: string } | null;

export function LessonView({
  lesson,
  track,
  position,
  prev,
  next,
  depth,
  fact,
  why,
  analogy,
  conceptContext,
}: {
  lesson: Lesson;
  track: { id: string; n: string };
  /** One-based position across the whole course. */
  position: { index: number; total: number };
  prev: Neighbour;
  next: Neighbour;
  depth: Depth;
  fact: string;
  why: Why | null;
  analogy: Analogy | null;
  conceptContext: LessonConceptContext;
}) {
  const router = useRouter();
  const { done, toggleDone, markSeen, unlocked, hydrated, showShield } =
    useProgress();

  useEffect(() => {
    markSeen(lesson.id);
  }, [lesson.id, markSeen]);

  /*
   * Paging obeys the same gate as the sidebar: the lesson after a track's last
   * one belongs to the next track, and that track is shut until its exam is
   * passed. Held until hydration, since the unlocked map before then is the
   * empty-progress one and would lock a learner out of their own course.
   */
  const go = useCallback(
    (target: Neighbour) => {
      if (!target) return;
      const trackId = LESSON_TRACK[target.id];
      if (hydrated && trackId && unlocked[trackId] === false) {
        const at = TRACK_OUTLINES.findIndex((t) => t.id === trackId);
        const previous = TRACK_OUTLINES[at - 1];
        showShield({
          title: "Track locked",
          message: `Pass the ${previous ? previous.n : "previous track"} exam to unlock ${
            TRACK_OUTLINES[at]?.n ?? "this track"
          }. The gate is the point: every track assumes the one before it.`,
        });
        return;
      }
      router.push(`/lesson/${target.id}`);
    },
    [router, hydrated, unlocked, showShield],
  );

  // Arrow keys page through the course, except while the learner is typing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }
      if (event.key === "ArrowLeft") go(prev);
      if (event.key === "ArrowRight") go(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, prev, next]);

  const drillCount = GEN[lesson.id] ? GENERATED_REPS : depth.d.length;
  const words =
    depth.ex.join(" ").split(" ").length + lesson.cs.split(" ").length;
  const minutes = Math.max(4, Math.round(words / 150) + 4);
  const completed = Boolean(done[lesson.id]);

  return (
    <div
      data-stagger="1"
      className="mx-auto w-full max-w-[860px] px-5 sm:px-8 lg:px-14 pt-8 sm:pt-12 lg:pt-14 pb-24 lg:pb-30 flex flex-col gap-10 sm:gap-12"
    >
      <header className="flex flex-col gap-3.5">
        <div className="flex justify-between items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link href="/" className="text-ink-faint hover:text-ink-muted">
              Overview
            </Link>
            <span className="text-ink-ghost">/</span>
            <span className="text-accent truncate">{track.n}</span>
          </div>
          <span className="shrink-0">
            Lesson {position.index} of {position.total}
          </span>
        </div>

        <h1 className="text-[clamp(2.25rem,7vw,4rem)] leading-none font-semibold tracking-[-0.035em]">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-1.5 font-mono text-xs text-ink-faint">
          <span>{minutes} min read</span>
          <span>{lesson.f.length} formulas</span>
          <span>{drillCount} drills</span>
          <span>{lesson.q.length} quiz questions</span>
        </div>
      </header>

      <ConceptContextPanel context={conceptContext} />

      <PhaseRule step="01" label="Understand" note="Read this once, slowly." />

      <section className="bg-surface border border-line rounded-lg overflow-hidden">
        <Eyebrow
          tone="accent"
          className="bg-surface-2 px-5 sm:px-[22px] py-3 border-b border-line tracking-[0.14em]"
        >
          {"// why a CS major needs this"}
        </Eyebrow>
        <p className="px-5 sm:px-[22px] py-6 text-[17px] sm:text-lg leading-[1.7] text-ink-muted">
          {lesson.cs}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
        <section className="flex flex-col gap-3 bg-gold-surface border border-gold-line border-l-2 border-l-gold rounded-lg px-5 py-5 sm:px-6">
          <Eyebrow tone="gold">Fun fact</Eyebrow>
          <p className="text-base leading-[1.65] text-gold-ink">{fact}</p>
        </section>
        <section className="flex flex-col gap-3 bg-surface-3 border border-line border-l-2 border-l-accent rounded-lg px-5 py-5 sm:px-6">
          <Eyebrow tone="accent">Think of it like</Eyebrow>
          <p className="text-base leading-[1.65] text-ink-muted">{depth.an}</p>
        </section>
      </div>

      {depth.fb && (
        <section className="bg-[linear-gradient(135deg,var(--surface-2),var(--surface-3))] border border-line-strong rounded-[10px] px-6 py-7 sm:px-9 sm:py-8 flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <Eyebrow tone="dim" className="tracking-[0.2em]">
              A fable
            </Eyebrow>
            <span className="flex-1 h-px bg-line-strong" aria-hidden />
          </div>
          <p className="font-serif italic text-[17px] sm:text-[19px] leading-[1.85] text-ink-muted">
            {depth.fb}
          </p>
        </section>
      )}

      {analogy && (
        <section className="flex flex-col gap-4 px-5 py-6 sm:px-7 bg-surface-3 border border-line border-l-2 border-l-accent rounded-lg">
          <div className="flex flex-col gap-2">
            <Eyebrow tone="accent">The whole topic, by analogy</Eyebrow>
            <p className="text-[16.5px] sm:text-[17.5px] leading-[1.7] text-ink-muted max-w-[68ch]">
              {analogy.scene}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            {analogy.map.map(([from, to]) => (
              <div
                key={from}
                className="grid sm:grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-1 items-baseline px-4 py-2.5 bg-surface border border-line rounded-md"
              >
                <span className="text-[15px] leading-[1.5] text-ink-muted">
                  {from}
                </span>
                <span aria-hidden className="hidden sm:block font-mono text-xs text-ink-ghost">
                  →
                </span>
                <span className="text-[15px] leading-[1.5] text-accent">
                  {to}
                </span>
              </div>
            ))}
          </div>

          {/* Bounding the analogy is the point of having one. */}
          <div className="flex flex-col gap-1.5 border-t border-line pt-4">
            <Eyebrow tone="gold">Where the analogy breaks</Eyebrow>
            <p className="text-[15.5px] leading-[1.65] text-gold-ink max-w-[68ch]">
              {analogy.breaks}
            </p>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-dim">
          The full explanation
        </h2>
        <div className="flex flex-col gap-5 max-w-[70ch]">
          {depth.ex.map((paragraph, i) => (
            <div
              key={i}
              className="grid grid-cols-[30px_1fr] gap-3.5 items-start"
            >
              <div className="font-mono text-xs text-ink-ghost pt-[5px]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-[17px] sm:text-lg leading-[1.75] text-ink-muted">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PhaseRule
        step="02"
        label="Reference"
        note="Everything worth memorising, in one place."
      />

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-dim">
          Formulas that matter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.f.map(([label, expr, note], i) => (
            <div
              key={i}
              className="bg-surface border border-line rounded-lg p-5 flex flex-col gap-2.5 transition-[border-color,transform] duration-200 hover:border-line-strong hover:-translate-y-0.5"
            >
              <Eyebrow className="tracking-[0.14em]">{label}</Eyebrow>
              <div className="font-mono text-[17px] sm:text-lg leading-[1.4] text-ink break-words">
                {expr}
              </div>
              <div className="text-sm leading-[1.5] text-ink-muted">{note}</div>
            </div>
          ))}
        </div>
      </section>

      {lesson.code && (
        <section className="bg-inset border border-line rounded-lg overflow-hidden">
          <Eyebrow
            tone="dim"
            className="bg-surface px-5 sm:px-[22px] py-3 border-b border-line tracking-[0.14em]"
          >
            {"// in code"}
          </Eyebrow>
          <pre className="m-0 p-5 sm:p-[22px] font-mono text-[13px] sm:text-[14.5px] leading-[1.7] text-ink-muted overflow-x-auto">
            {lesson.code}
          </pre>
        </section>
      )}

      <PhaseRule
        step="03"
        label="Practice"
        note="You do not know it until you can do it."
      />

      <MatchGame formulas={lesson.f} lessonId={lesson.id} />

      {why && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Eyebrow tone="accent" className="tracking-[0.2em]">
              Why it is true
            </Eyebrow>
            <span className="flex-1 h-px bg-line-strong" aria-hidden />
          </div>

          <h2 className="text-[19px] sm:text-[23px] font-semibold tracking-[-0.02em] leading-[1.25] max-w-[52ch]">
            {why.q}
          </h2>

          <p className="text-[16.5px] leading-[1.7] text-ink-muted max-w-[70ch]">
            {why.a}
          </p>

          <ol className="flex flex-col gap-2.5">
            {why.s.map((step, i) => (
              <li
                key={i}
                className="grid grid-cols-[28px_1fr] gap-3 items-start px-4 py-3.5 bg-surface border border-line rounded-md"
              >
                <span className="font-mono text-[11px] text-accent pt-[3px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15.5px] leading-[1.65] text-ink-muted">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <p className="text-[15.5px] leading-[1.65] text-gold-ink bg-gold-surface border border-gold-line border-l-2 border-l-gold rounded-md px-4 py-3.5 max-w-[70ch]">
            {why.m}
          </p>
        </section>
      )}

      {lesson.graph && <GraphPanel graphKey={lesson.graph} />}

      {lesson.demo === "binarySearch" && <BinarySearchDemo />}
      {lesson.demo === "riemann" && <RiemannDemo />}
      {lesson.demo === "truthTable" && <TruthTableDemo />}
      {lesson.demo === "numberLine" && <NumberLineDemo />}
      {lesson.demo === "inequality" && <InequalityDemo />}

      <WriteItOut
        lessonId={lesson.id}
        title={lesson.title}
        idea={lesson.idea}
        formulas={lesson.f}
      />

      {/* A real box, not `contents`: scrollIntoView needs something with a
          layout box to scroll to. Scroll margin keeps the heading clear of the
          sticky mobile bar on arrival. */}
      <div id={TUTOR_ANCHOR} className="scroll-mt-20">
        <TutorPanel
          lessonId={lesson.id}
          title={lesson.title}
          idea={lesson.idea}
          cs={lesson.cs}
          formulas={lesson.f}
          analogy={depth.an}
        />
      </div>

      <DrillPanel
        lessonId={lesson.id}
        title={lesson.title}
        fallback={depth.d}
      />

      <section className="flex flex-col gap-5">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-dim">
          Check yourself
        </h2>
        <QuizBlock
          lessonId={lesson.id}
          title={lesson.title}
          questions={lesson.q}
        />
      </section>

      <section className="flex flex-wrap gap-3 items-center border-t border-line pt-6">
        <button
          onClick={() => toggleDone(lesson.id)}
          className={cx(
            "font-mono text-[13px] font-semibold rounded-md px-6 py-3 border cursor-pointer transition-colors",
            completed
              ? "bg-accent text-accent-ink border-accent"
              : "bg-transparent text-accent border-accent-line hover:border-accent",
          )}
        >
          {completed ? "✓ Completed" : "Mark complete"}
        </button>

        <GhostButton
          onClick={() => go(prev)}
          disabled={!prev}
          className="max-w-full truncate"
        >
          ← {prev ? prev.title : "Start"}
        </GhostButton>

        <GhostButton
          onClick={() => go(next)}
          disabled={!next}
          className="max-w-full truncate"
        >
          {next ? next.title : "End"} →
        </GhostButton>

        <span className="hidden md:inline font-mono text-xs text-ink-ghost ml-1">
          ← / → to move between lessons
        </span>
      </section>

      <AskAIButton />

      <CourseFooter />
    </div>
  );
}
