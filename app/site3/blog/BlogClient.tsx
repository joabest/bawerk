'use client'
import {useMemo,useState} from 'react'
import Link from 'next/link'
import {ArrowUpRight,Grid2X2,List,Search} from 'lucide-react'
import {categories,posts} from '../blog-data'
import type {BlogPost} from '../blog-data'

export function BlogThumbnail({post}:{post:BlogPost}){
 return <div className={'b3-thumb b3-thumb-'+post.theme} aria-hidden="true">
  <span className="b3-thumb-label">{post.category}</span>
  <span className="b3-thumb-symbol">{post.symbol}</span>
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
   <h1>Notas do nosso<br/>universo <em>digital.</em></h1>
   <p>Ideias, análises e práticas sobre engenharia de software, inteligência artificial, marketing, CRM e experiências digitais. Sem complicação, com propósito.</p>
  </header>
  <section className="b3-section" style={{paddingTop:30}}>
   <span className="b3-overline">[ EXPLORE POR CATEGORIA ]</span>
   <h2 className="b3-category-heading">Escolha um tema.<br/>Explore o conteúdo.</h2>
   <div className="b3-blog-controls">
    <div className="b3-chips" role="group" aria-label="Filtrar categorias">
     {categories.map(cat=><button key={cat} className={'b3-chip'+(category===cat?' b3-selected':'')} aria-pressed={category===cat} onClick={()=>{setCategory(cat);setLimit(9)}}>{cat} <small>{cat==='TODOS'?posts.length:posts.filter(p=>p.category===cat).length}</small></button>)}
    </div>
    <div className="b3-tools"><label className="b3-overline" htmlFor="b3-blog-query">PESQUISA</label><input id="b3-blog-query" value={search} onChange={e=>{setSearch(e.target.value);setLimit(9)}} placeholder="Buscar artigos..."/><button className={view==='grade'?'b3-selected':''} onClick={()=>setView('grade')} aria-label="Visualizar em grade" aria-pressed={view==='grade'}><Grid2X2 size={17}/></button><button className={view==='lista'?'b3-selected':''} onClick={()=>setView('lista')} aria-label="Visualizar em lista" aria-pressed={view==='lista'}><List size={18}/></button></div>
   </div>
   <div className="b3-section-top" style={{marginTop:46}}><span className="b3-overline">[ ARTIGOS ]</span><span className="b3-overline">{filtered.length} ARTIGOS · {view==='grade'?'GRADE':'LISTA'}</span></div>
   {visible.length>0?<div className={'b3-blog-grid'+(view==='lista'?' b3-blog-list':'')}>{visible.map(post=><Link key={post.slug} href={'/site3/blog/'+post.slug} className="b3-blog-card">
     <BlogThumbnail post={post}/>
     <div className="b3-blog-card-body"><span className="b3-card-index">{post.category}</span><h3>{post.title}</h3><p>{post.summary}</p><div className="b3-blog-card-foot"><span>BAWERK · {post.readMinutes} MIN DE LEITURA</span><ArrowUpRight size={17}/></div></div>
    </Link>)}</div>:<div className="b3-card" style={{marginTop:20,textAlign:'center'}}>Nenhum artigo encontrado. Experimente outra categoria ou termo.</div>}
   {limit<filtered.length&&<div className="b3-pagination"><button onClick={()=>setLimit(v=>v+6)}>CARREGAR MAIS ARTIGOS ↓</button></div>}
  </section>
 </div>
}