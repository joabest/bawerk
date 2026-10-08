import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE,validToken } from "@/lib/admin-auth"
import { trafficOverview } from "@/lib/db"
export async function GET(){if(!validToken((await cookies()).get(COOKIE)?.value))return NextResponse.json({error:"Não autorizado"},{status:401});try{return NextResponse.json(await trafficOverview())}catch{return NextResponse.json({total:0,today:0,uniqueSessions:0,sources:[],pages:[],devices:[],hours:[],setup:true})}}
