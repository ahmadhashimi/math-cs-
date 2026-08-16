/**
 * The fifteen interactive figures. Each one is a pure description — ranges,
 * sliders, and functions of the slider values — so the panel that draws them
 * owns no maths and this module owns no DOM.
 */

import type { GraphKey } from "@/lib/types";

export type GraphSlider = {
  k: string;
  label: string;
  min: number;
  max: number;
  step: number;
  def: number;
};

/** A curve without `fn` is legend-only: its shape is drawn as dots instead. */
export type GraphCurve = {
  color: string;
  label: string;
  fn?: ((x: number) => number) | null;
};

export type GraphDot = {
  x: number;
  y: number;
  r?: number;
  fill?: string;
  stroke?: string;
};

/** Ranges may depend on the sliders, so either axis can be a function of them. */
export type GraphDef = {
  x: [number, number] | ((v: Record<string, number>) => [number, number]);
  y: [number, number] | ((v: Record<string, number>) => [number, number]);
  sliders: GraphSlider[];
  title: (v: Record<string, number>) => string;
  curves: (v: Record<string, number>) => GraphCurve[];
  dots?: (v: Record<string, number>) => GraphDot[];
  note: (v: Record<string, number>) => string;
};

/*
 * Figure colours. The subject of a figure is always the accent; a reference
 * curve drawn for scale is the neutral ghost; the point the sliders move is
 * gold, the one attention colour in the system.
 *
 * The multi-series figures (the growth-rate race, the sequence race) plot
 * ordered quantities, so their curves step down a single-hue sequential ramp
 * in growth order rather than taking a colour each. Identity comes from the
 * legend and the note line, never from hue alone.
 */
const G = "var(--accent)";
const YL = "var(--gold)";
const GH = "var(--ink-ghost)";
const S1 = "var(--series-1)";
const S2 = "var(--series-2)";
const S3 = "var(--series-3)";
const S4 = "var(--series-4)";
const S5 = "var(--series-5)";

/** 2ⁿ leaves the readable range fast, so big totals fall back to exponent form. */
const fmt = (n: number) =>
  n >= 1e6 ? n.toExponential(1) : Math.round(n).toLocaleString("en-US");

/** Binomial coefficient by the multiplicative rule — no factorial overflow. */
const choose = (n: number, k: number) => {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
};

/** Element copies a doubling array has paid for after `n` appends. */
const copiesAfter = (n: number) => {
  let copies = 0;
  let cap = 1;
  for (let i = 1; i <= n; i++) {
    if (i > cap) {
      copies += cap;
      cap *= 2;
    }
  }
  return copies;
};

const binaryEntropy = (p: number) =>
  -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));

/** θ after `steps` of gradient descent on L(θ) = θ², starting from −5. */
const descend = (lr: number, steps: number) => {
  let t = -5;
  for (let i = 0; i < steps; i++) t = t - lr * 2 * t;
  return t;
};

export const GRAPHS: Record<GraphKey, GraphDef> = {
  line: {
    x: [-10, 10],
    y: [-10, 10],
    sliders: [
      { k: "m", label: "slope m", min: -5, max: 5, step: 0.5, def: 1.5 },
      { k: "b", label: "intercept b", min: -8, max: 8, step: 1, def: 2 },
    ],
    title: (v) => `y = ${v.m}x + ${v.b}`,
    curves: (v) => [{ color: G, label: "the line", fn: (x) => v.m * x + v.b }],
    dots: (v) => [{ x: 0, y: v.b, fill: G, stroke: G }],
    note: (v) =>
      v.m === 0
        ? "slope 0 — flat: y never changes"
        : `slope ${v.m}: every step right moves y by ${v.m} — crosses the axis at (0, ${v.b})`,
  },

  parabola: {
    x: [-8, 8],
    y: [-12, 20],
    sliders: [
      { k: "a", label: "a", min: -2, max: 2, step: 0.5, def: 1 },
      { k: "b", label: "b", min: -6, max: 6, step: 1, def: -2 },
      { k: "c", label: "c", min: -8, max: 8, step: 1, def: -3 },
    ],
    title: (v) => `y = ${v.a}x² + ${v.b}x + ${v.c}`,
    curves: (v) => [
      { color: G, label: "the parabola", fn: (x) => v.a * x * x + v.b * x + v.c },
    ],
    dots: (v) => {
      if (!v.a) return [];
      const vx = -v.b / (2 * v.a);
      return [
        { x: vx, y: v.a * vx * vx + v.b * vx + v.c, fill: YL, stroke: YL, r: 5 },
      ];
    },
    note: (v) => {
      if (!v.a) return "a = 0: not a parabola any more — just a line";
      const d = v.b * v.b - 4 * v.a * v.c;
      return `Δ = b² − 4ac = ${d}: ${
        d > 0
          ? "two real roots — it crosses the axis twice"
          : d === 0
            ? "one root — it kisses the axis at the vertex"
            : "no real roots — it never touches the axis"
      }`;
    },
  },

  shift: {
    x: [-8, 8],
    y: [-8, 14],
    sliders: [
      { k: "h", label: "shift right h", min: -4, max: 4, step: 1, def: 2 },
      { k: "k", label: "shift up k", min: -6, max: 6, step: 1, def: 3 },
    ],
    title: (v) => `y = (x − ${v.h})² + ${v.k}`,
    curves: (v) => [
      { color: GH, label: "y = x² original", fn: (x) => x * x },
      { color: G, label: "shifted", fn: (x) => (x - v.h) * (x - v.h) + v.k },
    ],
    dots: (v) => [{ x: v.h, y: v.k, fill: G, stroke: G, r: 5 }],
    note: (v) =>
      `vertex moved to (${v.h}, ${v.k}) — the minus inside the bracket moves it right, the plus outside moves it up`,
  },

  exp: {
    x: [-2, 6],
    y: [-2, 42],
    sliders: [{ k: "b", label: "base b", min: 0.5, max: 3, step: 0.25, def: 2 }],
    title: (v) => `y = ${v.b}ˣ`,
    curves: (v) => [
      { color: GH, label: "y = x for scale", fn: (x) => x },
      { color: G, label: "exponential", fn: (x) => Math.pow(v.b, x) },
    ],
    note: (v) =>
      v.b > 1
        ? `every step right multiplies y by ${v.b} — no straight line can keep up for long`
        : v.b === 1
          ? "b = 1: constant — growth needs b > 1"
          : `b = ${v.b} < 1: decay — each step multiplies by less than one`,
  },

  sine: {
    x: [-6.5, 6.5],
    y: [-4.5, 4.5],
    sliders: [
      { k: "A", label: "amplitude A", min: 0.5, max: 4, step: 0.5, def: 2 },
      { k: "B", label: "frequency B", min: 0.5, max: 4, step: 0.5, def: 1 },
    ],
    title: (v) => `y = ${v.A} sin(${v.B}x)`,
    curves: (v) => [
      { color: G, label: "the wave", fn: (x) => v.A * Math.sin(v.B * x) },
    ],
    note: (v) =>
      `amplitude ${v.A}, period 2π/${v.B} ≈ ${((2 * Math.PI) / v.B).toFixed(2)} — B squeezes cycles in, A turns the volume up`,
  },

  seq: {
    x: [-0.5, 12],
    y: [0, 26],
    sliders: [
      { k: "r", label: "geometric ratio r", min: 0.5, max: 1.8, step: 0.1, def: 1.3 },
    ],
    title: (v) => `aₙ = 1 + 2n  vs  gₙ = ${v.r}ⁿ`,
    curves: (v) => [
      { color: S4, label: "arithmetic +2" },
      { color: G, label: "geometric ×" + v.r },
    ],
    dots: (v) => {
      const out: GraphDot[] = [];
      for (let n = 0; n <= 11; n++) {
        out.push({ x: n, y: 1 + 2 * n, fill: S4, stroke: S4 });
        out.push({ x: n, y: Math.pow(v.r, n), fill: G, stroke: G });
      }
      return out;
    },
    note: (v) =>
      v.r > 1
        ? `r = ${v.r} > 1: the geometric terms eventually overtake any arithmetic sequence — slide r up and watch`
        : v.r === 1
          ? "r = 1: the geometric sequence is constant"
          : `r = ${v.r} < 1: terms shrink toward 0 — the infinite series converges to ${(1 / (1 - v.r)).toFixed(2)}`,
  },

  limit: {
    x: [-1, 7],
    y: [0, 10],
    sliders: [
      { k: "x0", label: "x approaching 3", min: 0, max: 5.9, step: 0.1, def: 5 },
    ],
    title: () => "f(x) = (x² − 9)/(x − 3) near the hole at x = 3",
    curves: () => [
      {
        color: G,
        label: "f(x)",
        // The hole is the lesson: leave a gap rather than joining across it.
        fn: (x) => (Math.abs(x - 3) < 0.02 ? NaN : (x * x - 9) / (x - 3)),
      },
    ],
    dots: (v) => [
      { x: 3, y: 6, fill: "var(--inset)", stroke: G, r: 5 },
      { x: v.x0, y: v.x0 + 3, fill: YL, stroke: YL, r: 5 },
    ],
    note: (v) =>
      `f(${v.x0.toFixed(1)}) = ${(v.x0 + 3).toFixed(1)} — slide toward 3: the value approaches 6 even though f(3) itself is undefined`,
  },

  tangent: {
    x: [-4, 4],
    y: [-2, 16],
    sliders: [{ k: "x0", label: "point x₀", min: -3, max: 3, step: 0.5, def: 1 }],
    title: (v) => "y = x² and its tangent at x₀ = " + v.x0,
    curves: (v) => [
      { color: G, label: "y = x²", fn: (x) => x * x },
      {
        color: S4,
        label: "tangent, slope " + 2 * v.x0,
        fn: (x) => v.x0 * v.x0 + 2 * v.x0 * (x - v.x0),
      },
    ],
    dots: (v) => [{ x: v.x0, y: v.x0 * v.x0, fill: YL, stroke: YL, r: 5 }],
    note: (v) =>
      `slope = 2x₀ = ${2 * v.x0}: ${
        2 * v.x0 > 0
          ? "the curve is rising here"
          : 2 * v.x0 < 0
            ? "the curve is falling here"
            : "flat — a critical point, the minimum"
      }`,
  },

  relu: {
    x: [-6, 6],
    y: [-3, 7],
    sliders: [
      {
        k: "leak",
        label: "negative slope (leaky ReLU)",
        min: 0,
        max: 1,
        step: 0.1,
        def: 0,
      },
    ],
    title: (v) =>
      v.leak === 0 ? "ReLU: max(0, x)" : `Leaky ReLU: slope ${v.leak} below zero`,
    curves: (v) => [
      { color: GH, label: "y = x (linear)", fn: (x) => x },
      { color: G, label: "activation", fn: (x) => (x >= 0 ? x : v.leak * x) },
    ],
    dots: () => [{ x: 0, y: 0, fill: YL, stroke: YL, r: 5 }],
    note: (v) =>
      v.leak === 0
        ? "the kink at 0 is the whole point — stacking linear pieces only ever gives a line"
        : `slope ${v.leak} below zero keeps a gradient alive where plain ReLU would give exactly 0`,
  },

  descent: {
    x: [-6, 6],
    y: [-2, 34],
    sliders: [
      { k: "lr", label: "learning rate η", min: 0.05, max: 1.05, step: 0.05, def: 0.3 },
      { k: "steps", label: "steps taken", min: 0, max: 12, step: 1, def: 6 },
    ],
    title: (v) => `θ ← θ − ${v.lr.toFixed(2)}·∇L  on  L(θ) = θ²`,
    curves: () => [
      { color: GH, label: "loss surface θ²", fn: (x) => x * x },
      { color: G, label: "descent path" },
    ],
    dots: (v) => {
      const out: GraphDot[] = [];
      let t = -5;
      for (let i = 0; i <= v.steps; i++) {
        const last = i === v.steps;
        out.push({
          x: t,
          y: t * t,
          fill: last ? YL : G,
          stroke: last ? YL : G,
          r: last ? 5.5 : 3.5,
        });
        t = t - v.lr * 2 * t;
      }
      return out;
    },
    note: (v) => {
      const t = descend(v.lr, v.steps);
      const a = Math.abs(t);
      return v.lr >= 1
        ? `η = ${v.lr.toFixed(2)} ≥ 1: each step overshoots — |θ| = ${a.toFixed(2)} and growing. Diverged.`
        : a < 0.05
          ? `converged: θ ≈ ${t.toFixed(3)} after ${v.steps} steps`
          : `θ = ${t.toFixed(3)} after ${v.steps} steps — still descending`;
    },
  },

  entropy: {
    x: [0, 1],
    y: [0, 1.15],
    sliders: [
      { k: "p", label: "probability p of heads", min: 0.01, max: 0.99, step: 0.01, def: 0.5 },
    ],
    title: () => `H(p) = −p log₂p − (1−p) log₂(1−p)`,
    curves: () => [
      {
        color: G,
        label: "entropy in bits",
        fn: (p) => (p <= 0 || p >= 1 ? 0 : binaryEntropy(p)),
      },
    ],
    dots: (v) => [{ x: v.p, y: binaryEntropy(v.p), fill: YL, stroke: YL, r: 5 }],
    note: (v) =>
      `p = ${v.p.toFixed(2)} ⇒ ${binaryEntropy(v.p).toFixed(3)} bits. ${
        v.p > 0.47 && v.p < 0.53
          ? "A fair coin is maximally surprising: exactly 1 bit."
          : "A biased coin is more predictable, so it costs less than a bit to record."
      }`,
  },

  binomdist: {
    x: (v) => [0, v.n],
    y: [0, 0.42],
    sliders: [
      { k: "n", label: "trials n", min: 4, max: 24, step: 2, def: 10 },
      { k: "p", label: "success rate p", min: 0.05, max: 0.95, step: 0.05, def: 0.5 },
    ],
    title: (v) => `Binomial(n = ${v.n}, p = ${v.p.toFixed(2)})`,
    curves: () => [{ color: G, label: "P(k successes)" }],
    dots: (v) => {
      const out: GraphDot[] = [];
      for (let k = 0; k <= v.n; k++) {
        out.push({
          x: k,
          y: choose(v.n, k) * Math.pow(v.p, k) * Math.pow(1 - v.p, v.n - k),
          fill: G,
          stroke: G,
          r: 4,
        });
      }
      return out;
    },
    note: (v) =>
      `mean np = ${(v.n * v.p).toFixed(1)}, variance np(1−p) = ${(v.n * v.p * (1 - v.p)).toFixed(2)} — the peak sits at the mean and the spread is widest at p = 0.5`,
  },

  amort: {
    x: (v) => [1, v.n],
    y: (v) => [0, v.n * 2.2],
    sliders: [{ k: "n", label: "appends", min: 8, max: 128, step: 8, def: 64 }],
    title: () => `Total element copies after n appends (doubling array)`,
    curves: () => [
      { color: GH, label: "2n bound", fn: (x) => 2 * x },
      { color: G, label: "actual copies", fn: (x) => copiesAfter(x) },
    ],
    note: (v) => {
      const c = copiesAfter(v.n);
      return `${v.n} appends cost ${c} copies total — ${(c / v.n).toFixed(2)} per append, permanently under 2. That is amortised O(1).`;
    },
  },

  vector: {
    x: [-1, 10],
    y: [-1, 10],
    sliders: [
      { k: "x", label: "v.x", min: 0, max: 9, step: 1, def: 6 },
      { k: "y", label: "v.y", min: 0, max: 9, step: 1, def: 8 },
    ],
    title: (v) => `v = [${v.x}, ${v.y}]   ‖v‖ = √(${v.x}² + ${v.y}²)`,
    curves: () => [
      { color: G, label: "the vector", fn: null },
      { color: GH, label: "components" },
    ],
    // The arrow and its two legs are stippled out of dots: no line primitive needed.
    dots: (v) => {
      const out: GraphDot[] = [];
      const n = 26;
      for (let i = 0; i <= n; i++)
        out.push({ x: (v.x * i) / n, y: (v.y * i) / n, fill: G, stroke: G, r: 2.5 });
      for (let i = 0; i <= n; i++)
        out.push({ x: (v.x * i) / n, y: 0, fill: GH, stroke: GH, r: 1.5 });
      for (let i = 0; i <= n; i++)
        out.push({ x: v.x, y: (v.y * i) / n, fill: GH, stroke: GH, r: 1.5 });
      out.push({ x: v.x, y: v.y, fill: YL, stroke: YL, r: 6 });
      return out;
    },
    note: (v) =>
      `‖v‖ = √${v.x * v.x + v.y * v.y} = ${Math.sqrt(v.x * v.x + v.y * v.y).toFixed(3)} — Pythagoras, and the identical formula runs over 768 components in an embedding`,
  },

  growth: {
    x: (v) => [1, v.N],
    y: (v) => [0, v.N * v.N],
    sliders: [{ k: "N", label: "input size n", min: 8, max: 64, step: 8, def: 16 }],
    title: (v) => "Five algorithms race to n = " + v.N,
    // Five curves in growth order, so they step down the ramp in that order:
    // the lightest is the cheapest algorithm, the darkest the one that explodes.
    curves: () => [
      { color: S1, label: "log₂ n", fn: (x) => Math.log2(x) },
      { color: S2, label: "n", fn: (x) => x },
      { color: S3, label: "n log₂ n", fn: (x) => x * Math.log2(Math.max(x, 1)) },
      { color: S4, label: "n²", fn: (x) => x * x },
      { color: S5, label: "2ⁿ", fn: (x) => Math.pow(2, x) },
    ],
    note: (v) =>
      `at n = ${v.N}:  log n ≈ ${Math.round(Math.log2(v.N))} · n = ${v.N} · n log n ≈ ${Math.round(v.N * Math.log2(v.N))} · n² = ${v.N * v.N} · 2ⁿ ≈ ${fmt(Math.pow(2, v.N))}`,
  },

  /*
   * A power and its root, drawn together against y = x. They are mirror images
   * across that line and they meet at (1, 1), which is the whole reason a root
   * is called an inverse rather than merely a different operation — the picture
   * says it in a way the notation ⁿ√x actively hides.
   */
  powers: {
    x: [0, 4],
    y: [0, 8],
    sliders: [{ k: "n", label: "exponent n", min: 2, max: 5, step: 1, def: 2 }],
    title: (v) => `y = xⁿ and y = ⁿ√x, mirrored across y = x   (n = ${v.n})`,
    curves: (v) => [
      { color: GH, label: "y = x (the mirror)", fn: (x) => x },
      { color: G, label: `x^${v.n}`, fn: (x) => Math.pow(x, v.n) },
      { color: YL, label: `${v.n}-th root of x`, fn: (x) => Math.pow(x, 1 / v.n) },
    ],
    // Every power and every root passes through both of these, whatever n is.
    dots: () => [
      { x: 1, y: 1, fill: YL, stroke: YL, r: 5 },
      { x: 0, y: 0, fill: YL, stroke: YL, r: 4 },
    ],
    note: (v) =>
      `2^${v.n} = ${Math.pow(2, v.n)}, so the ${v.n}-th root of ${Math.pow(2, v.n)} is 2 — the same fact read in the other direction. Both curves cross at (1, 1) because 1 to any power is 1.`,
  },

  /*
   * Proportionality. A constant rate is a straight line through the origin, and
   * the two marked points say the thing the definition does not: double the
   * input and the output doubles with it.
   */
  rate: {
    x: [0, 10],
    y: [0, 30],
    sliders: [
      { k: "k", label: "rate k (y per unit of x)", min: 0.5, max: 3, step: 0.5, def: 2 },
    ],
    title: (v) => `y = ${v.k}x   —   ${v.k} of y for every 1 of x`,
    curves: (v) => [
      { color: GH, label: "y = x", fn: (x) => x },
      { color: G, label: `y = ${v.k}x`, fn: (x) => v.k * x },
    ],
    dots: (v) => [
      { x: 3, y: 3 * v.k, fill: YL, stroke: YL, r: 5 },
      { x: 6, y: 6 * v.k, fill: YL, stroke: YL, r: 5 },
    ],
    note: (v) =>
      `at x = 3, y = ${(3 * v.k).toFixed(1)};  at x = 6, y = ${(6 * v.k).toFixed(1)}. Twice the x, twice the y — and the line goes through (0, 0), which is what separates a proportion from any other straight line.`,
  },
};

/** The slider values a figure opens with. */
export function graphDefaults(def: GraphDef): Record<string, number> {
  const out: Record<string, number> = {};
  for (const slider of def.sliders) out[slider.k] = slider.def;
  return out;
}
