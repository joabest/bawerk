import "server-only"
import { isIP } from "node:net"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Vercel overwrites its forwarding headers. Never use an untrusted raw
// x-forwarded-for supplied by arbitrary callers or an arbitrary fallback.
function clientIdentifier(request: Request): string {
  if (process.env.NODE_ENV !== "production") return "development"
  const forwarded = request.headers.get("x-vercel-forwarded-for")?.trim() || ""
  return isIP(forwarded) ? forwarded : "unidentified-client"
}

let limiter: Ratelimit | undefined
function getLimiter(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "bawerk:admin-login:v1",
    })
  }
  return limiter
}

export type LoginLimit = { allowed: true } | { allowed: false; retryAfter: number; unavailable?: boolean }
export async function checkAdminLoginLimit(request: Request): Promise<LoginLimit> {
  const rateLimit = getLimiter()
  // Fail closed when the persistent store is unavailable; no bypass of login defenses.
  if (!rateLimit) return { allowed: false, retryAfter: 60, unavailable: true }
  try {
    const result = await rateLimit.limit(clientIdentifier(request))
    if (result.success) return { allowed: true }
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) }
  } catch {
    return { allowed: false, retryAfter: 60, unavailable: true }
  }
}
