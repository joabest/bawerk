import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { listAgenda,saveAgenda } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;return NextResponse.json({events:await listAgenda()})}
export async function POST(r:Request){const denied=await requireAdmin(r);if(denied)return denied;const d=await r.json();if(!d.title||!d.startsAt)return NextResponse.json({error:"Título e data obrigatórios"},{status:400});await saveAgenda({id:Number.isInteger(d.id)?d.id:undefined,clientId:Number.isInteger(d.clientId)?d.clientId:undefined,title:String(d.title),eventType:["meeting","task","deadline"].includes(d.eventType)?d.eventType:"meeting",startsAt:String(d.startsAt),status:["scheduled","done","cancelled"].includes(d.status)?d.status:"scheduled",notes:String(d.notes||"")});return NextResponse.json({ok:true})}
