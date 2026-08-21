import { NextResponse } from "next/server"
import { recordTraffic } from "@/lib/db"
export async function POST(request:Request){try{const body=await request.json();await recordTraffic({path:String(body.path||"/").slice(0,180),source:String(body.source||"Direto").slice(0,100),device:String(body.device||"Desktop").slice(0,30),sessionId:String(body.sessionId||"").slice(0,80)});return NextResponse.json({ok:true})}catch{return NextResponse.json({ok:false},{status:202})}}
