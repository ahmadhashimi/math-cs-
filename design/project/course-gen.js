// Procedural drill generators. Each returns [question, answer, alternates?] from a seeded RNG,
// so a learner never sees the same numbers twice and cannot memorise the answer key.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pick = (r, xs) => xs[Math.floor(r() * xs.length)];
const nz = (r, a, b) => { let v = 0; while (v === 0) v = int(r, a, b); return v; };
const frac = (n, d) => { const g = (a, b) => b ? g(b, a % b) : a; const k = g(Math.abs(n), Math.abs(d)) || 1; const N = n / k, D = d / k; return D === 1 ? String(N) : N + '/' + D; };

export const GEN = {

signed: r => { const m = int(r, 1, 4);
  if (m === 0) { const a = int(r, -20, -1), b = int(r, 1, 25); return [`${a} + ${b}`, String(a + b)]; }
  if (m === 1) { const a = int(r, -15, 15), b = int(r, -15, -1); return [`${a} \u2212 (${b})`, String(a - b)]; }
  if (m === 2) { const a = nz(r, -12, -2), b = nz(r, -12, -2); return [`(${a})(${b})`, String(a * b)]; }
  if (m === 3) { const a = int(r, -30, -5), b = int(r, 1, 15); return [`|${a}| \u2212 ${b}`, String(Math.abs(a) - b)]; }
  const b = nz(r, -9, -2), q = nz(r, -9, 9); return [`${b * q} \u00f7 ${b}`, String(q)]; },

'order-ops': r => { const m = int(r, 0, 3);
  if (m === 0) { const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9); return [`${a} + ${b} \u00d7 ${c}`, String(a + b * c)]; }
  if (m === 1) { const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 6); return [`(${a} + ${b}) \u00d7 ${c}`, String((a + b) * c)]; }
  if (m === 2) { const b = int(r, 2, 5), a = b * int(r, 2, 8), c = int(r, 2, 5); return [`${a} \u00f7 ${b} \u00d7 ${c}`, String(a / b * c)]; }
  const a = int(r, 2, 9), b = int(r, 2, 5), c = int(r, 2, 4); return [`${a} + ${b}\u00b2 \u00d7 ${c}`, String(a + b * b * c)]; },

fractions: r => { const m = int(r, 0, 3), b = int(r, 2, 8), d = int(r, 2, 9), a = int(r, 1, b - 1 || 1), c = int(r, 1, d - 1 || 1);
  if (m === 0) return [`${a}/${b} + ${c}/${d} (lowest terms)`, frac(a * d + c * b, b * d)];
  if (m === 1) return [`(${a}/${b}) \u00d7 (${c}/${d})`, frac(a * c, b * d)];
  if (m === 2) return [`(${a}/${b}) \u00f7 (${c}/${d})`, frac(a * d, b * c)];
  const k = int(r, 2, 6); return [`Reduce ${a * k}/${b * k}`, frac(a, b)]; },

exponents: r => { const m = int(r, 0, 3);
  if (m === 0) { const b = pick(r, [2, 3, 5]), e = int(r, 2, b === 2 ? 10 : 4); return [`${b}^${e}`, String(Math.pow(b, e))]; }
  if (m === 1) { const b = int(r, 2, 4), x = int(r, 1, 3), y = int(r, 1, 3); return [`${b}^${x} \u00b7 ${b}^${y}`, String(Math.pow(b, x + y))]; }
  if (m === 2) { const n = pick(r, [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]); return [`\u221a${n}`, String(Math.sqrt(n))]; }
  const e = int(r, 1, 4); return [`2^\u2212${e} as a fraction`, '1/' + Math.pow(2, e)]; },

factors: r => { const m = int(r, 0, 2), a = int(r, 2, 20), b = int(r, 2, 20);
  const g = (x, y) => y ? g(y, x % y) : x;
  if (m === 0) return [`gcd(${a * 2}, ${b * 2})`, String(g(a * 2, b * 2))];
  if (m === 1) return [`lcm(${a}, ${b})`, String(a * b / g(a, b))];
  const n = int(r, 10, 60); return [`Is ${n * 3} divisible by 3? 1 yes 0 no`, '1']; },

decimals: r => { const m = int(r, 0, 2), p = pick(r, [5, 10, 15, 20, 25, 40, 50, 75]), n = int(r, 2, 20) * 20;
  if (m === 0) return [`${p}% of ${n}`, String(+(n * p / 100).toFixed(2))];
  if (m === 1) { const old = int(r, 2, 10) * 50, dec = pick(r, [10, 20, 25, 50]); return [`${old} \u2192 ${old * (100 - dec) / 100}: % decrease`, String(dec)]; }
  const d = int(r, 1, 9); return [`0.${d} as a percent`, String(d * 10)]; },

ratios: r => { const m = int(r, 0, 2), rate = int(r, 5, 60), t = int(r, 2, 12);
  if (m === 0) return [`${rate * t} in ${t} seconds: rate per second`, String(rate)];
  if (m === 1) { const s1 = int(r, 2, 5), per = int(r, 50, 400), s2 = int(r, 2, 9); return [`${s1} servers \u2192 ${s1 * per} users. ${s2} servers?`, String(s2 * per)]; }
  const a = int(r, 2, 9), b = int(r, 2, 9), k = int(r, 2, 6); return [`Solve ${a}/${b} = x/${b * k}`, String(a * k)]; },

expressions: r => { const m = int(r, 0, 2), a = int(r, 2, 9), b = int(r, 2, 9), x = int(r, 2, 8);
  if (m === 0) return [`Simplify ${a}x + ${b}x`, (a + b) + 'x'];
  if (m === 1) return [`Evaluate ${a}x + ${b} at x = ${x}`, String(a * x + b)];
  return [`Evaluate x\u00b2 \u2212 ${b} at x = ${x}`, String(x * x - b)]; },

inequalities: r => { const m = int(r, 0, 2), a = int(r, 2, 9), b = int(r, 2, 30);
  if (m === 0) { const lo = int(r, 0, 5), hi = lo + int(r, 3, 12); return [`Integers with ${lo} \u2264 x < ${hi}`, String(hi - lo)]; }
  if (m === 1) return [`Solve ${a}x \u2265 ${a * b} (boundary)`, String(b)];
  return [`Solve x + ${a} < ${a + b} (boundary)`, String(b)]; },

coordinates: r => { const t = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);
  return int(r, 0, 1) ? [`Distance from (0,0) to (${t[0]}, ${t[1]})`, String(t[2])]
    : [`Midpoint x of (0,0) and (${t[0] * 2}, 0)`, String(t[0])]; },

'word-problems': r => { const fix = int(r, 10, 60), rate = int(r, 2, 9), n = int(r, 3, 20);
  return int(r, 0, 1) ? [`$${fix} + $${rate} per user = $${fix + rate * n}. Users?`, String(n)]
    : [`${rate} times a number is ${rate * n}. The number`, String(n)]; },

linear: r => { const m = int(r, 0, 2), a = int(r, 2, 9), b = int(r, 2, 20), x = int(r, 2, 12);
  if (m === 0) return [`Solve ${a}x + ${b} = ${a * x + b}`, String(x)];
  if (m === 1) { const x1 = int(r, 0, 5), y1 = int(r, 0, 9), s = int(r, 1, 6), d = int(r, 1, 4); return [`Slope through (${x1},${y1}) and (${x1 + d},${y1 + s * d})`, String(s)]; }
  return [`Solve x/${a} = ${x}`, String(a * x)]; },

quadratics: r => { const p = int(r, 1, 9), q = int(r, 1, 9), m = int(r, 0, 2);
  if (m === 0) return [`Larger root of x\u00b2 \u2212 ${p + q}x + ${p * q}`, String(Math.max(p, q))];
  if (m === 1) { const k = pick(r, [4, 9, 16, 25, 36, 49, 64, 81]); return [`Solve x\u00b2 = ${k} (positive root)`, String(Math.sqrt(k))]; }
  const b = int(r, 2, 12) * 2, a = 1; return [`Vertex x of y = x\u00b2 \u2212 ${b}x + 1`, String(b / 2)]; },

systems: r => { const x = int(r, 1, 12), y = int(r, 1, 12);
  return int(r, 0, 1) ? [`x + y = ${x + y}, x \u2212 y = ${x - y}. Find x`, String(x)]
    : [`${2}x = ${2 * x}, y = x + ${y}. Find y`, String(x + y)]; },

functions: r => { const a = int(r, 2, 6), b = int(r, 1, 9), x = int(r, 2, 9);
  return int(r, 0, 1) ? [`f(x) = ${a}x + ${b}. f(${x})`, String(a * x + b)]
    : [`f(x) = ${a}x + ${b}. f\u207b\u00b9(${a * x + b})`, String(x)]; },

polynomials: r => { const a = int(r, 2, 12), m = int(r, 0, 2);
  if (m === 0) return [`Factor x\u00b2 \u2212 ${a * a}: roots are \u00b1 what`, String(a)];
  if (m === 1) { const p = int(r, 1, 9), q = int(r, 1, 9); return [`Two numbers: sum ${p + q}, product ${p * q}. Larger`, String(Math.max(p, q))]; }
  const d = int(r, 3, 9); return [`Horner multiplies for degree ${d}`, String(d)]; },

rational: r => { const a = int(r, 2, 12), b = int(r, 2, 9);
  return int(r, 0, 1) ? [`Undefined x for (x+${b})/(x\u2212${a})`, String(a)]
    : [`Horizontal asymptote of (${b}x\u00b2+1)/(x\u00b2+3)`, String(b)]; },

'right-triangles': r => { const t = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [20, 21, 29]]);
  return int(r, 0, 1) ? [`Legs ${t[0]} and ${t[1]}. Hypotenuse`, String(t[2])]
    : [`Vector (${t[0]}, ${t[1]}). Length`, String(t[2])]; },

'law-sines': r => { const t = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]);
  return int(r, 0, 1) ? [`c\u00b2 = a\u00b2+b\u00b2\u22122ab cos C at C=90\u00b0, a=${t[0]}, b=${t[1]}. c`, String(t[2])]
    : [`Area \u00bd ab sin C: a=${t[0]}, b=${t[1]}, sin C=1`, String(t[0] * t[1] / 2)]; },

exponential: r => { const b = pick(r, [2, 3]), n = int(r, 2, b === 2 ? 12 : 5), start = int(r, 1, 9) * 100;
  return int(r, 0, 1) ? [`${b}^${n}`, String(Math.pow(b, n))]
    : [`Start ${start}, doubles ${int(r, 1, 4)} times`, null]; },

logarithms: r => { const b = pick(r, [2, 2, 2, 10]), e = int(r, 1, b === 2 ? 16 : 4);
  return [`log${b === 2 ? '\u2082' : '\u2081\u2080'}(${Math.pow(b, e)})`, String(e)]; },

sequences: r => { const n = int(r, 5, 60);
  return int(r, 0, 1) ? [`1 + 2 + \u22ef + ${n}`, String(n * (n + 1) / 2)]
    : [`${int(r, 2, 5)}th term of ${1}, ${1 + 4}, ${1 + 8}, \u2026`, null]; },

binomial: r => { const n = int(r, 4, 8), k = int(r, 1, n - 1);
  const C = (n, k) => { let v = 1; for (let i = 0; i < k; i++) v = v * (n - i) / (i + 1); return Math.round(v); };
  return int(r, 0, 1) ? [`C(${n},${k})`, String(C(n, k))] : [`Row sum of Pascal row n = ${n}`, String(Math.pow(2, n))]; },

piecewise: r => { const a = int(r, 1, 20), m = int(r, 0, 2);
  if (m === 0) return [`|\u2212${a}|`, String(a)];
  if (m === 1) return [`ReLU(\u2212${a})`, '0'];
  return [`ReLU(${a})`, String(a)]; },

limits: r => { const a = int(r, 2, 9), c = int(r, 2, 9);
  return int(r, 0, 1) ? [`lim x\u2192${a} of (x\u00b2 \u2212 ${a * a})/(x \u2212 ${a})`, String(2 * a)]
    : [`lim x\u2192\u221e of (${c}x\u00b2)/(x\u00b2)`, String(c)]; },

derivatives: r => { const a = int(r, 2, 9), n = int(r, 2, 5), x = int(r, 1, 4);
  return int(r, 0, 1) ? [`d/dx of ${a}x^${n} at x = 1`, String(a * n)]
    : [`d/dx of x\u00b2 + ${a}x at x = ${x}`, String(2 * x + a)]; },

'chain-rule': r => { const a = int(r, 2, 9);
  return int(r, 0, 1) ? [`d/dx sin(${a}x): coefficient of cos(${a}x)`, String(a)]
    : [`d/dx e^(${a}x): coefficient`, String(a)]; },

optimization: r => { const b = int(r, 1, 12) * 2, p = int(r, 2, 15) * 4;
  return int(r, 0, 1) ? [`Minimum x of y = x\u00b2 \u2212 ${b}x`, String(b / 2)]
    : [`Fixed perimeter ${p}. Optimal width`, String(p / 4)]; },

'product-quotient': r => { const a = int(r, 2, 5), b = int(r, 2, 5);
  return [`f=x^${a}, g=x^${b}: f\u2032g + fg\u2032 at x=1`, String(a + b)]; },

integrals: r => { const b = int(r, 2, 6), k = int(r, 2, 5);
  return int(r, 0, 1) ? [`\u222b\u2080^${b} ${k}x dx`, String(k * b * b / 2)]
    : [`\u222b\u2080^${b} ${k} dx`, String(k * b)]; },

applications: r => { const k = int(r, 2, 9), b = int(r, 2, 8);
  return [`Average of f(t)=${k}t on [0,${b}]`, String(k * b / 2)]; },

improper: r => { const p = int(r, 2, 4);
  return [`\u222b\u2081\u221e 1/x^${p} dx as a fraction`, p === 2 ? '1' : frac(1, p - 1)]; },

series: r => { const d = pick(r, [2, 3, 4, 5, 10]);
  return [`Sum of \u03a3(1/${d})\u207f from n=0`, frac(d, d - 1)]; },

sets: r => { const n = int(r, 3, 10), A = int(r, 5, 30), B = int(r, 5, 30), I = int(r, 0, 5);
  return int(r, 0, 1) ? [`Subsets of a ${n}-element set`, String(Math.pow(2, n))]
    : [`|A|=${A}, |B|=${B}, |A\u2229B|=${I}. |A\u222aB|`, String(A + B - I)]; },

induction: r => { const n = int(r, 10, 100); return [`1 + 2 + \u22ef + ${n}`, String(n * (n + 1) / 2)]; },

recurrence: r => { const n = int(r, 3, 12);
  return int(r, 0, 1) ? [`Hanoi H\u2099 = 2\u207f \u2212 1 at n = ${n}`, String(Math.pow(2, n) - 1)]
    : [(() => { let a = 1, b = 1; for (let i = 2; i < n; i++) { const t = a + b; a = b; b = t; } return `Fibonacci F${n} with F\u2081=F\u2082=1`; })(), (() => { let a = 1, b = 1; for (let i = 2; i < n; i++) { const t = a + b; a = b; b = t; } return String(b); })()]; },

counting: r => { const d = int(r, 2, 6), opts = pick(r, [2, 6, 10, 26]);
  return [`${d} positions, ${opts} options each: total`, String(Math.pow(opts, d))]; },

permutations: r => { const n = int(r, 4, 10), k = int(r, 2, 3);
  const C = (n, k) => { let v = 1; for (let i = 0; i < k; i++) v = v * (n - i) / (i + 1); return Math.round(v); };
  const P = (n, k) => { let v = 1; for (let i = 0; i < k; i++) v *= (n - i); return v; };
  return int(r, 0, 1) ? [`C(${n},${k})`, String(C(n, k))] : [`P(${n},${k})`, String(P(n, k))]; },

'advanced-counting': r => { const k = int(r, 5, 30), boxes = int(r, 2, 9);
  return [`${k * boxes + 1} items, ${boxes} boxes: some box has at least`, String(k + 1)]; },

'expected-value': r => { const pay = int(r, 2, 20) * 5, p = pick(r, [0.1, 0.2, 0.25, 0.5]);
  return [`Pays ${pay} with p=${p}, else 0. E`, String(+(pay * p).toFixed(2))]; },

conditional: r => { const b = pick(r, [0.2, 0.4, 0.5, 0.8]), j = +(b * pick(r, [0.25, 0.5, 0.75])).toFixed(3);
  return [`P(A\u2229B)=${j}, P(B)=${b}. P(A|B)`, String(+(j / b).toFixed(2))]; },

distributions: r => { const n = int(r, 1, 20) * 50, p = pick(r, [0.01, 0.02, 0.1, 0.5]);
  return [`Mean of binomial n=${n}, p=${p}`, String(+(n * p).toFixed(2))]; },

representation: r => { const v = int(r, 3, 12), e = int(r, 3, 30);
  return int(r, 0, 1) ? [`Max edges, ${v} vertices, undirected`, String(v * (v - 1) / 2)]
    : [`Degree sum with ${e} edges`, String(2 * e)]; },

paths: r => { const v = int(r, 5, 60), e = int(r, 5, 200); return [`BFS cost with V=${v}, E=${e} as V+E`, String(v + e)]; },

trees: r => { const v = int(r, 5, 40), h = int(r, 2, 6);
  return int(r, 0, 1) ? [`Edges in a tree with ${v} vertices`, String(v - 1)]
    : [`Nodes in a perfect binary tree of height ${h}`, String(Math.pow(2, h + 1) - 1)]; },

dags: r => { const v = int(r, 5, 20), e = int(r, 5, 30); return [`Kahn\u2019s cost with V=${v}, E=${e} as V+E`, String(v + e)]; },

modular: r => { const n = int(r, 3, 12), q = int(r, 1, 9), rem = int(r, 0, n - 1);
  return [`${q * n + rem} mod ${n}`, String(rem)]; },

gcd: r => { const g = int(r, 2, 12), a = g * int(r, 2, 9), b = g * int(r, 2, 9);
  const gg = (x, y) => y ? gg(y, x % y) : x;
  return int(r, 0, 1) ? [`gcd(${a}, ${b})`, String(gg(a, b))] : [`lcm(${a}, ${b})`, String(a * b / gg(a, b))]; },

primes: r => { const p = pick(r, [7, 11, 13, 17, 19, 23, 29, 31, 37]);
  return [`Largest divisor to test for n = ${p * p}`, String(p)]; },

'mod-inverse': r => { const p = pick(r, [5, 7, 11, 13]), a = int(r, 2, p - 1);
  let inv = 1; for (let i = 1; i < p; i++) if ((a * i) % p === 1) inv = i;
  return [`Inverse of ${a} mod ${p}`, String(inv)]; },

'fermat-euler': r => { const p = pick(r, [5, 7, 11, 13]), a = int(r, 2, p - 1);
  return [`${a}^${p - 1} mod ${p} (Fermat)`, '1']; },

rsa: r => { const n = pick(r, [5, 7, 11, 13]), a = int(r, 2, n - 1), e = int(r, 2, 4);
  return [`${a}^${e} mod ${n}`, String(Math.pow(a, e) % n)]; },

bigo: r => { const n = pick(r, [8, 16, 32, 64, 128, 256, 1024]);
  return int(r, 0, 1) ? [`log\u2082(${n})`, String(Math.log2(n))] : [`n log\u2082 n at n = ${n}`, String(n * Math.log2(n))]; },

loops: r => { const n = int(r, 4, 20);
  return int(r, 0, 1) ? [`Nested n\u00d7n iterations at n = ${n}`, String(n * n)] : [`\u03a3 i for i = 1..${n}`, String(n * (n + 1) / 2)]; },

recurrences: r => { const n = pick(r, [8, 16, 32, 64, 128, 256, 512, 1024]);
  return int(r, 0, 1) ? [`Levels for n = ${n}, halving`, String(Math.log2(n))] : [`Binary search comparisons, n = ${n}`, String(Math.log2(n))]; },

amortized: r => { const n = pick(r, [8, 16, 32, 64, 128]);
  return [`Copies growing 1\u21922\u2192\u22ef\u2192${n}`, String(n - 1)]; },

develop: r => { const n = int(r, 5, 50);
  return [`Pairs among ${n} items`, String(n * (n - 1) / 2)]; },

'binary-search': r => { const n = pick(r, [16, 32, 64, 128, 256, 512, 1024, 4096, 65536, 1048576]);
  return [`Worst-case comparisons for n = ${n.toLocaleString('en-US')}`, String(Math.log2(n))]; },

sorting: r => { const n = pick(r, [8, 16, 32, 64, 128, 256]);
  return int(r, 0, 1) ? [`Levels in merge sort, n = ${n}`, String(Math.log2(n))] : [`n log\u2082 n at n = ${n}`, String(n * Math.log2(n))]; },

hashing: r => { const m = pick(r, [8, 16, 32, 64]), n = Math.round(m * pick(r, [0.25, 0.5, 0.75]));
  return [`Load factor: ${n} entries, ${m} buckets`, String(n / m)]; },

'graph-algos': r => { const v = int(r, 10, 100), e = int(r, 10, 400); return [`BFS cost with V=${v}, E=${e}`, String(v + e)]; },

dp: r => { const s = int(r, 10, 200), w = int(r, 2, 9); return [`DP cost: ${s} states \u00d7 ${w} work`, String(s * w)]; },

greedy: r => { const amt = pick(r, [30, 40, 55, 65, 80, 99, 15, 45]);
  let left = amt, c = 0; [25, 10, 5, 1].forEach(k => { while (left >= k) { left -= k; c++; } });
  return [`Coins {1,5,10,25}: fewest for ${amt}`, String(c)]; },

vectors: r => { const t = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
  return [`Magnitude of [${t[0]}, ${t[1]}]`, String(t[2])]; },

dotproduct: r => { const a = int(r, 1, 9), b = int(r, 1, 9), c = int(r, 1, 9), d = int(r, 1, 9);
  return [`[${a},${b}] \u00b7 [${c},${d}]`, String(a * c + b * d)]; },

matrices: r => { const m = int(r, 2, 9), n = int(r, 2, 9), p = int(r, 2, 9);
  return int(r, 0, 1) ? [`(${m}\u00d7${n})(${n}\u00d7${p}): result rows`, String(m)]
    : [`Weights mapping ${n * 32} \u2192 ${m * 8}`, String(n * 32 * m * 8)]; },

'gradient-descent': r => { const th = int(r, 2, 20), g = int(r, 1, 9), lr = pick(r, [0.1, 0.25, 0.5, 1]);
  return [`\u03b8=${th}, grad=${g}, \u03b7=${lr}. New \u03b8`, String(+(th - lr * g).toFixed(2))]; },

bayes: r => { const pa = pick(r, [0.2, 0.25, 0.4, 0.5]), pba = pick(r, [0.4, 0.5, 0.8]), pb = +(pa * pba / pick(r, [0.25, 0.5, 1])).toFixed(3);
  return [`P(B|A)=${pba}, P(A)=${pa}, P(B)=${pb}. P(A|B)`, String(+(pba * pa / pb).toFixed(2))]; },

entropy: r => { const n = pick(r, [2, 4, 8, 16, 32, 64]);
  return [`Max entropy over ${n} equally likely outcomes, in bits`, String(Math.log2(n))]; },

};

// Deterministic RNG so a given seed always rebuilds the same set (stable across re-renders).
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function makeDrills(lessonId, seed, fallback, count) {
  const gen = GEN[lessonId];
  if (!gen) return fallback || [];
  const r = rng(seed);
  const out = [], seen = {};
  let guard = 0;
  while (out.length < (count || 5) && guard++ < 60) {
    const item = gen(r);
    if (!item || item[1] == null) continue;
    const key = String(item[0]);
    if (seen[key]) continue;
    seen[key] = 1;
    out.push(item);
  }
  while (out.length < (count || 5) && fallback && fallback.length) out.push(fallback[out.length % fallback.length]);
  return out;
}
