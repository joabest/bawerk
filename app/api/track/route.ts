import { z } from "zod"
import { recordTraffic } from "@/lib/db"
import { limitPublicRequest, readLimitedJSON } from "@/lib/public-api-security"

export const runtime = "nodejs"
const schema = z.object({
  path: z.string().startsWith("/").max(180).refine(v => !v.startsWith("/admin") && !v.startsWith("/api")),
  source: z.string().max(100),
  device: z.enum(["Mobile", "Tablet", "Desktop"]),
  sessionId: z.uuid(),
}).strict()

export async function POST(request: Request) {
  const body = await readLimitedJSON(request, 2048)
  if (!body.ok) return body.response
  const parsed = schema.safeParse(body.value)
  if (!parsed.success) return Response.json({ error: "Dados inválidos" }, { status: 400 })
  const denied = await limitPublicRequest(request, "track")
  if (denied) return denied
  try {
    await recordTraffic(parsed.data)
    return Response.json({ ok: true })
  } catch (error) {
    console.error("TRACK_FAILED", error instanceof Error ? error.name : "Unknown")
    return Response.json({ error: "Registro indisponível" }, { status: 503 })
  }
}
