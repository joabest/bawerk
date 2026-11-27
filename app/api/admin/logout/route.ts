import { NextResponse } from "next/server"
import { COOKIE } from "@/lib/admin-auth"
import { adminOriginValid } from "@/lib/require-admin"

export async function POST(request: Request) {
  if (!adminOriginValid(request)) {
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
