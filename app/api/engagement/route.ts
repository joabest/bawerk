import { z } from "zod"
import { recordEngagement } from "@/lib/page-engagement"
import { limitPublicRequest, readLimitedJSON } from "@/lib/public-api-security"

export const runtime = "nodejs"
const schema = z.object({
  id: z.uuid(),
  sessionId: z.uuid(),
  path: z.string().startsWith("/").max(240).refine(v => !v.startsWith("/admin") && !v.startsWith("/api")),
  source: z.string().max(100),
  device: z.enum(["Mobile", "Tablet", "Desktop"]),
  seconds: z.number().int().min(0).max(18000),
}).strict()

export async function POST(request: Request) {
  const body = await readLimitedJSON(request, 2048)
  if (!body.ok) return body.response
  const parsed = schema.safeParse(body.value)
  if (!parsed.success) return Response.json({ error: "Dados inválidos" }, { status: 400 })
  const denied = await limitPublicRequest(request, "engagement")
  if (denied) return denied
  try {
    await recordEngagement(parsed.data)
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("ENGAGEMENT_FAILED", error instanceof Error ? error.name : "Unknown")
    return Response.json({ error: "Registro indisponível" }, { status: 503 })
  }
}
