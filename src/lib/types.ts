/** Domain types for the course content. Mirrors the shape of the data modules in src/data. */

/** [label, expression, plain-language note] */
export type Formula = [label: string, expr: string, note: string];

/** [question, answer, accepted alternates?] */
export type Drill = [question: string, answer: string, alt?: string[]];

export type MultipleChoiceQuestion = {
  t: "mc";
  q: string;
  /** Answer options, in author order. */
  o: string[];
  /** Index into `o` of the correct option. */
  a: number;
  /** Explanation shown once answered. */
  e: string;
};

export type TypedAnswerQuestion = {
  t: "in";
  q: string;
  /** Canonical answer, compared after normalisation. */
  a: string;
  /** Additional accepted spellings. */
  alt?: string[];
  /** Step-by-step solution, revealed on request. */
  s?: string[];
  e: string;
};

export type Question = MultipleChoiceQuestion | TypedAnswerQuestion;

/** Keys of the interactive visualisations defined in src/lib/graphs.ts. */
export type GraphKey =
  | "line"
  | "parabola"
  | "shift"
  | "exp"
  | "sine"
  | "seq"
  | "limit"
  | "tangent"
  | "relu"
  | "descent"
  | "entropy"
  | "binomdist"
  | "amort"
  | "vector"
  | "growth"
  | "powers"
  | "rate";

/** Keys of the hand-built step-through demos. */
export type DemoKey =
  | "binarySearch"
  | "riemann"
  | "truthTable"
  | "numberLine"
  | "inequality";

export type Lesson = {
  id: string;
  title: string;
  /** Why a CS major needs this. */
  cs: string;
  /** The one-sentence core idea. */
  idea: string;
  f: Formula[];
  q: Question[];
  code?: string;
  demo?: DemoKey;
  graph?: GraphKey;
};

export type Track = {
  id: string;
  n: string;
  sub: string;
  lessons: Lesson[];
};

/** A returning idea that reappears across tracks, shown on the course home page. */
export type Thread = {
  id: string;
  n: string;
  line: string;
  why: string;
  /** [lessonId, one-line note] */
  steps: [lessonId: string, note: string][];
};

/** The depth layer: analogy, derivation, fable and fixed drill set for a lesson. */
export type Depth = {
  /** Analogy. */
  an: string;
  /** Explanation paragraphs. */
  ex: string[];
  /** Fallback drills, used when a lesson has no procedural generator. */
  d: Drill[];
  /** Fable — a short teaching story, on the heaviest lessons only. */
  fb?: string;
};

/** A lesson plus the track it belongs to and its position in the whole course. */
export type LessonContext = {
  lesson: Lesson;
  track: Track;
  /** Zero-based index across every lesson in the course. */
  index: number;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
};

/**
 * A question with its answer key. This shape must never reach the browser —
 * see `ExamPrompt` for the half that does.
 */
export type ExamQuestion = {
  /** Stable across builds: `lessonId#indexWithinLesson`. */
  id: string;
  q: string;
  o: string[];
  a: number;
  e: string;
  /** Human-readable source, e.g. "Pre-algebra · Signed numbers". */
  from: string;
  lessonId: string;
};

/**
 * What the exam page is allowed to ship: the question and its options, with no
 * `a` and no `e`. The explanation is withheld too, because an explanation that
 * says "subtract 2x from both sides to get x = 5" is the answer key in prose.
 */
export type ExamPrompt = Omit<ExamQuestion, "a" | "e">;

/** One graded question, returned by the server after an attempt is submitted. */
export type ExamResult = {
  id: string;
  /** Index of the correct option — released only once the attempt is scored. */
  a: number;
  e: string;
  correct: boolean;
};

/** The server's verdict on a submitted attempt. */
export type ExamVerdict = {
  total: number;
  right: number;
  pct: number;
  pass: boolean;
  results: ExamResult[];
  missed: { id: string; title: string }[];
};

export const PASS_MARK = 70;
export const FINAL_PASS_MARK = 80;
/** Failed attempts before a track exam locks and its flagged lessons must be redone. */
export const STRIKE_LIMIT = 3;
export const FINAL_EXAM_ID = "__final";
