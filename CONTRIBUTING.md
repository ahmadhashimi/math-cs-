# Contributing

Thanks for taking the time. This document covers how the project is laid out,
what "correct" means here, and what a good change looks like.

## Ground rules

- **Content is data, not markup.** A new lesson is an entry in
  `src/data/course-data.js` plus its depth, fact and (optionally) a drill
  generator. If you find yourself editing a component to add a lesson, stop —
  the component is wrong, not the data.
- **No component names a colour.** Every visual decision composes a semantic
  token (`bg-surface`, `text-ink-muted`, `border-line`, `text-accent`). A raw
  hex in a `className` will be rejected in review.
- **Two accents, and nothing decorative.** Mint carries progress and anything
  the learner acts on. Gold carries assessment and licence. Red is reserved for
  a wrong answer. There is no fourth colour — if a new surface seems to need
  one, it needs a different weight of an existing one instead.
- **The gate is the product.** Anything that lets a learner reach a track whose
  predecessor they have not passed is a bug, however convenient it feels.

## Getting set up

```bash
npm install
cp .env.example .env.local     # optional: only the two AI panels need a key
npm run dev
```

Node 22 or newer.

## Before you open a pull request

Run all four. CI runs exactly these, so a green local run is a green CI run.

```bash
npm run audit        # course content: answer indices, exam pools, thread targets
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # the full static build, 109 pages
```

`npm run audit` is the one people forget. It catches the class of bug that
never reaches a type error: a multiple-choice answer index pointing past its
options, a track whose exam pool is empty, a mental-model thread referencing a
lesson id that was renamed, a drill generator that cannot fill a set.

## Adding a lesson

1. Add the lesson object to the right track in `src/data/course-data.js`:
   `id`, `title`, `cs` (why a CS major needs it), `idea` (one sentence), `f`
   (formulas as `[label, expression, note]`), `q` (quiz questions). Optionally
   `code`, `graph` (a key from `src/lib/graphs.ts`) and `demo`.
2. Add its `an` (analogy), `ex` (explanation paragraphs) and `d` (drills) to
   `src/data/course-depth.js`. Add `fb` only if the fable genuinely *is* the
   mechanism — it is not decoration.
3. Add its fun fact to `src/data/course-facts.js`.
4. Optionally add a procedural drill generator to `src/data/course-gen.js` so
   the reps cannot be memorised. Generators must produce a verified exact
   answer — build the problem backwards from the answer rather than generating
   random numbers and hoping.
5. Run `npm run audit`.

Every count in the interface — the home page statistics, the formula sheet, the
exam pools, the sidebar — is derived, so there is nothing else to update.

## Adding a visualisation

Add a definition to `GRAPHS` in `src/lib/graphs.ts` and reference its key from
the lesson's `graph` field. Colour rules:

- One subject curve: the accent. A reference curve drawn for scale: the neutral
  ghost. The point the sliders move: gold.
- Two or more series that are **ordered** (a growth-rate race, a sequence
  comparison): step down `--series-1` … `--series-5` in magnitude order. This is
  a sequential ramp, not a set of categorical hues, and it is why the charts do
  not look like a rainbow.
- Identity must never rest on colour alone — the legend and the readout line
  carry it.

## Style

Match the surrounding code. Specifically:

- Comments explain **why**, never what the next line does. If a comment restates
  the code, delete it.
- Server Components by default; `"use client"` only where state, effects or
  handlers genuinely require it.
- Anything derived from `Date.now()`, `Math.random()` or `localStorage` during
  render is a hydration bug. Put it in an effect, or gate it on the store's
  `hydrated` flag.
- Mobile first. Nothing may cause horizontal page scroll at 360px; wide content
  scrolls inside its own container.

## Reporting a content error

Mathematical errors matter more than bugs here — a wrong explanation teaches
someone the wrong thing. Open a **Content error** issue with the lesson id, what
it currently says, and what it should say.
