import {cookies} from "next/headers"
import {NextResponse} from "next/server"
import {COOKIE,validToken} from "@/lib/admin-auth"
import {getAllBlogPosts,saveBlogEdit} from "@/lib/blog-edits"
export const runtime="nodejs"
export const dynamic="force-dynamic"
async function authorized(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){
 if(!await authorized())return NextResponse.json({error:"Não autorizado"},{status:401})
 try{return NextResponse.json({posts:await getAllBlogPosts(true)},{headers:{"Cache-Control":"no-store"}})}
 catch(e){console.error("ADMIN_BLOG_LIST_FAILED", e instanceof Error ? e.name : "Unknown");return NextResponse.json({error:"Falha ao carregar artigos"},{status:503})}
}
export async function PUT(req:Request){
 if(!await authorized())return NextResponse.json({error:"Não autorizado"},{status:401})
 try{
  if(Number(req.headers.get("content-length")||0)>800000)return NextResponse.json({error:"Artigo muito grande"},{status:413})
  const post=await saveBlogEdit(await req.json())
  return NextResponse.json({post})
 }catch(e){console.error("ADMIN_BLOG_SAVE_FAILED", e instanceof Error ? e.name : "Unknown");return NextResponse.json({error:"Não foi possível salvar artigo"},{status:400})}
}
