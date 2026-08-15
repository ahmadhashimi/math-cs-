# Math for a CS Degree

A gated, thirteen-track mathematics course that runs from arithmetic to the
mathematics a neural network actually executes — built as a production Next.js
application from the Claude Design prototype in [`design/`](./design).

The rule of the course is the product: **learn → drill → pass the exam → unlock
the next track**, and fail an exam three times and the flagged lessons are
un-marked for you to redo. You cannot skip ahead to calculus on a shaky
pre-algebra foundation, which is the failure mode the whole thing exists to
prevent.

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

## Licence

Proprietary course content © 2026 Mujtaba Hashimi · Fannos Academy.
