"use client"
import { useCallback, useEffect, useState } from "react"
import { Activity, BarChart3, Clock3, Eye, Globe2, RefreshCw, Users } from "lucide-react"

type Page={path:string;views:number;sessions:number;avgSeconds:number;totalSeconds:number}
type Report={
 totalViews:number;uniqueSessions:number;totalSeconds:number;avgPageSeconds:number;avgSessionSeconds:number;
 pages:Page[];sources:{label:string;value:number}[];devices:{label:string;value:number}[];daily:{label:string;views:number}[];period:number
}
function duration(seconds:number){
 const s=Math.max(0,Math.round(seconds||0))
 if(s<60)return s+" s"
 if(s<3600)return Math.floor(s/60)+" min "+String(s%60).padStart(2,"0")+" s"
 return Math.floor(s/3600)+" h "+Math.floor((s%3600)/60)+" min"
}
function Metric({label,value,detail,Icon}:{label:string;value:string;detail:string;Icon:typeof Eye}){
 return <div className="admin-metric rounded-2xl border border-white/10 bg-[#0e1118] p-5">
  <div className="flex items-center justify-between gap-3"><p className="admin-metric-label text-sm text-zinc-400">{label}</p><span className="admin-metric-icon rounded-xl p-2 text-indigo-200"><Icon size={19}/></span></div>
  <strong className="admin-metric-value mt-5 block text-3xl font-semibold">{value}</strong><p className="admin-metric-note mt-2 text-xs text-zinc-500">{detail}</p>
 </div>
}
export function EngagementAnalytics(){
 const [days,setDays]=useState<7|30|90>(30)
 const [data,setData]=useState<Report|null>(null)
 const [error,setError]=useState("")
 const [loading,setLoading]=useState(true)
 const load=useCallback(async()=>{
  setLoading(true);setError("")
  try{
   const response=await fetch("/api/admin/engagement?days="+days,{cache:"no-store"})
   const result=await response.json()
   if(!response.ok)throw new Error(result.error||"Não foi possível gerar o relatório")
   setData(result as Report)
  }catch(e){setError(e instanceof Error?e.message:"Erro ao carregar relatório")}
  finally{setLoading(false)}
 },[days])
 useEffect(()=>{void load()},[load])
 const max=Math.max(1,...(data?.daily||[]).map(x=>x.views))
 return <div className="space-y-6">
  <div className="flex flex-wrap items-end justify-between gap-4">
   <div><p className="admin-page-eyebrow text-xs text-indigo-300">ANALYTICS / SITE INTEIRO</p><h1 className="admin-page-title mt-1 text-3xl font-bold">Análise de visitantes<span className="text-indigo-300">.</span></h1><p className="admin-page-description mt-2 text-sm text-zinc-400">Acessos, sessões e tempo de leitura por página. Dados internos coletados após consentimento.</p></div>
   <div className="flex flex-wrap gap-2">{([7,30,90] as const).map(n=><button key={n} onClick={()=>setDays(n)} aria-pressed={days===n} className={"rounded-lg border px-3 py-2 text-xs transition "+(days===n?"border-indigo-400 bg-indigo-500/20 text-white":"border-white/10 text-zinc-400 hover:bg-white/5")}>{n} dias</button>)}<button onClick={()=>void load()} disabled={loading} className="rounded-lg border border-white/10 p-2" aria-label="Atualizar relatórios"><RefreshCw size={17} className={loading?"animate-spin":""}/></button></div>
  </div>
  {error&&<p role="alert" className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">{error}</p>}
  {loading&&!data&&<p className="p-6 text-zinc-400">Carregando relatório...</p>}
  {data&&<>
   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <Metric label="Visualizações de páginas" value={data.totalViews.toLocaleString("pt-BR")} detail="Acessos às páginas públicas" Icon={Eye}/>
    <Metric label="Sessões no site" value={data.uniqueSessions.toLocaleString("pt-BR")} detail="Sessões distintas no período" Icon={Users}/>
    <Metric label="Tempo médio por página" value={duration(data.avgPageSeconds)} detail="Tempo visível em visitas com duração registrada" Icon={Clock3}/>
    <Metric label="Tempo médio no site" value={duration(data.avgSessionSeconds)} detail="Soma da atividade por sessão" Icon={Activity}/>
   </div>
   <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
    <div className="admin-panel rounded-2xl p-5 sm:p-6">
     <div className="flex items-center justify-between"><div><h2 className="text-base font-semibold">Tráfego ao longo do tempo</h2><p className="mt-1 text-xs text-zinc-500">Visualizações por dia</p></div><BarChart3 size={20} className="text-indigo-300"/></div>
     <div className="mt-6 flex h-56 items-end gap-1 overflow-hidden rounded-xl border-b border-white/10 bg-[#0e1523] p-3">
      {data.daily.length?data.daily.map((day,i)=><div className="group relative flex h-full min-w-0 flex-1 flex-col justify-end" key={day.label+"-"+i} title={day.label+": "+day.views+" visualizações"}><div className="w-full rounded-t-sm bg-gradient-to-t from-[#4963c4] to-[#8b9cff] transition-all group-hover:brightness-125" style={{height:Math.max(3,(day.views/max)*100)+"%"}}/></div>):<p className="m-auto text-sm text-zinc-500">Ainda não há visitas com consentimento neste período.</p>}
     </div><div className="mt-2 flex justify-between text-xs text-zinc-500"><span>{data.daily[0]?.label||"—"}</span><span>{data.daily[data.daily.length-1]?.label||"—"}</span></div>
    </div>
    <div className="admin-panel rounded-2xl p-5 sm:p-6"><h2 className="text-base font-semibold">Origem dos acessos</h2><p className="mt-1 text-xs text-zinc-500">Canais identificados</p><div className="mt-6 space-y-4">{data.sources.length?data.sources.map(row=><div key={row.label}><div className="mb-2 flex justify-between gap-3 text-xs"><span className="truncate text-zinc-300">{row.label}</span><span>{row.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-indigo-400" style={{width:(100*row.value/Math.max(1,data.sources[0].value))+"%"}}/></div></div>):<p className="text-sm text-zinc-500">Sem dados ainda.</p>}</div></div>
   </div>
   <div className="admin-panel rounded-2xl p-5 sm:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-semibold">Desempenho de cada página</h2><p className="mt-1 text-xs text-zinc-500">Inclui páginas de serviços, blog e /site3; exclui /admin</p></div><span className="admin-chip">{data.pages.length} URLs</span></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-zinc-500"><tr><th className="pb-4 pr-4">Página</th><th className="pb-4 pr-4 text-right">Visualizações</th><th className="pb-4 pr-4 text-right">Sessões</th><th className="pb-4 pr-4 text-right">Tempo médio</th><th className="pb-4 text-right">Tempo total</th></tr></thead><tbody>{data.pages.map(p=><tr key={p.path} className="border-b border-white/5"><td className="max-w-[350px] truncate py-4 pr-4 font-medium text-indigo-200" title={p.path}>{p.path}</td><td className="py-4 pr-4 text-right">{p.views}</td><td className="py-4 pr-4 text-right">{p.sessions}</td><td className="py-4 pr-4 text-right">{duration(p.avgSeconds)}</td><td className="py-4 text-right">{duration(p.totalSeconds)}</td></tr>)}</tbody></table>{!data.pages.length&&<p className="py-8 text-center text-sm text-zinc-500">Nenhuma página registrada ainda. Os resultados aparecerão após visitas com consentimento.</p>}</div>
   </div>
   <div className="admin-panel rounded-2xl p-5 sm:p-6">
    <h2 className="text-base font-semibold">Dispositivos</h2><div className="mt-4 flex flex-wrap gap-3">{data.devices.map(d=><div key={d.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] px-4 py-3"><Globe2 size={16} className="text-indigo-300"/><span className="text-sm">{d.label}</span><strong>{d.value}</strong></div>)}{!data.devices.length&&<p className="text-sm text-zinc-500">Aguardando visitas.</p>}</div>
   </div>
   <p className="text-xs leading-6 text-zinc-500">Estatísticas calculadas pelo rastreador interno BAWERK, não pela API do GA4. Tempos são aproximados e excluem abas em segundo plano. Não há gravação de conteúdo digitado. Google Analytics e Clarity possuem relatórios próprios.</p>
  </>}
 </div>
}
