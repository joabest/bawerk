import { requireAdmin } from "@/lib/require-admin"
import { NextResponse } from "next/server"
import { crmOverview } from "@/lib/db"
export async function GET(){const denied=await requireAdmin();if(denied)return denied;return NextResponse.json(await crmOverview())}
