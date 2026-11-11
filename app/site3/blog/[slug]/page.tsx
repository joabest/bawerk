import type {Metadata} from 'next'
import Link from '../../PublicLink'
import {ArrowLeft,ArrowUpRight} from 'lucide-react'
import {notFound} from 'next/navigation'
import {getPost,posts} from '../../blog-data'
import {BlogThumbnail} from '../BlogClient'

type Props={params:Promise<{slug:string}>}
export function generateStaticParams(){return posts.map(post=>({slug:post.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params
 const post=getPost(slug)
 if(!post)return {title:'Artigo não encontrado'}
 return {title:post.title,description:post.summary,alternates:{canonical:'https://bawerk.solutions/site3/blog/'+slug}}
}
export default async function ArticlePage({params}:Props){
 const {slug}=await params
 const post=getPost(slug)
 if(!post)notFound()
 return <div className="b3-container"><article className="b3-article">
   <Link className="b3-back" href="/site3/blog"><ArrowLeft size={14} style={{display:'inline',marginRight:9}}/> VOLTAR AO BLOG</Link>
   <header className="b3-article-head" style={{marginTop:40}}>
    <span className="b3-overline">[ {post.category} / BAWERK SOLUTIONS ] · {post.readMinutes} MIN DE LEITURA</span>
    <h1>{post.title}</h1><p>{post.summary}</p>
   </header>
   <BlogThumbnail post={post}/>
   <div className="b3-article-content">{post.body.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}</div>
   <div className="b3-cta-row"><Link className="b3-primary" href="/site3/contato">Converse sobre seu projeto <ArrowUpRight size={16}/></Link><Link className="b3-secondary" href="/site3/blog">Mais artigos <ArrowUpRight size={16}/></Link></div>
 </article></div>
}
