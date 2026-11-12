'use client'
import {useMemo,useState} from 'react'
import Link from '../PublicLink'
import {ArrowUpRight,Grid2X2,List,Search} from 'lucide-react'
import {categories,posts,getReadingTime} from '../blog-data'
import type {BlogPost} from '../blog-data'

export function BlogThumbnail({post}:{post:BlogPost}){
 const slug=post.slug
 return <div className={'b3-thumb b3-thumb-'+post.theme+' b3-art-'+slug} aria-hidden="true">
  <span className="b3-thumb-label">{post.category}</span>
  <div className="b3-thumb-display">
   {slug==='ia-com-responsabilidade'&&<div className="b3-audit-row">
    {['ACESSO','REVISÃO','CONTROLE'].map((label,i)=><div className="b3-audit-card" key={label}><span>{['⊙','✓','⌁'][i]}</span><small>{label}</small><i/></div>)}
   </div>}
   {slug==='agentes-ia-nos-negocios'&&<div className="b3-app-grid">
    {['▦','✳','⌘','◇','◈','≋','⎔','✦','▣'].map((v,i)=><div key={i} className={i===4?'b3-app-hot':''}>{v}</div>)}
   </div>}
   {slug==='sites-rapidos-e-resultados'&&<div className="b3-speed"><strong>98</strong><span>WEB / PERFORMANCE</span><div className="b3-speed-bars">{[38,46,32,58,70,57,85,94,100,83,95,88].map((v,i)=><i key={i} style={{height:v+'%'}}/>)}</div></div>}
   {slug==='por-que-negocio-nao-aparece'&&<div className="b3-search-art"><div className="b3-search-top">⌕ &nbsp; sua empresa no Google <span>↗</span></div><div className="b3-search-lines"><i/><i/><i/></div><div className="b3-search-badge">SEO ↑</div></div>}
   {slug==='crm-sem-perder-leads'&&<div className="b3-crm-art"><div className="b3-crm-title">CRM / PIPELINE</div><div className="b3-crm-columns">{['NOVOS','EM CONTATO','PROPOSTA'].map((v,i)=><div key={v}><small>{v}</small>{Array.from({length:3-i},(_,n)=><span key={n}/>)}</div>)}</div></div>}
   {slug==='automacao-processos-na-pratica'&&<div className="b3-flow-art"><div className="b3-node">FORMULÁRIO</div><span>→</span><div className="b3-node">AUTOMAÇÃO ✳</div><span>→</span><div className="b3-node">CRM ✓</div></div>}
   {slug==='branding-e-confianca'&&<div className="b3-brand-art"><span>✦</span><strong>IDENTIDADE.</strong><small>MARCA · DESIGN · SISTEMA VISUAL</small></div>}
   {slug==='landing-page-ou-site'&&<div className="b3-browser-art"><div className="b3-browser-top">● ● ● <span>www.bawerk.solutions</span></div><div className="b3-browser-heading">WEB / EXPERIÊNCIA</div><div className="b3-browser-blocks"><i/><i/><i/></div></div>}
   {slug==='medindo-o-que-importa'&&<div className="b3-data-art"><span>ANÁLISE / DADOS</span><strong>+28%</strong><div className="b3-data-chart">{[20,34,30,44,40,57,54,73,85,81,91].map((v,i)=><i key={i} style={{height:v+'%'}}/>)}</div></div>}
   <div className="b3-editorial-art">
    <div className="b3-editorial-ring b3-editorial-ring-outer"/>
    <div className="b3-editorial-ring b3-editorial-ring-inner"/>
    <div className="b3-editorial-grid-art"><span/><span/><span/><span/></div>
    <span className="b3-editorial-art-code">BW/{String(post.category).slice(0,3)}</span>
    <span className="b3-editorial-art-mark">{post.symbol}</span>
    <span className="b3-editorial-art-bottom">BAWERK · IDEIAS EM MOVIMENTO <i>●</i></span>
   </div>
  </div>
 </div>
}
export default function BlogClient(){
 const [category,setCategory]=useState<string>('TODOS')
 const [search,setSearch]=useState('')
 const [view,setView]=useState<'grade'|'lista'>('grade')
 const [limit,setLimit]=useState(9)
 const filtered=useMemo(()=>posts.filter(p=>(category==='TODOS'||p.category===category)&&(p.title+' '+p.summary+' '+p.category).toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))),[category,search])
 const visible=filtered.slice(0,limit)
 return <div className="b3-container">
  <header className="b3-page-head"><span className="b3-overline">[ BLOG / BAWERK SOLUTIONS ]</span>
   <h1>Notas do nosso<br/>universo <em>digital<span className="b3-dot-white">.</span></em></h1>
   <p>Ideias, análises e práticas sobre engenharia de software, inteligência artificial, marketing, CRM e experiências digitais. Sem complicação, com propósito.</p>
  </header>
  <section className="b3-section" style={{paddingTop:30}}>
   <span className="b3-overline">[ EXPLORE POR CATEGORIA ]</span>
   <h2 className="b3-category-heading">Escolha um tema<span className="b3-dot-blue">.</span><br/>Explore o conteúdo<span className="b3-dot-blue">.</span></h2>
   <div className="b3-blog-intro-bar"><span>30 ARTIGOS ORIGINAIS · 7 CATEGORIAS</span><span>CONTEÚDO TÉCNICO / NEGÓCIOS / EXPERIÊNCIAS DIGITAIS</span></div>
   <div className="b3-blog-controls">
    <div className="b3-chips" role="group" aria-label="Filtrar categorias">
     {categories.map(cat=><button key={cat} className={'b3-chip'+(category===cat?' b3-selected':'')} aria-pressed={category===cat} onClick={()=>{setCategory(cat);setLimit(9)}}>{cat} <small>{cat==='TODOS'?posts.length:posts.filter(p=>p.category===cat).length}</small></button>)}
    </div>
    <div className="b3-tools"><label className="b3-overline" htmlFor="b3-blog-query">PESQUISA</label><input id="b3-blog-query" value={search} onChange={e=>{setSearch(e.target.value);setLimit(9)}} placeholder="Buscar artigos..."/><button className={view==='grade'?'b3-selected':''} onClick={()=>setView('grade')} aria-label="Visualizar em grade" aria-pressed={view==='grade'}><Grid2X2 size={17}/></button><button className={view==='lista'?'b3-selected':''} onClick={()=>setView('lista')} aria-label="Visualizar em lista" aria-pressed={view==='lista'}><List size={18}/></button></div>
   </div>
   <div className="b3-section-top" style={{marginTop:46}}><span className="b3-overline">[ ARTIGOS ]</span><span className="b3-overline">{filtered.length} ARTIGOS · {view==='grade'?'GRADE':'LISTA'}</span></div>
   {visible.length>0?<div className={'b3-blog-grid'+(view==='lista'?' b3-blog-list':'')}>{visible.map(post=><Link key={post.slug} href={'/site3/blog/'+post.slug} className="b3-blog-card">
     <BlogThumbnail post={post}/>
     <div className="b3-blog-card-body"><span className="b3-card-index">{post.category}</span><h3>{post.title}</h3><p>{post.summary}</p><div className="b3-blog-card-foot"><span>BAWERK · {getReadingTime(post)} MIN DE LEITURA</span><ArrowUpRight size={17}/></div></div>
    </Link>)}</div>:<div className="b3-card" style={{marginTop:20,textAlign:'center'}}>Nenhum artigo encontrado. Experimente outra categoria ou termo.</div>}
   {limit<filtered.length&&<div className="b3-pagination"><button onClick={()=>setLimit(v=>v+6)}>CARREGAR MAIS ARTIGOS ↓</button></div>}
  </section>
 </div>
}