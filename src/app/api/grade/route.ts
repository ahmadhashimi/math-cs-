import { generateText, notConfigured, provider } from "@/lib/ai";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Below this an answer is a fragment, not a sentence, and there is nothing to mark. */
const MIN_ANSWER = 12;
const MAX_ANSWER = 4000;

/** Marking is slower and rarer than asking, so the window is tighter. */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

type GradeRequest = {
  lessonTitle: string;
  idea: string;
  formulas: [label: string, expr: string][];
  answer: string;
};

type GradeResponse = {
  /** 0-5, or null when the model did not answer in the required format. */
  score: number | null;
  feedback: string;
};

function filled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (typeof raw !== "object" || raw === null) {
    return Response.json({ error: "Expected a JSON object." }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;

  if (!filled(body.lessonTitle) || !filled(body.idea)) {
    return Response.json(
      { error: "Malformed request: the lesson context is missing." },
      { status: 400 },
    );
  }
  if (!Array.isArray(body.formulas)) {
    return Response.json(
      { error: "Malformed request: formulas must be an array." },
      { status: 400 },
    );
  }

  const formulas: [string, string][] = [];
  for (const entry of body.formulas) {
    if (!Array.isArray(entry) || !filled(entry[0]) || !filled(entry[1])) {
      return Response.json(
        { error: "Malformed request: each formula must be [label, expression]." },
        { status: 400 },
      );
    }
    formulas.push([entry[0], entry[1]]);
  }

  if (typeof body.answer !== "string" || body.answer.trim().length < MIN_ANSWER) {
    return Response.json(
      { error: "Write at least a sentence before submitting for marking." },
      { status: 400 },
    );
  }

  const input: GradeRequest = {
    lessonTitle: body.lessonTitle,
    idea: body.idea,
    formulas,
    answer: body.answer.trim().slice(0, MAX_ANSWER),
  };

  // Checked before the model call, so a flood costs nothing.
  const limit = rateLimit(
    `grade:${clientKey(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.ok) return tooManyRequests(limit.retryAfter, "marking");

  if (!provider()) return notConfigured("Marking");

  const prompt = `You are marking a written answer in a computer science mathematics course. Be a fair but exacting examiner.

Lesson: ${input.lessonTitle}
Core idea: ${input.idea}
Key formulas: ${formulas.map(([label, expr]) => `${label}: ${expr}`).join("; ")}

Question asked: "${input.idea.replace(/\.$/, "")} — explain this in your own words and justify why it is true."

The learner wrote:
"""${input.answer}"""

Mark it out of 5. Award marks for correctness of the mathematics, for justification rather than restatement, and for using the right vocabulary. Do not award marks for length or confidence.

Reply in exactly this format and nothing else:
SCORE: <0-5>
FEEDBACK: <under 90 words. Name specifically what was right, then the single most important thing missing or wrong, then one concrete sentence they should have written.>`;

  let text: string;
  try {
    // A truncated reply loses the FEEDBACK line entirely, which reads as an
    // unmarked answer — so the cap carries headroom for a model that thinks
    // before it writes.
    text = await generateText({
      system: "You are a fair but exacting examiner.",
      user: prompt,
      maxTokens: 1024,
    });
  } catch {
    return Response.json(
      { error: "Could not reach the marker just now. Try again in a moment." },
      { status: 502 },
    );
  }

  const scored = /SCORE:\s*(\d)/.exec(text);
  const parsed = scored ? Number.parseInt(scored[1], 10) : null;
  const feedback = text.split(/FEEDBACK:\s*/)[1] ?? text;

  const result: GradeResponse = {
    // An out-of-range number means the format held but the mark did not — treat it as unmarked.
    score: parsed !== null && parsed >= 0 && parsed <= 5 ? parsed : null,
    feedback:
      feedback.trim() || "The marker returned nothing usable. Try again in a moment.",
  };

  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
