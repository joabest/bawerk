import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { listLeads, updateLead } from "@/lib/db"
async function allowed(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});try{return NextResponse.json({leads:await listLeads()})}catch{return NextResponse.json({leads:[],setup:true},{status:200})}}
export async function PATCH(request:Request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const {id,status,important}=await request.json();if(!Number.isInteger(id)||status&&!["new","read","later","responded","archived"].includes(status)||typeof important!=="undefined"&&typeof important!=="boolean")return NextResponse.json({error:"Dados inválidos"},{status:400});await updateLead(id,{status,important});return NextResponse.json({ok:true})}
