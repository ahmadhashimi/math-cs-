"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { TRACK_ORDER } from "@/lib/course";
import { FINAL_EXAM_ID, STRIKE_LIMIT } from "@/lib/types";

export type Theme = "dark" | "light";

export type QueueKind = "quiz" | "write";

export type QueueItem = {
  lessonId: string;
  kind: QueueKind;
  title: string;
  misses: number;
};

/** A lesson flagged by a failed exam question. */
export type WeakLesson = { id: string; title: string };

export type Shield = { title: string; message: string };

type PersistedState = {
  /** Lesson id → completed. */
  done: Record<string, boolean>;
  /** Track id (or `__final`) → passed. */
  passed: Record<string, boolean>;
  /** Track id → failed-attempt count. */
  attempts: Record<string, number>;
  /** Track id → the lessons its missed questions came from. */
  weak: Record<string, WeakLesson[]>;
  /** `lessonId|kind` → the miss that put it here. */
  queue: Record<string, QueueItem>;
  /** Where to resume. */
  lastLesson: string | null;
  /** False until the learner has landed on the course home once. */
  seen: boolean;
};

const STORAGE_KEY = "mfcs-progress-v1";
const THEME_KEY = "mfcs-theme";

const EMPTY: PersistedState = {
  done: {},
  passed: {},
  attempts: {},
  weak: {},
  queue: {},
  lastLesson: null,
  seen: false,
};

type ProgressValue = {
  /** False during the first render pass, before localStorage has been read. */
  hydrated: boolean;
  done: Record<string, boolean>;
  passed: Record<string, boolean>;
  attempts: Record<string, number>;
  weak: Record<string, WeakLesson[]>;
  queue: Record<string, QueueItem>;
  lastLesson: string | null;
  seen: boolean;

  doneCount: number;
  /** Track id → whether the learner may enter it. */
  unlocked: Record<string, boolean>;
  graduated: boolean;
  allTracksPassed: boolean;

  toggleDone: (lessonId: string) => void;
  markSeen: (lessonId?: string) => void;
  /** Records a track (or final) exam attempt and applies the three-strike rule. */
  recordExam: (input: {
    trackId: string;
    passed: boolean;
    missed: WeakLesson[];
  }) => void;
  /** True when a track exam is locked pending re-completion of flagged lessons. */
  examBlocked: (trackId: string) => boolean;
  addToQueue: (lessonId: string, kind: QueueKind, title: string) => void;
  clearFromQueue: (lessonId: string, kind: QueueKind) => void;
  resetProgress: () => void;

  theme: Theme;
  toggleTheme: () => void;

  shield: Shield | null;
  showShield: (shield: Shield) => void;
  dismissShield: () => void;

  /** Set while an exam is live and unscored — drives proctoring. */
  examLive: boolean;
  setExamLive: (live: boolean) => void;
  focusLost: number;
  resetFocusLost: () => void;
};

const ProgressContext = createContext<ProgressValue | null>(null);

/* -------------------------------------------------------------------------- *
 * localStorage as an external store.
 *
 * Progress lives in localStorage, which React treats as an external system:
 * useSyncExternalStore reads it through an in-memory cache so getSnapshot is
 * referentially stable between writes (a fresh object per call would loop the
 * renderer), and the `storage` event keeps every open tab on the same
 * snapshot. The server snapshot is EMPTY, so server markup and the first
 * client (hydration) render agree; the real snapshot arrives in the
 * post-hydration pass, together with `hydrated` flipping true.
 * -------------------------------------------------------------------------- */

let progressCache: PersistedState | null = null;
const progressListeners = new Set<() => void>();

function emitProgress() {
  for (const listener of progressListeners) listener();
}

/**
 * Parses a raw stored value. `null` raw means nothing is stored (or the key
 * was removed) and maps to EMPTY; a corrupt value returns `null` so the
 * caller decides whether to fall back or keep what it already has.
 */
function parseStored(raw: string | null): PersistedState | null {
  if (raw === null) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      done: parsed.done ?? {},
      passed: parsed.passed ?? {},
      attempts: parsed.attempts ?? {},
      weak: parsed.weak ?? {},
      queue: parsed.queue ?? {},
      lastLesson: parsed.lastLesson ?? null,
      seen: Boolean(parsed.seen),
    };
  } catch {
    return null;
  }
}

function readProgress(): PersistedState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode) — run from memory for this session.
  }
  return parseStored(raw) ?? EMPTY;
}

function getProgressSnapshot(): PersistedState {
  if (progressCache === null) progressCache = readProgress();
  return progressCache;
}

function getProgressServerSnapshot(): PersistedState {
  return EMPTY;
}

function onProgressStorage(event: StorageEvent) {
  // key === null means another tab called storage.clear().
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  const next = event.key === null ? EMPTY : parseStored(event.newValue);
  // A corrupt write from another tab must not wipe this tab's state.
  if (next === null) return;
  progressCache = next;
  emitProgress();
}

function subscribeProgress(listener: () => void) {
  if (progressListeners.size === 0) {
    window.addEventListener("storage", onProgressStorage);
  }
  progressListeners.add(listener);
  return () => {
    progressListeners.delete(listener);
    if (progressListeners.size === 0) {
      window.removeEventListener("storage", onProgressStorage);
    }
  };
}

/**
 * Atomic write: compute the next state from the current snapshot, persist the
 * whole blob in a single setItem, then swap the cache and notify. When the
 * write fails (quota, private mode) the next state still replaces the cache —
 * progress keeps working in memory rather than corrupting or reverting.
 */
function updateProgress(fn: (prev: PersistedState) => PersistedState) {
  const prev = getProgressSnapshot();
  const next = fn(prev);
  if (next === prev) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable or full. Progress stays in memory for this
    // session rather than breaking the lesson.
  }
  progressCache = next;
  emitProgress();
}

function toggleDone(lessonId: string) {
  updateProgress((prev) => ({
    ...prev,
    done: { ...prev.done, [lessonId]: !prev.done[lessonId] },
  }));
}

function markSeen(lessonId?: string) {
  updateProgress((prev) =>
    prev.seen && (!lessonId || prev.lastLesson === lessonId)
      ? prev
      : { ...prev, seen: true, lastLesson: lessonId ?? prev.lastLesson },
  );
}

function recordExam({
  trackId,
  passed,
  missed,
}: {
  trackId: string;
  passed: boolean;
  missed: WeakLesson[];
}) {
  updateProgress((prev) => {
    const attemptCount = (prev.attempts[trackId] ?? 0) + 1;
    const next: PersistedState = {
      ...prev,
      attempts: { ...prev.attempts, [trackId]: attemptCount },
      weak: { ...prev.weak, [trackId]: missed },
      passed: passed ? { ...prev.passed, [trackId]: true } : prev.passed,
    };
    // Third strike: the flagged lessons are un-marked and must be redone
    // in full before the exam unlocks again.
    if (!passed && attemptCount >= STRIKE_LIMIT && trackId !== FINAL_EXAM_ID) {
      const done = { ...prev.done };
      for (const lesson of missed) delete done[lesson.id];
      next.done = done;
    }
    return next;
  });
}

function addToQueue(lessonId: string, kind: QueueKind, title: string) {
  updateProgress((prev) => {
    const key = `${lessonId}|${kind}`;
    const existing = prev.queue[key];
    return {
      ...prev,
      queue: {
        ...prev.queue,
        [key]: {
          lessonId,
          kind,
          title,
          misses: (existing?.misses ?? 0) + 1,
        },
      },
    };
  });
}

function clearFromQueue(lessonId: string, kind: QueueKind) {
  updateProgress((prev) => {
    const key = `${lessonId}|${kind}`;
    if (!prev.queue[key]) return prev;
    const queue = { ...prev.queue };
    delete queue[key];
    return { ...prev, queue };
  });
}

function resetProgress() {
  updateProgress(() => ({ ...EMPTY, seen: true }));
}

/* -------------------------------------------------------------------------- *
 * Theme, same shape: localStorage + matchMedia as the external store. The
 * inline script in the root layout resolves the attribute before first paint;
 * an effect in the provider keeps the attribute in sync afterwards.
 * -------------------------------------------------------------------------- */

let themeCache: Theme | null = null;
const themeListeners = new Set<() => void>();

function emitTheme() {
  for (const listener of themeListeners) listener();
}

function readTheme(): Theme {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch {
    // Fall through to the media query.
  }
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getThemeSnapshot(): Theme {
  if (themeCache === null) themeCache = readTheme();
  return themeCache;
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function onThemeStorage(event: StorageEvent) {
  if (event.key !== THEME_KEY && event.key !== null) return;
  themeCache = null; // Re-read lazily; a Theme is a primitive, so stability is free.
  emitTheme();
}

function subscribeTheme(listener: () => void) {
  if (themeListeners.size === 0) {
    window.addEventListener("storage", onThemeStorage);
  }
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
    if (themeListeners.size === 0) {
      window.removeEventListener("storage", onThemeStorage);
    }
  };
}

function toggleTheme() {
  const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";
  themeCache = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // A theme that doesn't persist is still a theme.
  }
  emitTheme();
}

/* -------------------------------------------------------------------------- *
 * Hydration flag: false for the server render and the hydration render (the
 * server snapshot), true from the first post-hydration pass — the same pass
 * in which the storage snapshots above go live.
 * -------------------------------------------------------------------------- */

function subscribeNever() {
  return () => {};
}
function getHydratedSnapshot() {
  return true;
}
function getHydratedServerSnapshot() {
  return false;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    subscribeNever,
    getHydratedSnapshot,
    getHydratedServerSnapshot,
  );

  const [shield, setShield] = useState<Shield | null>(null);
  const [examLive, setExamLiveState] = useState(false);
  const [focusLost, setFocusLost] = useState(0);

  // Mirror the resolved theme onto the root element. The layout's inline
  // script covers the pre-hydration paint; this covers toggles and cross-tab
  // changes afterwards.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const showShield = useCallback((next: Shield) => setShield(next), []);
  const dismissShield = useCallback(() => setShield(null), []);

  const setExamLive = useCallback((live: boolean) => {
    setExamLiveState(live);
    if (live) setFocusLost(0);
  }, []);
  const resetFocusLost = useCallback(() => setFocusLost(0), []);

  // Proctoring. A browser cannot truly prevent a screen capture — what this
  // does is make it loud, counted, and visible on the result, which is what
  // real proctoring software does too. The ref mirrors examLive for the
  // listeners below; it is written in an effect, never during render.
  const examLiveRef = useRef(false);
  useEffect(() => {
    examLiveRef.current = examLive;
  }, [examLive]);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const macShot =
        event.metaKey &&
        event.shiftKey &&
        ["3", "4", "5", "s", "S"].includes(event.key);
      if (event.key === "PrintScreen" || macShot) {
        setShield({
          title: "Screenshot detected",
          message:
            "Math for a CS Degree is a proprietary course, © Mujtaba Hashimi, licensed to you personally. Screenshots of lessons and exams are watermarked to your session — sharing them is a violation of the licence.",
        });
      }
    };

    const onBlur = () => {
      if (!examLiveRef.current) return;
      setFocusLost((count) => {
        const next = count + 1;
        setShield({
          title: "Exam integrity",
          message: `You left the exam tab. Looking answers up — in a chatbot or anywhere else — only defeats you: the next track assumes you can do this without help. Tab switches are counted (${next} so far) and shown on your result.`,
        });
        return next;
      });
    };

    const onCopy = (event: ClipboardEvent) => {
      if (!examLiveRef.current) return;
      event.preventDefault();
      setShield({
        title: "Copy blocked during exams",
        message:
          "Exam questions cannot be copied out while the attempt is live. Pasting them into an AI tells you the answer today and fails you the exam that matters later.",
      });
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("copy", onCopy);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("copy", onCopy);
    };
  }, []);

  const value = useMemo<ProgressValue>(() => {
    const doneCount = Object.values(state.done).filter(Boolean).length;

    // Strict sequence: a track opens only once every track before it is passed.
    const unlocked: Record<string, boolean> = {};
    let gate = true;
    for (const trackId of TRACK_ORDER) {
      unlocked[trackId] = gate;
      if (!state.passed[trackId]) gate = false;
    }

    const allTracksPassed =
      TRACK_ORDER.length > 0 && TRACK_ORDER.every((id) => state.passed[id]);

    const examBlocked = (trackId: string) => {
      if (state.passed[trackId]) return false;
      if ((state.attempts[trackId] ?? 0) < STRIKE_LIMIT) return false;
      return (state.weak[trackId] ?? []).some((lesson) => !state.done[lesson.id]);
    };

    return {
      hydrated,
      ...state,
      doneCount,
      unlocked,
      graduated: Boolean(state.passed[FINAL_EXAM_ID]),
      allTracksPassed,
      toggleDone,
      markSeen,
      recordExam,
      examBlocked,
      addToQueue,
      clearFromQueue,
      resetProgress,
      theme,
      toggleTheme,
      shield,
      showShield,
      dismissShield,
      examLive,
      setExamLive,
      focusLost,
      resetFocusLost,
    };
  }, [
    state,
    hydrated,
    theme,
    shield,
    examLive,
    focusLost,
    showShield,
    dismissShield,
    setExamLive,
    resetFocusLost,
  ]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressValue {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used inside <ProgressProvider>");
  }
  return value;
}
