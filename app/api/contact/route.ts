import { NextResponse } from "next/server"
import { z } from "zod"
import { createLead } from "@/lib/db"
import { limitPublicRequest, readLimitedJSON } from "@/lib/public-api-security"

export const runtime = "nodejs"
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(150),
  phone: z.string().trim().max(25).optional(),
  company: z.string().trim().max(120).optional(),
  service: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(2500),
  website: z.literal(""),
  turnstileToken: z.string().min(1).max(2048),
}).strict()

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false
  const body = new URLSearchParams({ secret, response: token })
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) return false
    const result: unknown = await response.json()
    return !!result && typeof result === "object" && "success" in result && result.success === true
  } catch { return false }
}

export async function POST(request: Request) {
  const parsedBody = await readLimitedJSON(request, 12 * 1024)
  if (!parsedBody.ok) return parsedBody.response
  const validated = schema.safeParse(parsedBody.value)
  if (!validated.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  const rateLimited = await limitPublicRequest(request, "contact")
  if (rateLimited) return rateLimited
  if (!await verifyTurnstile(validated.data.turnstileToken)) {
    return NextResponse.json({ error: "Verificação de segurança inválida" }, { status: 400 })
  }
  const d = validated.data
  try {
    const lead = await createLead({
      name: d.name, email: d.email, phone: d.phone || null,
      company: d.company || null, service: d.service || null,
      budget: d.budget || null, message: d.message,
    })
    return NextResponse.json({ ok: true, id: lead.id })
  } catch (error) {
    console.error("CONTACT_CREATE_FAILED", error instanceof Error ? error.name : "Unknown")
    return NextResponse.json({ error: "Não foi possível enviar agora" }, { status: 503 })
  }
}
