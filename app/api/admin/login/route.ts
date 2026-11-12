import { NextResponse } from "next/server"
import { adminConfigured, COOKIE, token, validPassword, SESSION_SECONDS } from "@/lib/admin-auth"

export async function POST(request: Request) {
  if (!adminConfigured()) return NextResponse.json({ error: "Acesso administrativo não configurado. Defina ADMIN_SECRET e ADMIN_PASSWORD_HASH na Vercel." }, { status: 503 })
  const origin = request.headers.get("origin")
  if (origin && new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403 })
  }
  let body: { password?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: "Dados inválidos" }, { status: 400 }) }
  if (!validPassword(String(body.password || ""))) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, token(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
