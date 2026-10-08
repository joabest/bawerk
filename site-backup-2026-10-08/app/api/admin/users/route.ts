import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE,validToken } from "@/lib/admin-auth"
import { listAdminUsers,saveAdminUser } from "@/lib/db"
async function allowed(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});try{return NextResponse.json({users:await listAdminUsers()})}catch{return NextResponse.json({users:[],setup:true})}}
export async function POST(request:Request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const d=await request.json();if(String(d.name||"").trim().length<2||!String(d.email||"").includes("@"))return NextResponse.json({error:"Nome e e-mail são obrigatórios"},{status:400});await saveAdminUser({id:Number.isInteger(d.id)?d.id:undefined,name:String(d.name).trim(),email:String(d.email).trim(),role:String(d.role||"Atendimento"),avatarUrl:String(d.avatarUrl||""),status:d.status==="inactive"?"inactive":"active"});return NextResponse.json({ok:true})}
