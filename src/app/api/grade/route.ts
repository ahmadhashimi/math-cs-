import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

/** Below this an answer is a fragment, not a sentence, and there is nothing to mark. */
const MIN_ANSWER = 12;
const MAX_ANSWER = 4000;

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

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          "Marking is not configured on this deployment. Set ANTHROPIC_API_KEY to enable it.",
      },
      { status: 503 },
    );
  }

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

  const client = new Anthropic();

  let message;
  try {
    message = await client.messages.create({
      model: "claude-opus-5",
      // Thinking is on by default and shares this budget with the reply, so the
      // cap carries headroom for both: a truncated reply loses the FEEDBACK
      // line entirely, which reads as an unmarked answer.
      max_tokens: 1024,
      output_config: { effort: "low" },
      messages: [{ role: "user", content: prompt }],
    });
  } catch {
    return Response.json(
      { error: "Could not reach the marker just now. Try again in a moment." },
      { status: 502 },
    );
  }

  /*
   * A refusal returns a normal 200 with no usable content, so the stop reason is
   * checked before the blocks are read rather than after.
   */
  const text =
    message.stop_reason === "refusal"
      ? ""
      : message.content
          .map((block) => (block.type === "text" ? block.text : ""))
          .join("");

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
