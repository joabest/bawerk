import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE,validToken } from "@/lib/admin-auth"
import { listClients,saveClient } from "@/lib/db"
async function allowed(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});return NextResponse.json({clients:await listClients()})}
export async function POST(r:Request){if(!await allowed())return NextResponse.json({error:"Não autorizado"},{status:401});const d=await r.json();if(String(d.name||"").trim().length<2)return NextResponse.json({error:"Nome obrigatório"},{status:400});await saveClient({id:Number.isInteger(d.id)?d.id:undefined,name:String(d.name).trim(),company:String(d.company||""),email:String(d.email||""),phone:String(d.phone||""),document:String(d.document||""),status:["active","paused","cancelled"].includes(d.status)?d.status:"active",notes:String(d.notes||"")});return NextResponse.json({ok:true})}
