import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

/**
 * One place that knows which model provider is configured.
 *
 * The two AI routes ask for the same two things — stream some text, or return
 * some text — so the provider is a detail behind this shim rather than a
 * rewrite of both routes. Set ANTHROPIC_API_KEY or OPENAI_API_KEY; if both are
 * present, AI_PROVIDER decides, defaulting to Anthropic.
 *
 * Swapping providers changes the teaching voice, which is the part worth
 * watching. The prompts are tuned for plain-spoken prose under a word limit,
 * and a model that ignores that instruction makes the panels worse regardless
 * of how the benchmark reads.
 */

export type Provider = "anthropic" | "openai";

const ANTHROPIC_MODEL = "claude-opus-5";
/** Chosen for latency on a panel the learner is waiting in front of. */
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

/** The configured provider, or null when no key is set at all. */
export function provider(): Provider | null {
  const requested = process.env.AI_PROVIDER?.toLowerCase();
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (requested === "openai") return hasOpenAI ? "openai" : null;
  if (requested === "anthropic") return hasAnthropic ? "anthropic" : null;

  if (hasAnthropic) return "anthropic";
  if (hasOpenAI) return "openai";
  return null;
}

/** The 503 body both routes return when nothing is configured. */
export function notConfigured(what: string): Response {
  return Response.json(
    {
      error: `${what} is not configured on this deployment. Set ANTHROPIC_API_KEY or OPENAI_API_KEY to enable it.`,
    },
    { status: 503 },
  );
}

export type Ask = {
  system: string;
  user: string;
  maxTokens: number;
};

/**
 * Streams the answer as plain text deltas. Returns the iterable and an abort
 * handle, because the tutor stops paying for an answer the learner navigated
 * away from.
 */
export function streamText(ask: Ask): {
  deltas: AsyncIterable<string>;
  abort: () => void;
} {
  if (provider() === "openai") {
    const client = new OpenAI();
    const controller = new AbortController();
    const stream = client.chat.completions.create(
      {
        model: OPENAI_MODEL,
        max_tokens: ask.maxTokens,
        stream: true,
        messages: [
          { role: "system", content: ask.system },
          { role: "user", content: ask.user },
        ],
      },
      { signal: controller.signal },
    );

    async function* deltas() {
      for await (const chunk of await stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) yield text;
      }
    }

    return { deltas: deltas(), abort: () => controller.abort() };
  }

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: ANTHROPIC_MODEL,
    // Thinking is on by default on this model and max_tokens caps thinking plus
    // response text together, so the budget carries headroom for both.
    max_tokens: ask.maxTokens,
    output_config: { effort: "low" },
    system: ask.system,
    messages: [{ role: "user", content: ask.user }],
  });

  async function* deltas() {
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }

  return { deltas: deltas(), abort: () => stream.controller.abort() };
}

/**
 * One shot, whole answer. Returns "" when the model produced nothing usable —
 * including a refusal, which arrives as a normal success with no content and
 * would otherwise be parsed as an unmarked answer.
 */
export async function generateText(ask: Ask): Promise<string> {
  if (provider() === "openai") {
    const client = new OpenAI();
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      max_tokens: ask.maxTokens,
      messages: [
        { role: "system", content: ask.system },
        { role: "user", content: ask.user },
      ],
    });
    return completion.choices[0]?.message?.content ?? "";
  }

  const client = new Anthropic();
  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: ask.maxTokens,
    output_config: { effort: "low" },
    system: ask.system,
    messages: [{ role: "user", content: ask.user }],
  });

  if (message.stop_reason === "refusal") return "";
  return message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");
}
