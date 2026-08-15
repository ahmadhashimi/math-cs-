## What this changes

<!-- One or two sentences. What is different for a learner after this merges? -->

## Why

<!-- The problem this solves. Link the issue if there is one. -->

## Checks

- [ ] `npm run audit` — course content is valid
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`

## If this touches the interface

- [ ] No raw hex colours in any `className` — semantic tokens only
- [ ] Checked in both themes
- [ ] Checked at 360px wide; nothing scrolls the page sideways
- [ ] Nothing derived from `Date.now()`, `Math.random()` or `localStorage`
      during render

## If this touches content

- [ ] The mathematics is right, and the explanation says *why* rather than
      restating the formula
- [ ] Quiz explanations name the specific mistake, not just the answer
- [ ] Any new drill generator produces a verified exact answer

## If this touches gating or exams

- [ ] A learner still cannot reach a track whose predecessor they have not
      passed — including via next/previous, the arrow keys, and direct URL entry
