import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE, validToken } from "@/lib/admin-auth"
import { listLeads, markLead } from "@/lib/db"
async function allowed(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});try{return NextResponse.json({leads:await listLeads()})}catch{return NextResponse.json({leads:[],setup:true},{status:200})}}
export async function PATCH(request:Request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const {id,status}=await request.json();if(!Number.isInteger(id)||!["new","read","archived"].includes(status))return NextResponse.json({error:"Dados inválidos"},{status:400});await markLead(id,status);return NextResponse.json({ok:true})}
