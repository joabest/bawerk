import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { authenticatedConnection, inboxFolderId, listMailboxFolders, zohoFetch } from "@/lib/zoho-mail"

export async function GET(request: Request) {
  if (!validToken((await cookies()).get(COOKIE)?.value)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const { accountId, accessToken } = await authenticatedConnection()
    const folders = await listMailboxFolders(accountId, accessToken)
    const inbox = inboxFolderId(folders)
    if (!inbox) return NextResponse.json({ error: "Pasta de entrada não encontrada na Zoho." }, { status: 502 })
    const url = new URL(request.url)
    const start = Math.max(1, Math.min(10000, Number.parseInt(url.searchParams.get("start") || "1", 10) || 1))
    const limit = 25
    const qs = new URLSearchParams({ folderId: inbox, start: String(start), limit: String(limit), status: "all" })
    const data = await zohoFetch("/api/accounts/" + encodeURIComponent(accountId) + "/messages/view?" + qs, accessToken)
    return NextResponse.json({
      messages: Array.isArray(data.data) ? data.data : [],
      folderId: inbox, start, limit, mailbox: "contato@bawerk.solutions",
    }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível consultar os e-mails." }, { status: 502 })
  }
}
