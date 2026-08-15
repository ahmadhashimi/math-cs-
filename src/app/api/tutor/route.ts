import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

/**
 * The tutor's voice, carried over from the design prototype unchanged. The word
 * limit is part of the pedagogy, not a cost control: a re-explanation the
 * learner will not read has failed regardless of how correct it is.
 */
const SYSTEM =
  "You are a mathematics tutor for a computer science degree. You are rigorous and never dumb the mathematics down, but you are plain-spoken. No preamble, no sign-off, no bullet-point padding, no emoji. Prose and worked lines only. Under 220 words.";

/** Free text reaches the model, so both fields are bounded before they get there. */
const MAX_QUESTION = 500;
const MAX_MODE = 400;

type TutorRequest = {
  lessonTitle: string;
  idea: string;
  cs: string;
  formulas: [label: string, expr: string][];
  analogy: string;
  /** The style instruction for a pill, or a marker label for a free question. */
  mode: string;
  question?: string;
};

function filled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Returns the request, or null if any field is missing or the wrong shape. */
function readBody(raw: unknown): TutorRequest | null {
  if (typeof raw !== "object" || raw === null) return null;
  const body = raw as Record<string, unknown>;

  if (
    !filled(body.lessonTitle) ||
    !filled(body.idea) ||
    !filled(body.cs) ||
    !filled(body.mode)
  ) {
    return null;
  }
  // A lesson may genuinely have no analogy, so empty is valid here — absent is not.
  if (typeof body.analogy !== "string") return null;
  if (!Array.isArray(body.formulas)) return null;

  const formulas: [string, string][] = [];
  for (const entry of body.formulas) {
    if (!Array.isArray(entry) || !filled(entry[0]) || !filled(entry[1])) {
      return null;
    }
    formulas.push([entry[0], entry[1]]);
  }

  if (body.question !== undefined && typeof body.question !== "string") {
    return null;
  }
  const question = filled(body.question)
    ? body.question.trim().slice(0, MAX_QUESTION)
    : undefined;

  return {
    lessonTitle: body.lessonTitle,
    idea: body.idea,
    cs: body.cs,
    formulas,
    analogy: body.analogy,
    mode: body.mode.slice(0, MAX_MODE),
    question,
  };
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const body = readBody(raw);
  if (!body) {
    return Response.json(
      { error: "Malformed request: a lesson context field is missing or the wrong type." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          "The tutor is not configured on this deployment. Set ANTHROPIC_API_KEY to enable it.",
      },
      { status: 503 },
    );
  }

  const context = [
    `Lesson: ${body.lessonTitle}`,
    `Core idea: ${body.idea}`,
    `Why CS needs it: ${body.cs}`,
    `Key formulas: ${body.formulas.map(([label, expr]) => `${label}: ${expr}`).join("; ")}`,
    `Existing analogy (do not repeat it): ${body.analogy.trim() || "none"}`,
  ].join("\n");

  const task = body.question
    ? `The learner asks: "${body.question}"\nAnswer it in the context of this lesson.`
    : body.mode;

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: "claude-opus-5",
    // Thinking is on by default on this model and max_tokens caps thinking plus
    // response text together, so the budget carries headroom for both: low
    // effort keeps the thinking short, and 2048 leaves a 220-word answer room
    // to finish rather than truncating mid-sentence.
    max_tokens: 2048,
    output_config: { effort: "low" },
    system: SYSTEM,
    messages: [{ role: "user", content: `${context}\n\n${task}` }],
  });

  const encoder = new TextEncoder();
  const textStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        /*
         * A failure part-way through has already put text on the learner's
         * screen. Closing the stream leaves that text in place, which reads
         * better than replacing a half-written explanation with an error.
         */
      } finally {
        controller.close();
      }
    },
    cancel() {
      // The learner navigated away or asked something else — stop paying for this one.
      stream.controller.abort();
    },
  });

  return new Response(textStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      // Proxies that buffer would defeat the point of streaming at all.
      "X-Accel-Buffering": "no",
    },
  });
}
