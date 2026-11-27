import "server-only"
import { isIP } from "node:net"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

// Collect only the violated directive. Never log URLs, tokens, cookies or bodies.
let limiter: Ratelimit | undefined
function getLimiter() {
  if (!limiter) limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, "10 m"),
    prefix: "bawerk:csp-report:v1",
  })
  return limiter
}

export const runtime = "nodejs"
export async function POST(request: Request): Promise<Response> {
  const size = Number(request.headers.get("content-length") || 0)
  if (size > 4096) return new Response(null, { status: 413 })
  const ip = request.headers.get("x-vercel-forwarded-for")?.trim() || ""
  if (process.env.NODE_ENV === "production" && !isIP(ip)) return new Response(null, { status: 503 })
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return new Response(null, { status: 503 })
  try {
    const result = await getLimiter().limit(process.env.NODE_ENV === "production" ? ip : "local")
    if (!result.success) return new Response(null, { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))) } })
    const raw = await request.text()
    if (Buffer.byteLength(raw, "utf8") > 4096) return new Response(null, { status: 413 })
    const report: unknown = JSON.parse(raw)
    const reports = Array.isArray(report) ? report : [report]
    for (const entry of reports.slice(0, 8)) {
      if (!entry || typeof entry !== "object") continue
      const value = entry as Record<string, unknown>
      const body = value["csp-report"] && typeof value["csp-report"] === "object"
        ? value["csp-report"] as Record<string, unknown>
        : value.body && typeof value.body === "object"
          ? value.body as Record<string, unknown>
          : value
      const directive = body["effective-directive"] ?? body.effectiveDirective ?? body["violated-directive"]
      if (typeof directive === "string" && /^[a-z-]{3,60}$/.test(directive)) {
        console.info("CSP_REPORT_DIRECTIVE", directive)
      }
    }
    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 400 })
  }
}
