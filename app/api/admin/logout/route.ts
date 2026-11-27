import { NextResponse } from "next/server"
import { COOKIE } from "@/lib/admin-auth"
import { requireAdmin } from "@/lib/require-admin"

export async function POST(request: Request) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, "", {
    path: "/", httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production", maxAge: 0,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
