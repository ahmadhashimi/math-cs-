import type { Drill } from "@/lib/types";

/** Procedural drill generators, keyed by lesson id. */
export declare const GEN: Record<string, ((rand: () => number) => Drill) | undefined>;

/** Deterministic RNG — a given seed always rebuilds the same set. */
export declare function rng(seed: number): () => number;

/**
 * Builds `count` drills for a lesson. Lessons with a generator get fresh
 * numbers per seed; the rest fall back to their fixed set.
 */
export declare function makeDrills(
  lessonId: string,
  seed: number,
  fallback: Drill[],
  count: number,
): Drill[];
