import type { Metadata } from 'next'
import Link from '../../PublicLink'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock3, Layers3, Share2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPost, getRelated, posts } from '../../blog-data'
import { BlogThumbnail } from '../BlogClient'

type Props = { params: Promise<{ slug: string }> }
const sectionId = (heading: string) => heading.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const wordCount = (body: { heading: string; paragraphs: string[] }[]) => body.reduce((count, section) => count + section.paragraphs.join(' ').split(/\s+/).filter(Boolean).length, 0)
export function estimateMinutes(post: { body: { heading: string; paragraphs: string[] }[] }) {
 return Math.max(2, Math.ceil(wordCount(post.body) / 175))
}
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const {slug} = await params
 const post = getPost(slug)
 if (!post) return { title:'Artigo não encontrado' }
 const url = 'https://bawerk.solutions/blog/' + slug
 return {
  title:post.title,
  description:post.summary,
  alternates:{canonical:url},
  openGraph:{type:'article',locale:'pt_BR',siteName:'Bawerk Solutions',title:post.title,description:post.summary,url},
  twitter:{card:'summary',title:post.title,description:post.summary},
 }
}
export default async function ArticlePage({ params }: Props) {
 const { slug } = await params
 const post = getPost(slug)
 if (!post) notFound()
 const related = getRelated(post)
 const current = posts.findIndex(item => item.slug === slug)
 const next = posts[(current + 1) % posts.length]
 const schema = {
  '@context':'https://schema.org',
  '@type':'BlogPosting',
  headline:post.title,
  description:post.summary,
  inLanguage:'pt-BR',
  datePublished:'2026-11-12',
  author:{'@type':'Organization',name:'Bawerk Solutions',url:'https://bawerk.solutions/'},
  publisher:{'@type':'Organization',name:'Bawerk Solutions',url:'https://bawerk.solutions/'},
  mainEntityOfPage:'https://bawerk.solutions/blog/' + slug,
  articleSection:post.category,
  wordCount:wordCount(post.body),
 }
 return <div className="b3-container b3-article-layout">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <article className="b3-article b3-article-v2">
   <div className="b3-article-navigation">
    <Link className="b3-back" href="/site3/blog"><ArrowLeft size={15}/> VOLTAR AO BLOG</Link>
    <span className="b3-overline">{post.category} / {estimateMinutes(post)} MIN DE LEITURA</span>
   </div>
   <header className="b3-article-head">
    <div className="b3-article-kicker"><span>ARTIGO / BAWERK SOLUTIONS</span><span>CONTEÚDO TÉCNICO E DE NEGÓCIOS</span></div>
    <h1>{post.title}</h1>
    <p>{post.summary}</p>
    <div className="b3-article-byline"><span className="b3-article-author-icon">B.</span><span><strong>Equipe Bawerk Solutions</strong><small>Engenharia digital · Brasil</small></span><span className="b3-article-readtime"><Clock3 size={15}/>{estimateMinutes(post)} min</span></div>
   </header>
   <BlogThumbnail post={post}/>
   <div className="b3-article-workspace">
    <aside className="b3-article-toc" aria-label="Sumário do artigo">
     <span className="b3-overline"><BookOpen size={13}/> NESTE ARTIGO</span>
     <nav>{post.body.map((section,i)=><a href={'#'+sectionId(section.heading)} key={section.heading}><span>{String(i+1).padStart(2,'0')}</span>{section.heading}</a>)}</nav>
     <Link className="b3-article-aside-cta" href="/site3/contato">Precisa de um projeto?<ArrowUpRight size={15}/></Link>
    </aside>
    <div className="b3-article-content">
     <div className="b3-article-intro"><span className="b3-overline">[ VISÃO GERAL ]</span><p>{post.summary} A seguir, veja os pontos que realmente merecem atenção, os riscos mais comuns e as decisões que ajudam a transformar a ideia em um projeto bem definido.</p></div>
     {post.body.map((section,i)=><section key={section.heading} id={sectionId(section.heading)} className="b3-article-section"><span className="b3-overline">[{String(i+1).padStart(2,'0')} / {String(post.body.length).padStart(2,'0')}]</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph,j)=><p key={j}>{paragraph}</p>)}</section>)}
     <div className="b3-article-conclusion">
      <span className="b3-overline">[ PRÓXIMO PASSO ]</span>
      <h2>Vamos transformar isso<br/><span className="b3-electric">em uma solução real<span className="b3-dot-white">.</span></span></h2>
      <p>A Bawerk Solutions desenvolve sites, softwares sob medida, aplicativos para Android e iOS, CRM e automações. Conte seu desafio para avaliarmos o escopo adequado.</p>
      <Link className="b3-primary" href="/site3/contato">Conversar sobre meu projeto <ArrowUpRight size={17}/></Link>
     </div>
    </div>
   </div>
   <div className="b3-article-next"><span className="b3-overline">[ CONTINUE EXPLORANDO ]</span><Link href={'/site3/blog/'+next.slug}>PRÓXIMA LEITURA <ArrowRight size={16}/><strong>{next.title}</strong></Link></div>
  </article>
  <section className="b3-related">
   <div className="b3-section-top"><span className="b3-overline">[ CONHECIMENTO APLICADO ]</span><Link href="/site3/blog" className="b3-forward">Todos os artigos <ArrowUpRight size={15}/></Link></div>
   <h2>Continue explorando<span className="b3-dot-blue">.</span></h2>
   <div className="b3-blog-grid">{related.map(item=><Link key={item.slug} href={'/site3/blog/'+item.slug} className="b3-blog-card"><BlogThumbnail post={item}/><div className="b3-blog-card-body"><span className="b3-card-index">{item.category}</span><h3>{item.title}</h3><p>{item.summary}</p><div className="b3-blog-card-foot"><span>BAWERK · {estimateMinutes(item)} MIN</span><ArrowUpRight size={17}/></div></div></Link>)}</div>
  </section>
 </div>
}
