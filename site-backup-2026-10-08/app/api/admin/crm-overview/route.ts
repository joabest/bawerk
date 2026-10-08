import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { COOKIE,validToken } from "@/lib/admin-auth"
import { crmOverview } from "@/lib/db"
export async function GET(){if(!validToken((await cookies()).get(COOKIE)?.value))return NextResponse.json({error:"Não autorizado"},{status:401});return NextResponse.json(await crmOverview())}
