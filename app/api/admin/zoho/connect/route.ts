import { cookies } from "next/headers"
import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { authorizationUrl, zohoMissingConfig } from "@/lib/zoho-mail"

export async function GET(request: Request) {
  if (!validToken((await cookies()).get(COOKIE)?.value)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const missing = zohoMissingConfig()
  if (missing.length) return NextResponse.json({ error: "Configure as variáveis da Zoho na Vercel", missing }, { status: 503 })
  const state = randomBytes(32).toString("hex")
  const response = NextResponse.redirect(authorizationUrl(state))
  response.cookies.set("bawerk_zoho_oauth", state, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/api/admin/zoho", maxAge: 600,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
