import { cookies } from "next/headers"
import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { exchangeCode, findMailboxAccount, saveConnection } from "@/lib/zoho-mail"

function equal(a: string, b: string) {
  const first = Buffer.from(a), second = Buffer.from(b)
  return first.length === second.length && timingSafeEqual(first, second)
}
export async function GET(request: Request) {
  const url = new URL(request.url)
  const cookieStore = await cookies()
  const storedState = cookieStore.get("bawerk_zoho_oauth")?.value || ""
  const receivedState = url.searchParams.get("state") || ""
  const authorized = validToken(cookieStore.get(COOKIE)?.value)
  const redirect = new URL("/admin", url.origin)
  const failure = (reason: string) => {
    redirect.searchParams.set("zoho", reason)
    const response = NextResponse.redirect(redirect)
    response.cookies.delete("bawerk_zoho_oauth")
    response.headers.set("Cache-Control", "no-store")
    return response
  }
  if (!authorized) return failure("admin-session-expired")
  if (!storedState || !receivedState || !equal(storedState, receivedState)) return failure("invalid-state")
  const code = url.searchParams.get("code")
  if (!code || url.searchParams.has("error")) return failure("authorization-denied")
  try {
    const tokens = await exchangeCode(code)
    const refresh = tokens.refresh_token
    if (typeof refresh !== "string" || !refresh) return failure("missing-refresh-token")
    const accountId = await findMailboxAccount(String(tokens.access_token))
    await saveConnection(accountId, refresh)
    return failure("connected")
  } catch {
    return failure("connection-failed")
  }
}
