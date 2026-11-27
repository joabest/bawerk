import { requireAdmin } from "@/lib/require-admin"
import {NextResponse} from "next/server"
import {getAllBlogPosts,saveBlogEdit} from "@/lib/blog-edits"
export const runtime="nodejs"
export const dynamic="force-dynamic"
export async function GET(){
 const denied=await requireAdmin();if(denied)return denied;
 try{return NextResponse.json({posts:await getAllBlogPosts(true)},{headers:{"Cache-Control":"no-store"}})}
 catch(e){console.error("ADMIN_BLOG_LIST_FAILED", e instanceof Error ? e.name : "Unknown");return NextResponse.json({error:"Falha ao carregar artigos"},{status:503})}
}
export async function PUT(req:Request){
 const denied=await requireAdmin(req);if(denied)return denied;
 try{
  if(Number(req.headers.get("content-length")||0)>800000)return NextResponse.json({error:"Artigo muito grande"},{status:413})
  const post=await saveBlogEdit(await req.json())
  return NextResponse.json({post})
 }catch(e){console.error("ADMIN_BLOG_SAVE_FAILED", e instanceof Error ? e.name : "Unknown");return NextResponse.json({error:"Não foi possível salvar artigo"},{status:400})}
}
