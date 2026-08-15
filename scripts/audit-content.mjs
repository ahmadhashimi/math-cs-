#!/usr/bin/env node
/**
 * Content audit. The course is data, so the things that can break it are data
 * shaped: a lesson without a quiz, a multiple-choice answer index pointing past
 * its options, a thread referencing a lesson that was renamed, a track whose
 * exam pool is too thin to be worth sitting.
 *
 * Run with `npm run audit`. Exits non-zero on any error, so it works in CI.
 */

import { TRACKS, THREADS, TOTAL_LESSONS } from "../src/data/course-data.js";
import { DEPTH } from "../src/data/course-depth.js";
import { FACTS } from "../src/data/course-facts.js";
import { GEN, makeDrills } from "../src/data/course-gen.js";

const errors = [];
const warnings = [];

const seenLessonIds = new Set();
const seenTrackIds = new Set();

let formulas = 0;
let quizQuestions = 0;
let mcQuestions = 0;
let drills = 0;

for (const track of TRACKS) {
  if (seenTrackIds.has(track.id)) errors.push(`duplicate track id: ${track.id}`);
  seenTrackIds.add(track.id);

  if (!track.n) errors.push(`track ${track.id} has no name`);
  if (!track.sub) warnings.push(`track ${track.id} has no subtitle`);
  if (!track.lessons?.length) errors.push(`track ${track.id} has no lessons`);

  let trackMc = 0;

  for (const lesson of track.lessons) {
    const where = `${track.id}/${lesson.id}`;

    if (seenLessonIds.has(lesson.id)) errors.push(`duplicate lesson id: ${lesson.id}`);
    seenLessonIds.add(lesson.id);

    for (const field of ["title", "cs", "idea"]) {
      if (!lesson[field]) errors.push(`${where}: missing ${field}`);
    }

    if (!lesson.f?.length) errors.push(`${where}: no formulas`);
    for (const [i, formula] of (lesson.f ?? []).entries()) {
      if (!Array.isArray(formula) || formula.length < 3) {
        errors.push(`${where}: formula ${i} is not [label, expr, note]`);
      }
    }
    formulas += lesson.f?.length ?? 0;

    // A lesson with fewer than five formulas cannot fill the match game's
    // five pairs — it still plays, just shorter, so this is a warning.
    if ((lesson.f?.length ?? 0) < 2) {
      warnings.push(`${where}: only ${lesson.f?.length ?? 0} formula(s) — match game will be trivial`);
    }

    if (!lesson.q?.length) errors.push(`${where}: no quiz questions`);
    for (const [i, question] of (lesson.q ?? []).entries()) {
      quizQuestions += 1;
      if (question.t === "mc") {
        mcQuestions += 1;
        trackMc += 1;
        if (!Array.isArray(question.o) || question.o.length < 2) {
          errors.push(`${where}: quiz ${i} has fewer than two options`);
        } else if (
          typeof question.a !== "number" ||
          question.a < 0 ||
          question.a >= question.o.length
        ) {
          errors.push(`${where}: quiz ${i} answer index ${question.a} is out of range`);
        }
      } else if (question.t === "in") {
        if (typeof question.a !== "string" || !question.a) {
          errors.push(`${where}: quiz ${i} has no typed answer`);
        }
      } else {
        errors.push(`${where}: quiz ${i} has unknown type ${String(question.t)}`);
      }
      if (!question.e) warnings.push(`${where}: quiz ${i} has no explanation`);
    }

    const depth = DEPTH[lesson.id];
    if (!depth) {
      errors.push(`${where}: no depth entry (analogy, explanation, drills)`);
    } else {
      if (!depth.an) errors.push(`${where}: no analogy`);
      if (!depth.ex?.length) errors.push(`${where}: no explanation paragraphs`);
      if (!depth.d?.length) errors.push(`${where}: no drills`);
      drills += depth.d?.length ?? 0;
      for (const [i, drill] of (depth.d ?? []).entries()) {
        if (!Array.isArray(drill) || drill.length < 2 || drill[1] == null) {
          errors.push(`${where}: drill ${i} is not [question, answer]`);
        }
      }
    }

    if (!FACTS[lesson.id]) warnings.push(`${where}: no fun fact`);

    // Generators are the anti-memorisation mechanism; a generator that cannot
    // produce a full set silently falls back, so check it actually runs.
    if (GEN[lesson.id]) {
      const generated = makeDrills(lesson.id, 12345, depth?.d ?? [], 5);
      if (generated.length !== 5) {
        errors.push(`${where}: generator produced ${generated.length} drills, expected 5`);
      }
      for (const [i, drill] of generated.entries()) {
        if (!drill?.[0] || drill[1] == null || drill[1] === "") {
          errors.push(`${where}: generated drill ${i} has no question or answer`);
        }
      }
    }
  }

  // Every track exam draws only from multiple-choice questions.
  if (trackMc === 0) {
    errors.push(`track ${track.id}: exam pool is empty — no multiple-choice questions`);
  } else if (trackMc < 6) {
    warnings.push(`track ${track.id}: exam pool is only ${trackMc} questions`);
  }
}

for (const thread of THREADS) {
  for (const [lessonId] of thread.steps ?? []) {
    if (!seenLessonIds.has(lessonId)) {
      errors.push(`thread ${thread.id}: step points at unknown lesson "${lessonId}"`);
    }
  }
}

if (seenLessonIds.size !== TOTAL_LESSONS) {
  errors.push(
    `TOTAL_LESSONS is ${TOTAL_LESSONS} but ${seenLessonIds.size} lessons were found`,
  );
}

const summary = [
  `${TRACKS.length} tracks`,
  `${seenLessonIds.size} lessons`,
  `${formulas} formulas`,
  `${quizQuestions} quiz questions (${mcQuestions} multiple choice)`,
  `${drills} fixed drills`,
  `${Object.keys(GEN).length} drill generators`,
  `${THREADS.length} mental-model threads`,
].join(" · ");

console.log(summary);

for (const warning of warnings) console.warn(`warn  ${warning}`);
for (const error of errors) console.error(`error ${error}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nClean${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
