import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { listClients,saveClient } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;return NextResponse.json({clients:await listClients()})}
export async function POST(r:Request){const denied=await requireAdmin(r);if(denied)return denied;const d=await r.json();if(String(d.name||"").trim().length<2)return NextResponse.json({error:"Nome obrigatório"},{status:400});await saveClient({id:Number.isInteger(d.id)?d.id:undefined,name:String(d.name).trim(),company:String(d.company||""),email:String(d.email||""),phone:String(d.phone||""),document:String(d.document||""),status:["active","paused","cancelled"].includes(d.status)?d.status:"active",notes:String(d.notes||"")});return NextResponse.json({ok:true})}
