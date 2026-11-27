import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { getEngagement } from "@/lib/page-engagement"
export const runtime = "nodejs"
export async function GET(request: Request) {
 const denied=await requireAdmin();if(denied)return denied;
 const n=Number(new URL(request.url).searchParams.get("days")||30)
 const days:7|30|90 = n===7?7:n===90?90:30
 try{
  return NextResponse.json(await getEngagement(days),{headers:{"Cache-Control":"no-store"}})
 }catch{
  return NextResponse.json({error:"Configure DATABASE_URL na Vercel para ativar o relatório de engajamento."},{status:503})
 }
}
