import { neon } from "@neondatabase/serverless"

function sql() {
 const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
 if (!url) throw new Error("Banco de dados não configurado")
 return neon(url)
}
async function ensureTable() {
 const db = sql()
 await db`CREATE TABLE IF NOT EXISTS bawerk_page_engagement (
   id UUID PRIMARY KEY,
   session_id VARCHAR(64) NOT NULL,
   path VARCHAR(240) NOT NULL,
   source VARCHAR(100) NOT NULL DEFAULT 'Direto',
   device VARCHAR(30) NOT NULL DEFAULT 'Desktop',
   seconds INTEGER NOT NULL DEFAULT 0,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`
 await db`CREATE INDEX IF NOT EXISTS bawerk_engagement_created_idx ON bawerk_page_engagement(created_at DESC)`
 await db`CREATE INDEX IF NOT EXISTS bawerk_engagement_session_idx ON bawerk_page_engagement(session_id,created_at DESC)`
 return db
}
export type PageEngagement = { path:string; views:number; sessions:number; avgSeconds:number; totalSeconds:number }
export type SiteEngagement = {
 totalViews:number; uniqueSessions:number; totalSeconds:number; avgPageSeconds:number; avgSessionSeconds:number
 pages:PageEngagement[]; sources:{label:string;value:number}[]; devices:{label:string;value:number}[]
 daily:{label:string;views:number}[]; period:number
}
export async function recordEngagement(input:{id:string;sessionId:string;path:string;source:string;device:string;seconds:number}) {
 const db = await ensureTable()
 await db`INSERT INTO bawerk_page_engagement (id,session_id,path,source,device,seconds)
 VALUES (${input.id},${input.sessionId},${input.path},${input.source},${input.device},${input.seconds})
 ON CONFLICT (id) DO UPDATE SET seconds=GREATEST(bawerk_page_engagement.seconds,EXCLUDED.seconds),updated_at=NOW()`
}
export async function getEngagement(days:7|30|90=30):Promise<SiteEngagement> {
 const db=await ensureTable()
 const since = new Date(Date.now()-days*86400000).toISOString()
 const [totals, pages, sources, devices, daily, sessions] = await Promise.all([
  db`SELECT COUNT(*)::int views,COUNT(DISTINCT session_id)::int sessions,COALESCE(SUM(seconds),0)::bigint seconds,COALESCE(AVG(NULLIF(seconds,0)),0)::float avg_seconds FROM bawerk_page_engagement WHERE created_at>=${since}::timestamptz`,
  db`SELECT path,COUNT(*)::int views,COUNT(DISTINCT session_id)::int sessions,ROUND(COALESCE(AVG(NULLIF(seconds,0)),0))::int avg_seconds,COALESCE(SUM(seconds),0)::bigint total_seconds FROM bawerk_page_engagement WHERE created_at>=${since}::timestamptz GROUP BY path ORDER BY views DESC LIMIT 100`,
  db`SELECT source label,COUNT(*)::int value FROM bawerk_page_engagement WHERE created_at>=${since}::timestamptz GROUP BY source ORDER BY value DESC LIMIT 10`,
  db`SELECT device label,COUNT(*)::int value FROM bawerk_page_engagement WHERE created_at>=${since}::timestamptz GROUP BY device ORDER BY value DESC`,
  db`SELECT TO_CHAR(created_at AT TIME ZONE 'America/Sao_Paulo','DD/MM') label,DATE(created_at AT TIME ZONE 'America/Sao_Paulo') day,COUNT(*)::int views FROM bawerk_page_engagement WHERE created_at>=${since}::timestamptz GROUP BY 1,2 ORDER BY day ASC`,
  db`SELECT COALESCE(AVG(session_seconds),0)::float avg_seconds FROM (SELECT SUM(seconds) session_seconds FROM bawerk_page_engagement WHERE created_at>=${since}::timestamptz GROUP BY session_id) s`
 ])
 const t=totals[0]||{}
 return {
  totalViews:Number(t.views||0),uniqueSessions:Number(t.sessions||0),
  totalSeconds:Number(t.seconds||0),avgPageSeconds:Math.round(Number(t.avg_seconds||0)),avgSessionSeconds:Math.round(Number(sessions[0]?.avg_seconds||0)),
  pages:pages.map(p=>({path:String(p.path),views:Number(p.views),sessions:Number(p.sessions),avgSeconds:Number(p.avg_seconds),totalSeconds:Number(p.total_seconds)})),
  sources:sources.map(p=>({label:String(p.label),value:Number(p.value)})),
  devices:devices.map(p=>({label:String(p.label),value:Number(p.value)})),
  daily:daily.map(p=>({label:String(p.label),views:Number(p.views)})),period:days,
 }
}
