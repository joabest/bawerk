import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { getEngagement } from "@/lib/page-engagement"
export const runtime = "nodejs"
export async function GET(request: Request) {
 if (!validToken((await cookies()).get(COOKIE)?.value)) return NextResponse.json({error:"Não autorizado"},{status:401})
 const n=Number(new URL(request.url).searchParams.get("days")||30)
 const days:7|30|90 = n===7?7:n===90?90:30
 try{
  return NextResponse.json(await getEngagement(days),{headers:{"Cache-Control":"no-store"}})
 }catch{
  return NextResponse.json({error:"Configure DATABASE_URL na Vercel para ativar o relatório de engajamento."},{status:503})
 }
}
