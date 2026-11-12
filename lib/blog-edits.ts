import "server-only"
import { neon } from "@neondatabase/serverless"
import { posts } from "@/app/site3/blog-data"
import type { BlogPost, BlogCategory, BlogSection } from "@/app/site3/blog-data"

function db(){
 const url=process.env.DATABASE_URL || process.env.POSTGRES_URL
 if(!url)throw new Error("Banco não configurado. Configure DATABASE_URL ou POSTGRES_URL na Vercel.")
 return neon(url)
}
async function table(){
 const sql=db()
 await sql`CREATE TABLE IF NOT EXISTS bawerk_blog_edits(
   slug TEXT PRIMARY KEY,
   post JSONB NOT NULL,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
 )`
 return sql
}
function plain(value:unknown,max=1000):string{
 return typeof value==="string"?value.trim().slice(0,max):""
}
export function validateBlogEdit(input:unknown):BlogPost{
 if(!input||typeof input!=="object")throw new Error("Dados inválidos.")
 const data=input as Record<string,unknown>
 const slug=plain(data.slug,180)
 const original=posts.find(p=>p.slug===slug)
 if(!original)throw new Error("Artigo original não encontrado.")
 const title=plain(data.title,180),summary=plain(data.summary,600)
 const category=plain(data.category,24) as BlogCategory
 const categories=["IA","SOFTWARE","APLICATIVOS","CRM","DESIGN","MARKETING","INSIGHTS"]
 if(title.length<8||summary.length<20||!categories.includes(category))throw new Error("Preencha título, resumo e categoria válidos.")
 if(!Array.isArray(data.body)||data.body.length<1||data.body.length>25)throw new Error("Adicione pelo menos uma seção ao artigo.")
 const body:BlogSection[]=data.body.map((section:unknown)=>{
  if(!section||typeof section!=="object")throw new Error("Seção inválida.")
  const s=section as Record<string,unknown>
  const heading=plain(s.heading,180)
  if(!heading||!Array.isArray(s.paragraphs)||s.paragraphs.length<1||s.paragraphs.length>20)throw new Error("Seções precisam de título e parágrafos.")
  const paragraphs=s.paragraphs.map(p=>plain(p,12000)).filter(Boolean)
  if(!paragraphs.length)throw new Error("Seção sem parágrafos.")
  return {heading,paragraphs}
 })
 return {...original,title,summary,category,body}
}
export async function getAllBlogPosts():Promise<BlogPost[]>{
 const sql=await table()
 const rows=await sql`SELECT slug,post FROM bawerk_blog_edits`
 const overrides=new Map<string,BlogPost>()
 for(const row of rows){
  const original=posts.find(p=>p.slug===String(row.slug))
  if(original&&row.post&&typeof row.post==="object")
    overrides.set(original.slug,{...original,...(row.post as object),slug:original.slug} as BlogPost)
 }
 return posts.map(p=>overrides.get(p.slug)||p)
}
export async function getBlogPost(slug:string):Promise<BlogPost|undefined>{
 const original=posts.find(p=>p.slug===slug)
 if(!original)return undefined
 try{
  const sql=await table()
  const rows=await sql`SELECT post FROM bawerk_blog_edits WHERE slug=${slug} LIMIT 1`
  return rows[0]?.post?{...original,...(rows[0].post as object),slug:original.slug} as BlogPost:original
 }catch{return original}
}
export async function saveBlogEdit(input:unknown):Promise<BlogPost>{
 const post=validateBlogEdit(input)
 const sql=await table()
 await sql`INSERT INTO bawerk_blog_edits(slug,post,updated_at)
   VALUES(${post.slug},${JSON.stringify(post)}::jsonb,now())
   ON CONFLICT(slug) DO UPDATE SET post=EXCLUDED.post,updated_at=now()`
 return post
}
