// ─── Config ───────────────────────────────────────────────────────────────────

const DAILY_LIMIT = 20;        // max coach calls per IP per day
const TTL_SECONDS = 86400;     // 24 hours — counter resets automatically

// ─── Upstash Redis helper ─────────────────────────────────────────────────────
// Uses Upstash's REST API — no npm packages needed.

async function redisCommand(url, token, ...args) {
  const res = await fetch(`${url}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`);
  const json = await res.json();
  return json.result;
}

// Increment a key and set TTL if this is the first hit today.
// Returns the new count.
async function incrementWithTTL(url, token, key) {
  const count = await redisCommand(url, token, 'INCR', key);
  if (count === 1) {
    // First request today — set the expiry
    await redisCommand(url, token, 'EXPIRE', key, String(TTL_SECONDS));
  }
  return count;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey      = Netlify.env.get("ANTHROPIC_API_KEY");
  const redisUrl    = Netlify.env.get("UPSTASH_REDIS_REST_URL");
  const redisToken  = Netlify.env.get("UPSTASH_REDIS_REST_TOKEN");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Rate limiting ────────────────────────────────────────────────────────
  // Only enforce if Upstash is configured — skips gracefully in local dev.
  if (redisUrl && redisToken) {
    const ip  = context.ip || "unknown";
    // Key format: ratelimit:YYYY-MM-DD:ip — one counter per IP per calendar day
    const day = new Date().toISOString().slice(0, 10);
    const key = `ratelimit:${day}:${ip}`;

    try {
      const count = await incrementWithTTL(redisUrl, redisToken, key);
      if (count > DAILY_LIMIT) {
        return new Response(
          JSON.stringify({
            error: `Daily limit of ${DAILY_LIMIT} coach calls reached. Come back tomorrow.`,
            rateLimited: true,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (err) {
      // If Redis is unreachable, log but allow the request through —
      // better to serve users than to block everyone on a Redis outage.
      console.error("Rate limit check failed:", err.message);
    }
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Call Anthropic ───────────────────────────────────────────────────────
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      ...(body.system ? { system: body.system } : {}),
      messages: body.messages,
    }),
  });

  const data = await upstream.json();
  return new Response(JSON.stringify(data), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/coach" };
