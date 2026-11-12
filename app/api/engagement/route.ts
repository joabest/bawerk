import { NextResponse } from "next/server"
import { recordEngagement } from "@/lib/page-engagement"
export const runtime = "nodejs"
export async function POST(request: Request) {
 try {
  if ((Number(request.headers.get("content-length"))||0)>1600) return new Response(null,{status:413})
  const origin = request.headers.get("origin")
  if (origin && new URL(origin).origin !== new URL(request.url).origin) return new Response(null,{status:403})
  const d=await request.json() as Record<string,unknown>
  if (typeof d.id!=="string" || !/^[0-9a-f-]{36}$/i.test(d.id) ||
      typeof d.sessionId!=="string" || !/^[0-9a-f-]{36}$/i.test(d.sessionId) ||
      typeof d.path!=="string" || !d.path.startsWith("/") || d.path.length>240 ||
      d.path.startsWith("/admin") || d.path.startsWith("/api") ||
      typeof d.seconds!=="number" || !Number.isFinite(d.seconds) || d.seconds<0 || d.seconds>18000) {
   return new Response(null,{status:400})
  }
  const source=String(d.source||"Direto").slice(0,100)
  const device=["Mobile","Tablet","Desktop"].includes(String(d.device))?String(d.device):"Desktop"
  await recordEngagement({id:d.id,sessionId:d.sessionId,path:d.path,source,device,seconds:Math.floor(d.seconds)})
  return new Response(null,{status:204,headers:{"Cache-Control":"no-store"}})
 } catch {
  return NextResponse.json({error:"Registro indisponível"},{status:503})
 }
}
