/** Answer checking and deterministic shuffling — shared by drills, quizzes and exams. */

/**
 * Normalises a typed answer so that "−7", "-7 " and "-7" all match. Case,
 * whitespace and thousands separators are ignored; the Unicode minus is folded
 * onto the ASCII hyphen.
 */
export function norm(value: string | number | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[\s,]/g, "")
    .replace(/−/g, "-");
}

/** True when `value` matches the canonical answer or any accepted alternate. */
export function answerMatches(
  value: string,
  answer: string,
  alternates: string[] = [],
): boolean {
  const typed = norm(value);
  if (!typed) return false;
  if (typed === norm(answer)) return true;
  return alternates.some((alt) => typed === norm(alt));
}

/**
 * A seeded Fisher–Yates permutation of [0, n). Seeded so a given attempt keeps
 * its order across re-renders, while a fresh attempt reshuffles.
 */
export function shuffle(n: number, seed: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** A seed derived from the clock, for anything that should differ per attempt. */
export function freshSeed(): number {
  return (Date.now() % 2147483647) || 7;
}
