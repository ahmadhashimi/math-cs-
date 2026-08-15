import { TRACKS, THREADS, TOTAL_LESSONS } from "@/data/course-data";
import { DEPTH } from "@/data/course-depth";
import { FACTS } from "@/data/course-facts";
import type {
  Depth,
  ExamQuestion,
  Lesson,
  LessonContext,
  Track,
  Thread,
} from "@/lib/types";
import { FINAL_EXAM_ID } from "@/lib/types";

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
    for (const item of lesson.q ?? []) {
      if (item.t !== "mc") continue;
      pool.push({
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
        .map((item) => ({
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
