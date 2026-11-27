import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { listLeads, updateLead } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;try{return NextResponse.json({leads:await listLeads()})}catch{return NextResponse.json({leads:[],setup:true},{status:200})}}
export async function PATCH(request:Request){const denied=await requireAdmin(request);if(denied)return denied;const {id,status,important}=await request.json();if(!Number.isInteger(id)||status&&!["new","read","later","responded","archived"].includes(status)||typeof important!=="undefined"&&typeof important!=="boolean")return NextResponse.json({error:"Dados inválidos"},{status:400});await updateLead(id,{status,important});return NextResponse.json({ok:true})}
