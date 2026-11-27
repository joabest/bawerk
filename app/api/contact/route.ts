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

function allowedTurnstileHostnames(): Set<string> {
  const allowed = new Set(["bawerk.solutions", "www.bawerk.solutions"])
  const preview = process.env.VERCEL_URL
  if (preview && /^[a-z0-9.-]+\.vercel\.app$/i.test(preview)) allowed.add(preview.toLowerCase())
  // Explicit preview aliases only; never derive the allowlist from Host headers.
  for (const entry of (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "").split(",")) {
    const name = entry.trim().toLowerCase()
    if (/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(name)) allowed.add(name)
  }
  return allowed
}

function matchesTurnstileSiteverify(value: unknown): boolean {
  if (!value || typeof value !== "object") return false
  const data = value as Record<string, unknown>
  if (data.success !== true || typeof data.hostname !== "string") return false
  if (!allowedTurnstileHostnames().has(data.hostname.toLowerCase())) return false
  const expectedAction = process.env.TURNSTILE_EXPECTED_ACTION
  if (expectedAction && data.action !== expectedAction) return false
  return true
}

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
    return matchesTurnstileSiteverify(result)
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
