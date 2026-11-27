import "server-only"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"

// Only the site and the currently selected Vercel preview deployment may mutate admin data.
function allowedOrigins(): Set<string> {
  const allowed = new Set(["https://bawerk.solutions", "https://www.bawerk.solutions"])
  const preview = process.env.VERCEL_URL
  if (preview && /^[a-z0-9.-]+\.vercel\.app$/i.test(preview)) allowed.add("https://" + preview)
  // Explicit, reviewed preview aliases only. Never trust Host or X-Forwarded-Host.
  for (const candidate of (process.env.ADMIN_ALLOWED_ORIGINS || "").split(",")) {
    const value = candidate.trim()
    if (!value) continue
    try {
      const url = new URL(value)
      if (url.origin === value && url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash) {
        allowed.add(url.origin)
      }
    } catch { /* Invalid or non-HTTPS alias intentionally ignored. */ }
  }
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000")
    allowed.add("http://127.0.0.1:3000")
  }
  return allowed
}

export function adminOriginValid(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return false // Writes without Origin are explicitly denied (fail closed).
  try {
    const url = new URL(origin)
    return url.origin === origin && allowedOrigins().has(url.origin)
  } catch { return false }
}

export async function adminSessionValid(): Promise<boolean> {
  return validToken((await cookies()).get(COOKIE)?.value)
}

export async function requireAdmin(request?: Request): Promise<NextResponse | null> {
  if (!(await adminSessionValid())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }
  if (request && !["GET", "HEAD", "OPTIONS"].includes(request.method) && !adminOriginValid(request)) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403, headers: { "Cache-Control": "no-store" } })
  }
  return null
}
