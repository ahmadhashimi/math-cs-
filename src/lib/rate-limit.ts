/**
 * A fixed-window rate limiter for the two routes that spend money.
 *
 * Both AI routes are unauthenticated POSTs that call a paid API, so without
 * this anyone with the URL can drain the key in a loop. That is the hole this
 * closes, and it closes it whichever provider is configured.
 *
 * HONEST LIMITS. The counters live in this process's memory, so:
 *  - On serverless, each instance keeps its own window. Under fan-out the real
 *    ceiling is roughly (limit × instances), not `limit`. It bounds abuse; it
 *    does not enforce an exact quota.
 *  - A deploy or a cold start forgets every window.
 * That is the right trade for a course app being tested, and the wrong one for
 * a hard billing cap. If this ever needs to be exact, the same interface backs
 * onto Redis or Upstash without any route changing.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Stops the map growing without bound when many distinct clients appear. */
const MAX_TRACKED = 10_000;

export type RateLimitResult = {
  ok: boolean;
  /** Requests still allowed in this window. */
  remaining: number;
  /** Seconds until the window resets — sent as Retry-After on a refusal. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    // Cheap eviction: only when the map is large, and only of expired windows,
    // so a burst of one-off clients cannot pin memory forever.
    if (windows.size >= MAX_TRACKED) {
      for (const [k, w] of windows) {
        if (now >= w.resetAt) windows.delete(k);
      }
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfter };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfter };
}

/**
 * Best-effort client identity. Behind a proxy the socket address is the proxy,
 * so the forwarded headers are read first — they are spoofable by a determined
 * caller, which is why this bounds accidental and casual abuse rather than a
 * deliberate attacker. Real quotas need an account.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** The 429 both routes return, with the header a client needs to back off. */
export function tooManyRequests(retryAfter: number, what: string): Response {
  return Response.json(
    {
      error: `Too many ${what} requests. Wait ${retryAfter}s and try again.`,
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
