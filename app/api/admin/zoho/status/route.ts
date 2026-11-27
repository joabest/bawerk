import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { MAILBOX_ADDRESS, readConnection, zohoMissingConfig } from "@/lib/zoho-mail"

export async function GET() {
  const denied=await requireAdmin();if(denied)return denied;
  const missing = zohoMissingConfig()
  if (missing.length) return NextResponse.json({ connected: false, address: MAILBOX_ADDRESS, missing }, { headers: { "Cache-Control": "no-store" } })
  try {
    const connection = await readConnection()
    return NextResponse.json({ connected: !!connection, address: MAILBOX_ADDRESS, configured: true, updatedAt: connection?.updatedAt || null }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ connected: false, address: MAILBOX_ADDRESS, error: "Não foi possível acessar o banco de dados." }, { status: 503 })
  }
}
