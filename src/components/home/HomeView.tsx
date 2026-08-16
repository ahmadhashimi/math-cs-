"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MathAtlas } from "@/components/home/MathAtlas";
import { TrackSequence, type HomeTrack } from "@/components/home/TrackSequence";
import {
  CourseFooter,
  Eyebrow,
  GoldButton,
  PrimaryButton,
  StatTile,
  cx,
  type Accent,
} from "@/components/ui";
import type { CourseStats } from "@/lib/course";
import type { CourseAtlas } from "@/lib/concept-graph";
import { useProgress } from "@/lib/progress";
import { FINAL_EXAM_ID } from "@/lib/types";

/**
 * The tag above each "what every lesson contains" card. Rendered locally rather
 * than through `Eyebrow`: the prototype's tag is 10px/.14em at every width,
 * and `Eyebrow`'s own `sm:text-[11px] tracking-[0.16em]` would win the cascade
 * over an override passed through `className` (Tailwind emits arbitrary values
 * in ascending order, so the larger base value lands later in the sheet).
 */
const PART_TAG_TONE: Record<Accent, string> = {
  accent: "text-accent",
  gold: "text-gold",
  dim: "text-ink-dim",
};

/** What a learner gets in every one of the lessons — the course's promise. */
const LESSON_PARTS: { tag: string; tone: Accent; title: string; body: string }[] =
  [
    {
      tag: "Opens with",
      tone: "accent",
      title: "A definition and its place",
      body: "The plain meaning, the first formal notation, what it builds on, and the later ideas that reuse it.",
    },
    {
      tag: "Then",
      tone: "accent",
      title: "Why a CS major needs it",
      body: "Every lesson names the thing in computing that breaks if you do not know this. No abstract motivation.",
    },
    {
      tag: "Then",
      tone: "gold",
      title: "History and a bounded analogy",
      body: "Where the idea came from, one concrete comparison, and an explicit warning about where that comparison stops being true.",
    },
    {
      tag: "Practice",
      tone: "accent",
      title: "The derivation and why it is true",
      body: "The formula is rebuilt from the mechanism, then argued step by step instead of being handed down as a rule.",
    },
    {
      tag: "Practice",
      tone: "dim",
      title: "Live models and five drills",
      body: "Manipulate the mathematics where a figure helps, then type fresh answers until the procedure becomes fluent.",
    },
    {
      tag: "Proof",
      tone: "accent",
      title: "Quizzes and a track exam",
      body: "Two graded questions per lesson, then a shuffled exam over the whole track with a 70% pass mark and a review plan if you miss.",
    },
  ];

export function HomeView({
  stats,
  tracks,
  atlas,
  firstLessonId,
}: {
  stats: CourseStats;
  tracks: HomeTrack[];
  atlas: CourseAtlas;
  firstLessonId: string;
}) {
  const router = useRouter();
  const {
    hydrated,
    queue,
    doneCount,
    lastLesson,
    allTracksPassed,
    graduated,
  } = useProgress();

  // Progress lives in localStorage and is read in a mount effect, so the first
  // client pass matches the server's un-progressed markup by construction. The
  // sections that would otherwise pop in are held back until that read lands.
  const queueItems = hydrated ? Object.entries(queue) : [];
  const resumeId = doneCount > 0 ? (lastLesson ?? firstLessonId) : firstLessonId;

  return (
    <div
      data-stagger="1"
      className="mx-auto w-full max-w-[1000px] px-5 sm:px-8 lg:px-14 pt-10 sm:pt-14 lg:pt-16 pb-24 lg:pb-30 flex flex-col gap-12 sm:gap-[52px]"
    >
      <header className="flex flex-col gap-4 sm:gap-[18px]">
        <Eyebrow tone="accent" className="tracking-[0.18em]">
          Math for a CS Degree · by Mujtaba Hashimi · Fannos Academy
        </Eyebrow>

        <h1 className="text-[clamp(2.5rem,7vw,4.875rem)] leading-[1.02] font-semibold tracking-[-0.04em] max-w-[15ch]">
          Start at{" "}
          <em className="font-serif italic font-medium text-accent">arithmetic</em>.
          Finish at{" "}
          <em className="font-serif italic font-medium text-accent">AI</em>.
        </h1>

        <p className="text-[clamp(1.0625rem,2.4vw,1.25rem)] leading-[1.6] text-ink-muted max-w-[62ch]">
          Thirteen tracks in strict order: pre-algebra through calculus, discrete
          math through cryptography, ending at the mathematics a neural network
          actually runs on. Built for someone who did some high school math a
          while ago and needs to pass the real courses.
        </p>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em]">
          <span className="text-gold border border-gold-line rounded-full px-3.5 py-1.5">
            Proprietary course
          </span>
          <span className="text-ink-faint">
            Licensed to a single learner · not for redistribution
          </span>
        </div>

        {/* The orientation is not examined, so it has to earn its click here or
            it will never be read. It sits above the rule, before any track. */}
        <Link
          href="/start"
          className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 self-start px-4 py-3 bg-surface border border-line rounded-lg hover:border-accent-line transition-colors"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            Read first
          </span>
          <span className="text-[15px] text-ink">
            Why the old model fails, how ideas connect, and what AI is built from
          </span>
          <span className="font-mono text-[13px] text-ink-faint group-hover:text-accent transition-colors">
            →
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5 font-mono text-[13px] text-ink-faint">
          <span className="text-ink-muted">The rule:</span>
          <span>learn</span>
          <span className="text-ink-ghost">→</span>
          <span>drill</span>
          <span className="text-ink-ghost">→</span>
          <span>pass the exam</span>
          <span className="text-ink-ghost">→</span>
          <span className="text-accent">unlock the next track</span>
          <span className="text-ink-ghost">·</span>
          <span className="text-gold">fail three times and you redo the lessons</span>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatTile value={stats.lessons} label="lessons" />
        <StatTile value={stats.tracks} label="tracks" />
        <StatTile value={stats.formulas} label="formulas" />
        <StatTile value={stats.drills} label="drill reps" />
        <StatTile value={stats.quizQuestions} label="quiz questions" />
      </div>

      <section id="math-atlas" className="flex flex-col gap-4 sm:gap-[18px] scroll-mt-6">
        <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
          <Eyebrow>The connected mental model</Eyebrow>
          <span className="font-mono text-xs text-ink-faint">
            Every lesson has a definition, a region and a way forward.
          </span>
        </div>
        <p className="text-[17px] sm:text-lg leading-[1.65] text-ink-muted max-w-[70ch]">
          A timetable cuts mathematics into subjects. Reality does not. The
          atlas keeps the connections visible: what an idea means, what it rests
          on, and what new name it takes when it returns in geometry, algorithms
          or AI.
        </p>
        <MathAtlas atlas={atlas} />
      </section>

      <section className="flex flex-col gap-4">
        <Eyebrow>What every lesson contains</Eyebrow>
        <div className="grid md:grid-cols-3 gap-3">
          {LESSON_PARTS.map((part) => (
            <div
              key={part.title}
              className="flex flex-col gap-2 p-5 bg-surface border border-line rounded-lg"
            >
              <div
                className={cx(
                  "font-mono text-[10px] uppercase tracking-[0.14em]",
                  PART_TAG_TONE[part.tone],
                )}
              >
                {part.tag}
              </div>
              <div className="text-[15px] font-semibold">{part.title}</div>
              <div className="text-sm leading-[1.55] text-ink-muted">{part.body}</div>
            </div>
          ))}
        </div>
      </section>

      <TrackSequence tracks={tracks} />

      {queueItems.length > 0 && (
        <section className="flex flex-col gap-4 px-5 py-6 sm:px-7 sm:py-[26px] bg-gold-surface border border-gold-line rounded-[10px]">
          <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-2">
            <div className="flex flex-col gap-1.5">
              <Eyebrow tone="gold">Your review queue</Eyebrow>
              <div className="text-xl font-semibold tracking-[-0.02em]">
                {queueItems.length}{" "}
                {queueItems.length === 1 ? "lesson" : "lessons"} waiting on you
              </div>
            </div>
            <span className="font-mono text-xs text-gold-dim">
              Everything you got wrong, kept until you get it right
            </span>
          </div>
          <p className="text-[15.5px] leading-[1.6] text-gold-ink max-w-[70ch]">
            Forgetting is not a character flaw, it is the default. These are the
            exact lessons where a quiz or a written answer went wrong — they stay
            on this list across sessions until you return and clear them.
          </p>
          <div className="flex flex-wrap gap-2">
            {queueItems.map(([key, item]) => (
              <Link
                key={key}
                href={`/lesson/${item.lessonId}`}
                className="flex flex-col gap-1 max-w-full min-w-0 font-mono text-[13px] leading-[1.4] bg-gold-inset border border-gold-line rounded-[7px] px-[15px] py-[11px] transition-colors hover:border-gold"
              >
                <span className="text-[10px] uppercase tracking-[0.14em] text-gold-dim">
                  {item.kind === "write" ? "written" : "quiz"}
                </span>
                <span className="text-ink">{item.title}</span>
                {item.misses > 1 && (
                  <span className="text-gold-dim">×{item.misses}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        className={cx(
          "flex flex-wrap items-center gap-5 px-5 py-6 sm:px-7 sm:py-[26px] bg-gold-surface border rounded-[10px] transition-all",
          allTracksPassed ? "border-gold" : "border-gold-line opacity-55",
        )}
      >
        <div className="flex flex-col gap-1.5 flex-1 min-w-[min(100%,15rem)]">
          <Eyebrow tone="gold">Final examination</Eyebrow>
          <div className="text-[22px] font-semibold tracking-[-0.02em]">
            The whole course, one sitting.
          </div>
          <div className="text-sm text-ink-muted">
            {!allTracksPassed
              ? "Unlocks when every track exam is passed"
              : graduated
                ? "Passed — view your certificate"
                : "2 questions from every track · pass at 80%"}
          </div>
        </div>
        {graduated ? (
          <GoldButton
            className="shrink-0"
            onClick={() => router.push("/certificate")}
          >
            View certificate
          </GoldButton>
        ) : (
          <GoldButton
            className="shrink-0"
            disabled={!allTracksPassed}
            onClick={() => router.push(`/exam/${FINAL_EXAM_ID}`)}
          >
            Sit the final
          </GoldButton>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <PrimaryButton
          className="text-[14px] px-8 py-4"
          onClick={() => router.push(`/lesson/${resumeId}`)}
        >
          {doneCount > 0
            ? "Continue where you left off"
            : "Start at the beginning"}
        </PrimaryButton>
        <Link
          href="/formulas"
          className="font-mono text-[14px] rounded-md px-6 py-4 text-ink-muted border border-line-strong hover:text-ink hover:border-ink-faint transition-colors"
        >
          Formula sheet
        </Link>
      </div>

      <CourseFooter className="border-t border-line" />
    </div>
  );
}
