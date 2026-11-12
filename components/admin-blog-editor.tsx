"use client"
import {useEffect,useMemo,useState} from "react"
import type {BlogPost,BlogCategory,BlogSection} from "@/app/site3/blog-data"
import {BookOpen,Save,Search,RefreshCw,ExternalLink} from "lucide-react"

const categories:BlogCategory[]=["IA","SOFTWARE","APLICATIVOS","CRM","DESIGN","MARKETING","INSIGHTS"]
const clone=(post:BlogPost)=>JSON.parse(JSON.stringify(post)) as BlogPost

export function AdminBlogEditor(){
 const [posts,setPosts]=useState<BlogPost[]>([])
 const [draft,setDraft]=useState<BlogPost|null>(null)
 const [query,setQuery]=useState("")
 const [loading,setLoading]=useState(true)
 const [saving,setSaving]=useState(false)
 const [error,setError]=useState("")
 const [notice,setNotice]=useState("")
 const [dirty,setDirty]=useState(false)
 const filtered=useMemo(()=>posts.filter(p=>(p.title+" "+p.slug+" "+p.category).toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))),[posts,query])
 async function load(){
  setLoading(true);setError("")
  try{
   const r=await fetch("/api/admin/blog",{cache:"no-store"})
   const result=await r.json()
   if(!r.ok)throw new Error(result.error||"Não foi possível carregar os artigos.")
   setPosts(result.posts)
   setDraft(current=>current?clone(result.posts.find((p:BlogPost)=>p.slug===current.slug)||current):null)
  }catch(e){setError(e instanceof Error?e.message:"Falha na consulta")}
  finally{setLoading(false)}
 }
 useEffect(()=>{void load()},[])
 function select(post:BlogPost){
  if(dirty&&!window.confirm("Descartar alterações ainda não salvas?"))return
  setDraft(clone(post));setNotice("");setError("");setDirty(false)
 }
 function update(change:Partial<BlogPost>){setDraft(p=>p?{...p,...change}:p);setDirty(true)}
 function changeSection(i:number,change:Partial<BlogSection>){
  if(!draft)return
  update({body:draft.body.map((s,j)=>j===i?{...s,...change}:s)})
 }
 async function save(){
  if(!draft)return
  setSaving(true);setError("");setNotice("")
  try{
   const r=await fetch("/api/admin/blog",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(draft)})
   const result=await r.json()
   if(!r.ok)throw new Error(result.error||"Falha ao salvar")
   setPosts(all=>all.map(p=>p.slug===result.post.slug?result.post:p))
   setDraft(clone(result.post));setDirty(false)
   setNotice("Artigo salvo. A versão atualizada será exibida na página pública.")
  }catch(e){setError(e instanceof Error?e.message:"Falha ao salvar")}
  finally{setSaving(false)}
 }
 return <div className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-4"><div>
   <p className="text-xs font-mono tracking-wider text-indigo-300">CONTEÚDO / SITE PÚBLICO</p>
   <h1 className="mt-2 text-3xl font-semibold">Editar blog<span className="text-indigo-400">.</span></h1>
   <p className="mt-2 text-sm text-zinc-400">Edite os artigos existentes. O endereço e a identidade visual de cada post são preservados.</p>
  </div><button onClick={()=>void load()} disabled={loading} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"><RefreshCw size={15} className="mr-2 inline"/>Atualizar</button></div>
  {error&&<p role="alert" className="rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
  {notice&&<p role="status" className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm text-emerald-100">{notice}</p>}
  <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
   <aside className="min-w-0 rounded-2xl border border-white/10 bg-[#0e1118] p-4">
    <label className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2"><Search size={16} className="text-zinc-500"/><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar artigo"/></label>
    <p className="my-4 text-xs text-zinc-500">{loading?"Carregando...":filtered.length+" artigos encontrados"}</p>
    <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
     {filtered.map(post=><button type="button" key={post.slug} onClick={()=>select(post)} className={"w-full rounded-xl border p-3 text-left transition "+(draft?.slug===post.slug?"border-indigo-400/50 bg-indigo-500/10":"border-white/5 hover:border-white/20 hover:bg-white/5")}><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-indigo-300">{post.category}</span><strong className="block text-sm font-medium leading-snug">{post.title}</strong><small className="mt-1 block truncate text-zinc-500">{post.slug}</small></button>)}
    </div>
   </aside>
   <article className="min-w-0 rounded-2xl border border-white/10 bg-[#0e1118] p-5 sm:p-7">
    {!draft?<div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center text-zinc-400"><BookOpen size={36}/><p>Escolha um artigo existente à esquerda para editar.</p></div>:<form onSubmit={e=>{e.preventDefault();void save()}} className="space-y-6">
     <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="text-xs text-zinc-500">URL permanente: </span><code className="text-xs text-indigo-300">/blog/{draft.slug}</code></div><a href={"/blog/"+draft.slug} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-indigo-300 hover:underline">Visualizar artigo <ExternalLink size={14}/></a></div>
     <label className="block text-sm text-zinc-300">Título<input required minLength={8} maxLength={180} className="mt-2 w-full rounded-lg border border-white/10 bg-black/25 p-3 text-white outline-none focus:border-indigo-400" value={draft.title} onChange={e=>update({title:e.target.value})}/></label>
     <label className="block text-sm text-zinc-300">Categoria<select className="mt-2 w-full rounded-lg border border-white/10 bg-[#10131c] p-3 text-white" value={draft.category} onChange={e=>update({category:e.target.value as BlogCategory})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
     <label className="block text-sm text-zinc-300">Resumo<textarea required minLength={20} maxLength={600} rows={3} className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black/25 p-3 text-white outline-none focus:border-indigo-400" value={draft.summary} onChange={e=>update({summary:e.target.value})}/></label>
     <div><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Seções do artigo</h2><button type="button" className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5" onClick={()=>update({body:[...draft.body,{heading:"Nova seção",paragraphs:["Novo parágrafo."]}]})}>+ Adicionar seção</button></div>
     <div className="mt-4 space-y-5">{draft.body.map((section,i)=><section key={i} className="rounded-xl border border-white/10 bg-white/[.02] p-4">
      <div className="flex items-start gap-3"><label className="min-w-0 flex-1 text-xs text-zinc-400">Seção {i+1}<input required className="mt-2 w-full rounded-lg border border-white/10 bg-black/25 p-3 text-sm text-white" value={section.heading} onChange={e=>changeSection(i,{heading:e.target.value})}/></label><button type="button" className="mt-6 rounded-lg border border-red-400/20 px-2 py-2 text-xs text-red-300" disabled={draft.body.length===1} onClick={()=>update({body:draft.body.filter((_,j)=>j!==i)})}>Remover</button></div>
      <div className="mt-4 space-y-3">{section.paragraphs.map((para,j)=><div key={j} className="flex items-start gap-2"><textarea required rows={5} className="min-w-0 flex-1 resize-y rounded-lg border border-white/10 bg-black/25 p-3 text-sm leading-6" value={para} onChange={e=>changeSection(i,{paragraphs:section.paragraphs.map((p,n)=>n===j?e.target.value:p)})}/><button type="button" className="rounded-lg border border-red-400/20 p-2 text-xs text-red-300" disabled={section.paragraphs.length===1} onClick={()=>changeSection(i,{paragraphs:section.paragraphs.filter((_,n)=>n!==j)})}>×</button></div>)}</div>
      <button type="button" className="mt-3 text-xs text-indigo-300 hover:underline" onClick={()=>changeSection(i,{paragraphs:[...section.paragraphs,"Novo parágrafo."]})}>+ Parágrafo</button>
     </section>)}</div></div>
     <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#0e1118] py-4"><p className="text-xs text-zinc-500">{dirty?"Existem alterações não salvas.":"Todas as alterações estão salvas."}</p><button type="submit" disabled={saving||!dirty} className="flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"><Save size={16}/>{saving?"Salvando...":"Salvar alterações"}</button></div>
    </form>}
   </article>
  </div>
 </div>
}
