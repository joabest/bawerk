import { NextResponse } from "next/server"
import { COOKIE, token, validPassword } from "@/lib/admin-auth"
export async function POST(request:Request){const {password}=await request.json();if(!validPassword(String(password||"")))return NextResponse.json({error:"Senha inválida"},{status:401});const response=NextResponse.json({ok:true});response.cookies.set(COOKIE,token(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*12});return response}
