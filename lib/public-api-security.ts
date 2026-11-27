import "server-only"
import { isIP } from "node:net"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const limits = {
  contact: [5, "10 m"],
  track: [60, "10 m"],
  engagement: [120, "10 m"],
} as const

const rateLimiters = new Map<string, Ratelimit>()
function rateLimiter(scope: keyof typeof limits): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  let limiter = rateLimiters.get(scope)
  if (!limiter) {
    const [requests, window] = limits[scope]
    limiter = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(requests, window), prefix: "bawerk:public:" + scope })
    rateLimiters.set(scope, limiter)
  }
  return limiter
}

// Vercel injects this header; never use a client-controlled x-forwarded-for.
// Missing/unparseable IP is rejected instead of sharing a global bucket.
export async function limitPublicRequest(request: Request, scope: keyof typeof limits): Promise<Response | null> {
  const ip = request.headers.get("x-vercel-forwarded-for")?.trim() || ""
  if (process.env.NODE_ENV === "production" && !isIP(ip)) {
    console.warn("PUBLIC_RATE_LIMIT_UNIDENTIFIED_IP", scope)
    return Response.json({ error: "Solicitação indisponível" }, { status: 503 })
  }
  const limiter = rateLimiter(scope)
  if (!limiter) return Response.json({ error: "Serviço temporariamente indisponível" }, { status: 503 })
  try {
    const result = await limiter.limit(process.env.NODE_ENV === "production" ? ip : "local:" + scope)
    if (result.success) return null
    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
    return Response.json({ error: "Muitas solicitações" }, { status: 429, headers: { "Retry-After": String(retryAfter) } })
  } catch {
    return Response.json({ error: "Serviço temporariamente indisponível" }, { status: 503 })
  }
}

export async function readLimitedJSON(request: Request, bytes: number): Promise<
  { ok: true; value: unknown } | { ok: false; response: Response }
> {
  const length = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(length) && length > bytes) return { ok: false, response: Response.json({ error: "Solicitação muito grande" }, { status: 413 }) }
  let raw: string
  try { raw = await request.text() } catch { return { ok: false, response: Response.json({ error: "Dados inválidos" }, { status: 400 }) } }
  if (Buffer.byteLength(raw, "utf8") > bytes) return { ok: false, response: Response.json({ error: "Solicitação muito grande" }, { status: 413 }) }
  try { return { ok: true, value: JSON.parse(raw) as unknown } }
  catch { return { ok: false, response: Response.json({ error: "Dados inválidos" }, { status: 400 }) } }
}
