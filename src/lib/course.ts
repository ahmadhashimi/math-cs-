import { TRACKS, THREADS, TOTAL_LESSONS } from "@/data/course-data";
import { DEPTH } from "@/data/course-depth";
import { FACTS } from "@/data/course-facts";
import { ANALOGY } from "@/data/course-analogy";
import { WHY } from "@/data/course-why";
import type {
  Analogy,
  Depth,
  ExamPrompt,
  ExamResult,
  ExamVerdict,
  ExamQuestion,
  Lesson,
  LessonContext,
  Track,
  Thread,
  Why,
} from "@/lib/types";
import { FINAL_EXAM_ID, FINAL_PASS_MARK, PASS_MARK } from "@/lib/types";

export { TRACKS, THREADS, TOTAL_LESSONS };

/** Every lesson in course order, with its track. */
const FLAT: { lesson: Lesson; track: Track }[] = TRACKS.flatMap((track) =>
  track.lessons.map((lesson) => ({ lesson, track })),
);

const BY_ID = new Map(FLAT.map((entry, index) => [entry.lesson.id, { ...entry, index }]));

export function getLessonContext(lessonId: string): LessonContext | null {
  const hit = BY_ID.get(lessonId);
  if (!hit) return null;
  const prev = FLAT[hit.index - 1]?.lesson ?? null;
  const next = FLAT[hit.index + 1]?.lesson ?? null;
  return {
    lesson: hit.lesson,
    track: hit.track,
    index: hit.index,
    prev: prev && { id: prev.id, title: prev.title },
    next: next && { id: next.id, title: next.title },
  };
}

export function getTrack(trackId: string): Track | null {
  return TRACKS.find((t) => t.id === trackId) ?? null;
}

export function getDepth(lessonId: string): Depth {
  return DEPTH[lessonId] ?? { an: "", ex: [], d: [] };
}

/** The extended analogy for a lesson, or null while it is unwritten. */
export function getAnalogy(lessonId: string): Analogy | null {
  return ANALOGY[lessonId] ?? null;
}

/** The rigor layer for a lesson, or null while it is still unwritten. */
export function getWhy(lessonId: string): Why | null {
  return WHY[lessonId] ?? null;
}

export function getFact(lessonId: string): string {
  return FACTS[lessonId] ?? "";
}

/** The first lesson of the course — where a new learner starts. */
export const FIRST_LESSON_ID = FLAT[0]?.lesson.id ?? "";

/** Lightweight index for the sidebar: no lesson bodies, no depth layer. */
export type TrackOutline = {
  id: string;
  n: string;
  sub: string;
  lessons: { id: string; title: string }[];
};

export const TRACK_OUTLINES: TrackOutline[] = TRACKS.map((t) => ({
  id: t.id,
  n: t.n,
  sub: t.sub,
  lessons: t.lessons.map((l) => ({ id: l.id, title: l.title })),
}));

export type CourseStats = {
  lessons: number;
  tracks: number;
  formulas: number;
  drills: number;
  quizQuestions: number;
};

export const COURSE_STATS: CourseStats = (() => {
  let formulas = 0;
  let drills = 0;
  let quizQuestions = 0;
  for (const { lesson } of FLAT) {
    formulas += lesson.f.length;
    quizQuestions += lesson.q?.length ?? 0;
    drills += getDepth(lesson.id).d.length;
  }
  return {
    lessons: TOTAL_LESSONS,
    tracks: TRACKS.length,
    formulas,
    drills,
    quizQuestions,
  };
})();

/** Every multiple-choice question in a track, tagged with its source lesson. */
export function trackExamPool(track: Track): ExamQuestion[] {
  const pool: ExamQuestion[] = [];
  for (const lesson of track.lessons) {
    // Counted over the lesson's own questions so an id stays put when an
    // unrelated lesson gains or loses one.
    let n = 0;
    for (const item of lesson.q ?? []) {
      if (item.t !== "mc") continue;
      pool.push({
        id: `${lesson.id}#${n++}`,
        q: item.q,
        o: item.o,
        a: item.a,
        e: item.e,
        from: lesson.title,
        lessonId: lesson.id,
      });
    }
  }
  return pool;
}

/**
 * The comprehensive final draws from every track, so its pool is grouped by
 * track and sampled at build time on the client.
 */
export function finalExamPools(): ExamQuestion[][] {
  return TRACKS.map((track) =>
    track.lessons.flatMap((lesson) =>
      (lesson.q ?? [])
        .filter((item) => item.t === "mc")
        .map((item, i) => ({
          id: `${lesson.id}#${i}`,
          q: item.q,
          o: (item as { o: string[] }).o,
          a: (item as { a: number }).a,
          e: item.e,
          from: `${track.n} · ${lesson.title}`,
          lessonId: lesson.id,
        })),
    ),
  );
}

/* -------------------------------------------------------------------------- *
 * Exams: the answer key stays on the server.
 *
 * The page ships prompts — question and options, nothing else — and the client
 * never learns which option is right until the attempt has been submitted and
 * scored here. That is the whole point of this block: while the exam was scored
 * in the browser, the key travelled with it, and the gate the course is built
 * on could be read straight out of the page source.
 * -------------------------------------------------------------------------- */

/** Questions the final draws from each track. */
export const FINAL_PER_TRACK = 2;

/** The full pool for an exam, grouped as the client expects to sample it. */
function examPools(trackId: string): ExamQuestion[][] {
  if (trackId === FINAL_EXAM_ID) return finalExamPools();
  const track = getTrack(trackId);
  return track ? [trackExamPool(track)] : [];
}

/** Strips the answer key. This is the only exam shape a page may send out. */
export function examPrompts(trackId: string): ExamPrompt[][] {
  return examPools(trackId).map((pool) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructuring is the strip
    pool.map(({ a, e, ...prompt }) => prompt),
  );
}

/** How many questions a submitted attempt must contain to be scoreable. */
export function expectedCount(trackId: string): number {
  const pools = examPools(trackId);
  if (trackId === FINAL_EXAM_ID) {
    return pools.reduce((n, pool) => n + Math.min(FINAL_PER_TRACK, pool.length), 0);
  }
  return pools[0]?.length ?? 0;
}

export type SubmittedAnswer = { id: string; pick: number };

/**
 * Scores an attempt. Returns null when the submission does not describe a real
 * sitting of this exam, which is refused rather than scored: a short paper
 * would otherwise let someone answer three easy questions and claim 100%.
 */
export function scoreAttempt(
  trackId: string,
  answers: SubmittedAnswer[],
): ExamVerdict | null {
  const pools = examPools(trackId);
  if (pools.length === 0) return null;

  const key = new Map<string, { question: ExamQuestion; poolIndex: number }>();
  pools.forEach((pool, poolIndex) => {
    for (const question of pool) key.set(question.id, { question, poolIndex });
  });

  const total = expectedCount(trackId);
  if (answers.length !== total) return null;

  const seen = new Set<string>();
  const perPool = new Map<number, number>();
  for (const { id } of answers) {
    const hit = key.get(id);
    // Unknown id, or the same question submitted twice to pad the count.
    if (!hit || seen.has(id)) return null;
    seen.add(id);
    perPool.set(hit.poolIndex, (perPool.get(hit.poolIndex) ?? 0) + 1);
  }

  // The final must be spread across the tracks, not harvested from the easiest.
  if (trackId === FINAL_EXAM_ID) {
    for (const count of perPool.values()) {
      if (count > FINAL_PER_TRACK) return null;
    }
  }

  const results: ExamResult[] = [];
  const missed: { id: string; title: string }[] = [];
  let right = 0;

  for (const { id, pick } of answers) {
    const { question } = key.get(id)!;
    const correct = pick === question.a;
    if (correct) right += 1;
    else if (!missed.some((m) => m.id === question.lessonId)) {
      missed.push({ id: question.lessonId, title: question.from });
    }
    results.push({ id, a: question.a, e: question.e, correct });
  }

  // Integer arithmetic, matching the rule the client used to apply: floor the
  // displayed percentage so it can never disagree with the verdict.
  const mark = trackId === FINAL_EXAM_ID ? FINAL_PASS_MARK : PASS_MARK;
  return {
    total,
    right,
    pct: total ? Math.floor((right * 100) / total) : 0,
    pass: total > 0 && right * 100 >= mark * total,
    results,
    missed,
  };
}

/** Printable formula sheet: every formula in the course, grouped by track. */
export type SheetSection = {
  id: string;
  n: string;
  rows: { key: string; label: string; expr: string }[];
};

export const FORMULA_SHEET: SheetSection[] = TRACKS.map((track) => ({
  id: track.id,
  n: track.n,
  rows: track.lessons.flatMap((lesson) =>
    lesson.f.map((f, i) => ({ key: `${lesson.id}-${i}`, label: f[0], expr: f[1] })),
  ),
}));

/** Resolves a thread's lesson ids to titles for the home-page mental model. */
export function threadViews() {
  return THREADS.map((thread: Thread) => ({
    id: thread.id,
    n: thread.n,
    line: thread.line,
    why: thread.why,
    steps: thread.steps.map(([lessonId, note]) => {
      const hit = BY_ID.get(lessonId);
      return {
        lessonId,
        title: hit ? hit.lesson.title : lessonId,
        note,
        exists: Boolean(hit),
      };
    }),
  }));
}

export type ThreadView = ReturnType<typeof threadViews>[number];

/** Track ids in course order — the gating sequence. */
export const TRACK_ORDER: string[] = TRACKS.map((t) => t.id);

export function trackTitle(trackId: string): string {
  if (trackId === FINAL_EXAM_ID) return "Final examination";
  return getTrack(trackId)?.n ?? trackId;
}

/** Lesson titles by id, for rendering review queues and remediation plans. */
export const LESSON_TITLES: Record<string, string> = Object.fromEntries(
  FLAT.map(({ lesson }) => [lesson.id, lesson.title]),
);

/** The track a lesson belongs to — used to route review-queue jumps. */
export const LESSON_TRACK: Record<string, string> = Object.fromEntries(
  FLAT.map(({ lesson, track }) => [lesson.id, track.id]),
);
