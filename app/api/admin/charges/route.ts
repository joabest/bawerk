import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { listCharges,saveCharge } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;return NextResponse.json({charges:await listCharges()})}
export async function POST(r:Request){const denied=await requireAdmin(r);if(denied)return denied;const d=await r.json();if(!Number.isInteger(d.clientId)||!d.title||!d.dueDate)return NextResponse.json({error:"Dados obrigatórios ausentes"},{status:400});await saveCharge({id:Number.isInteger(d.id)?d.id:undefined,clientId:d.clientId,title:String(d.title),amount:Math.max(0,Number(d.amount)||0),recurrence:["monthly","annual","once"].includes(d.recurrence)?d.recurrence:"monthly",dueDate:String(d.dueDate),status:["pending","paid","overdue","paused","cancelled"].includes(d.status)?d.status:"pending",notes:String(d.notes||"")});return NextResponse.json({ok:true})}
