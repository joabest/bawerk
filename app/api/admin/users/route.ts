import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { listAdminUsers,saveAdminUser } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;try{return NextResponse.json({users:await listAdminUsers()})}catch{return NextResponse.json({users:[],setup:true})}}
export async function POST(request:Request){const denied=await requireAdmin(request);if(denied)return denied;const d=await request.json();if(String(d.name||"").trim().length<2||!String(d.email||"").includes("@"))return NextResponse.json({error:"Nome e e-mail são obrigatórios"},{status:400});await saveAdminUser({id:Number.isInteger(d.id)?d.id:undefined,name:String(d.name).trim(),email:String(d.email).trim(),role:String(d.role||"Atendimento"),avatarUrl:String(d.avatarUrl||""),status:d.status==="inactive"?"inactive":"active"});return NextResponse.json({ok:true})}
