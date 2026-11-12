import { NextResponse } from "next/server"
import { COOKIE } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, "", {
    path: "/", httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production", maxAge: 0,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
