<h1 align="center">Math for a CS Degree</h1>

<p align="center">
  <em>Start at arithmetic. Finish at AI.</em>
</p>

<p align="center">
  <a href="https://github.com/mujtabahashimi/math-for-cs/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/mujtabahashimi/math-for-cs/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white">
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white">
  <a href="./LICENSE"><img alt="Apache 2.0" src="https://img.shields.io/badge/licence-Apache--2.0-blue"></a>
  <img alt="87 lessons" src="https://img.shields.io/badge/lessons-87-00c589">
</p>

<p align="center">
  <img src="./docs/screenshots/home.png" alt="The course overview: the mental model, the thirteen-track sequence with locked tracks dimmed, and the final examination" width="100%">
</p>

A gated, thirteen-track mathematics course that runs from arithmetic to the
mathematics a neural network actually executes — built as a production Next.js
application from the Claude Design prototype in [`design/`](./design).

The rule of the course is the product: **learn → drill → pass the exam → unlock
the next track**, and fail an exam three times and the flagged lessons are
un-marked for you to redo. You cannot skip ahead to calculus on a shaky
pre-algebra foundation, which is the failure mode the whole thing exists to
prevent.

| | |
| --- | --- |
| **87** lessons | **13** tracks, in strict order |
| **340** formulas | on one printable sheet |
| **174** quiz questions | **87** of them feeding the exams |
| **435** drills | plus **69** generators, so reps can't be memorised |
| **15** interactive figures | **3** step-through demos |
| **109** pages | prerendered at build time |

## What's inside

- **87 lessons across thirteen tracks**, each opening with a fun fact and the CS
  payoff, then an analogy, a derivation, formula cards, and — on the fourteen
  heaviest lessons — a fable that *is* the mechanism rather than decoration.
- **Practice in three modes**: a match game and procedurally generated drills
  (69 generators produce fresh numbers every round, so nothing can be
  memorised), 174 quiz questions that test recognition, and an AI-marked
  written answer that tests production.
- **Fifteen interactive visualisations** with live sliders — gradient descent
  diverging past η = 1, the discriminant changing a parabola's roots, entropy
  peaking at exactly one bit for a fair coin — plus three step-through demos.
- **Graded track exams** at a 70% pass mark, a comprehensive final at 80%, a
  three-strike remediation rule, and a printable certificate.
- **A persistent review queue** that keeps every missed question until you come
  back and get it right.
- **An AI tutor** that re-teaches any lesson in the way you learn, and an AI
  examiner that marks written answers against a rubric.

<p align="center">
  <img src="./docs/screenshots/lesson.png" alt="A lesson: the CS payoff, the fun fact and the analogy side by side, and the fable" width="100%">
  <br><em>A lesson opens with why a CS major needs it, then the fact, the analogy and — on the heaviest lessons — a fable that is the mechanism.</em>
</p>

<p align="center">
  <img src="./docs/screenshots/graph.png" alt="The growth-rate race: five curves on a single-hue sequential ramp, lightest for log n and darkest for 2^n" width="82%">
  <br><em>Multi-series figures step down one sequential ramp in magnitude order — ordered data, not a rainbow.</em>
</p>

<p align="center">
  <img src="./docs/screenshots/mobile.png" alt="A lesson on a 390px viewport" width="30%">
  &nbsp;&nbsp;
  <img src="./docs/screenshots/home-light.png" alt="The overview in the light theme" width="60%">
  <br><em>Mobile down to 360px, and a real light palette rather than an inverted filter.</em>
</p>

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

The AI tutor and the written-answer marking call the Anthropic API from route
handlers, so the key stays server-side:

```bash
cp .env.example .env.local
# then set ANTHROPIC_API_KEY
```

Without a key the rest of the course works unchanged — the two AI panels report
that they are not configured rather than failing.

```bash
npm run build          # production build
npm run start          # serve the build
npm run lint           # eslint
npx tsc --noEmit       # typecheck
```

## Deploying

The app is a stock Next.js 16 project, so Vercel needs no configuration beyond
one environment variable.

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository, and accept the
   detected Next.js settings.
3. Add `ANTHROPIC_API_KEY` under **Settings → Environment Variables** for
   Production, Preview and Development.
4. Deploy.

Everything except the two AI panels is statically prerendered — 87 lesson pages,
14 exams, the overview, the formula sheet and the certificate — so the only
server work at request time is `/api/tutor` and `/api/grade`. The build
deliberately does not require a key, so a deploy that is missing one still
succeeds and the two panels report themselves unconfigured.

## How it is put together

| Path | What lives there |
| --- | --- |
| `src/app` | Routes: overview, `lesson/[lessonId]`, `exam/[trackId]`, `formulas`, `certificate`, and the two API handlers |
| `src/components` | The shell (sidebar, drawer, proctoring overlay) and the view components |
| `src/lib/course.ts` | Server-safe accessors over the course content — lesson lookup, exam pools, the formula sheet, course statistics |
| `src/lib/progress.tsx` | All learner state: completion, exam passes, strikes, the review queue, theme, proctoring |
| `src/lib/graphs.ts` | The fifteen visualisation definitions |
| `src/lib/types.ts` | Domain types and the pass marks |
| `src/data` | Course content as data modules (`.js` with hand-written `.d.ts`), kept verbatim from the design bundle |
| `design/` | The original Claude Design handoff — prototype, chat transcripts, content sources |

Content is data, not markup: adding a lesson means adding an entry to
`src/data/course-data.js` (plus its depth, fact and optional drill generator),
and every count on the home page, the formula sheet and the exam pools follows
from it.

### Progress and gating

Learner state is client-side and persisted to `localStorage` under
`mfcs-progress-v1`. Track unlocking is derived rather than stored: a track is
open only when every track before it has a passing exam, so the gate cannot
drift out of sync with the passes that justify it.

### The design system

Two accents, and nothing decorative. **Mint** carries progress and anything the
learner acts on; **gold** carries assessment and licence; **red** is reserved for
a wrong answer and is never used as a fourth colour. Everything else is neutral
ink. No component names a hex value — they compose semantic tokens
(`bg-surface`, `text-ink-muted`, `border-line`, `text-accent`), so the palette is
changed in one file.

Dark is the designed default; light is a real palette rather than an inverted
filter. The choice persists and is resolved by an inline script before first
paint, so a stored light theme never flashes dark.

Element defaults live in `@layer base` deliberately: unlayered CSS outranks every
layered rule, so a bare `a { color: … }` would silently beat any text colour
utility on a link.

### Charts

The fifteen figures plot ordered quantities, so multi-series charts step down a
single-hue **sequential ramp** in magnitude order rather than taking a colour
each — the growth-rate race runs lightest for `log n` to darkest for `2ⁿ`. The
ramp is monotonic in lightness and holds 3:1 contrast against the chart surface
in both themes, and identity always comes from the legend and the readout line,
never from hue alone.

### A note on the proctoring

The exam view counts tab switches, blocks copying while an attempt is live, and
blurs the app behind a licence notice on a screenshot chord. A browser cannot
truly prevent a screen capture — a phone camera always works. What this does is
make it loud, counted, and visible on the result, which is what real proctoring
software does too.

## Contributing

Contributions are welcome — corrections to the mathematics most of all, since a
wrong explanation teaches someone the wrong thing.

- [**CONTRIBUTING.md**](./CONTRIBUTING.md) — project layout, the four checks CI
  runs, how to add a lesson or a visualisation, and the colour rules.
- [**CODE_OF_CONDUCT.md**](./CODE_OF_CONDUCT.md) — this is a project about
  learning things people were told they were bad at, so the tone is part of the
  work.
- [**SECURITY.md**](./SECURITY.md) — how to report a vulnerability, and what is
  deliberately out of scope (the proctoring is a deterrent, not a control).

Before opening a pull request:

```bash
npm run audit && npm run typecheck && npm run lint && npm run build
```

## Licence

The **application** is licensed under the [Apache License 2.0](./LICENSE).

The **course content** under `src/data` and the design bundle under `design/`
are © 2026 Mujtaba Hashimi · Fannos Academy, and the app describes itself in its
own interface as a proprietary course licensed to a single learner. See
[NOTICE](./NOTICE). If you fork this to build your own course, replace
`src/data` with your own content.

