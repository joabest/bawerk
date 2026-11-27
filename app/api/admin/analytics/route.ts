import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { trafficOverview } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;try{return NextResponse.json(await trafficOverview())}catch{return NextResponse.json({total:0,today:0,uniqueSessions:0,sources:[],pages:[],devices:[],hours:[],setup:true})}}
