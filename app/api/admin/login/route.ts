import { NextResponse } from "next/server"
import { adminConfigured, COOKIE, token, validPassword, SESSION_SECONDS } from "@/lib/admin-auth"
import { checkAdminLoginLimit } from "@/lib/admin-rate-limit"
import { adminOriginValid } from "@/lib/require-admin"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!adminOriginValid(request)) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403, headers: { "Cache-Control": "no-store" } })
  }
  // Every login attempt is counted before parsing the body or comparing a password.
  const limit = await checkAdminLoginLimit(request)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: limit.unavailable ? "Autenticação temporariamente indisponível" : "Muitas tentativas. Tente novamente mais tarde." },
      { status: limit.unavailable ? 503 : 429, headers: { "Cache-Control": "no-store", "Retry-After": String(limit.retryAfter) } }
    )
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Acesso administrativo indisponível" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
  if (Number(request.headers.get("content-length") || 0) > 4096) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }
  const password = body && typeof body === "object" && "password" in body && typeof body.password === "string"
    ? body.password : ""
  if (!validPassword(password)) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, token(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
