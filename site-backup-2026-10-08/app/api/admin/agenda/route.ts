import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE,validToken } from "@/lib/admin-auth"
import { listAgenda,saveAgenda } from "@/lib/db"
async function allowed(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});return NextResponse.json({events:await listAgenda()})}
export async function POST(r:Request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const d=await r.json();if(!d.title||!d.startsAt)return NextResponse.json({error:"Título e data obrigatórios"},{status:400});await saveAgenda({id:Number.isInteger(d.id)?d.id:undefined,clientId:Number.isInteger(d.clientId)?d.clientId:undefined,title:String(d.title),eventType:["meeting","task","deadline"].includes(d.eventType)?d.eventType:"meeting",startsAt:String(d.startsAt),status:["scheduled","done","cancelled"].includes(d.status)?d.status:"scheduled",notes:String(d.notes||"")});return NextResponse.json({ok:true})}
