import { scoreAttempt, type SubmittedAnswer } from "@/lib/course";

export const runtime = "nodejs";

/**
 * Scoring an attempt.
 *
 * The exam page ships questions without their answer key, so this is the only
 * place that knows which option is right. That is the entire reason the route
 * exists: while scoring happened in the browser, the key had to travel with the
 * paper, and anyone could read the gate straight out of the page source.
 *
 * There is no session here, so this does not prove *who* sat the exam — only
 * that the paper submitted was a real sitting of it. Identity needs an account,
 * and the course does not have one yet.
 */

type ExamRequest = {
  trackId: string;
  answers: SubmittedAnswer[];
};

/** Returns the request, or null if the body is not the shape we require. */
function readBody(raw: unknown): ExamRequest | null {
  if (typeof raw !== "object" || raw === null) return null;
  const body = raw as Record<string, unknown>;

  if (typeof body.trackId !== "string" || body.trackId.trim() === "") return null;
  if (!Array.isArray(body.answers)) return null;

  const answers: SubmittedAnswer[] = [];
  for (const entry of body.answers) {
    if (typeof entry !== "object" || entry === null) return null;
    const { id, pick } = entry as Record<string, unknown>;
    if (typeof id !== "string" || id === "") return null;
    // A pick must be a real option index. Fractions and negatives are not
    // wrong answers, they are malformed ones, and they never match a key.
    if (typeof pick !== "number" || !Number.isInteger(pick) || pick < 0) {
      return null;
    }
    answers.push({ id, pick });
  }

  return { trackId: body.trackId, answers };
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Malformed request body." }, { status: 400 });
  }

  const body = readBody(raw);
  if (!body) {
    return Response.json(
      { error: "Malformed request: expected a trackId and a list of answers." },
      { status: 400 },
    );
  }

  const verdict = scoreAttempt(body.trackId, body.answers);
  if (!verdict) {
    // Refused rather than scored: an unknown exam, a question that is not in
    // it, a duplicate, or a paper of the wrong length. Scoring a short paper
    // would let three easy questions be submitted as a perfect attempt.
    return Response.json(
      { error: "That submission is not a complete sitting of this exam." },
      { status: 422 },
    );
  }

  return Response.json(verdict);
}
