import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { authenticatedConnection, inboxFolderId, listMailboxFolders, zohoFetch } from "@/lib/zoho-mail"

function plainText(html: string) {
  // Render incoming mail as text: no scripts, tracking pixels, remote styles or HTML injection.
  return html.replace(/<(script|style|head)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|tr|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&amp;/gi, "&")
    .replace(/\n{3,}/g, "\n\n").trim().slice(0, 100000)
}
export async function GET(_request: Request, { params }: { params: Promise<{ messageId: string }> }) {
  if (!validToken((await cookies()).get(COOKIE)?.value)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { messageId } = await params
  if (!/^\d{1,30}$/.test(messageId)) return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 })
  try {
    const { accountId, accessToken } = await authenticatedConnection()
    const inbox = inboxFolderId(await listMailboxFolders(accountId, accessToken))
    if (!inbox) return NextResponse.json({ error: "Caixa de entrada indisponível" }, { status: 502 })
    const prefix = "/api/accounts/" + encodeURIComponent(accountId) + "/folders/" + encodeURIComponent(inbox) + "/messages/" + messageId
    const [detail, content] = await Promise.all([
      zohoFetch(prefix + "/details", accessToken),
      zohoFetch(prefix + "/content", accessToken),
    ])
    const raw = typeof (content.data as { content?: unknown } | undefined)?.content === "string" ? (content.data as { content: string }).content : ""
    return NextResponse.json({ detail: detail.data, content: plainText(raw), folderId: inbox }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao abrir mensagem" }, { status: 502 })
  }
}
