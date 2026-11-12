import {cookies} from "next/headers"
import {NextResponse} from "next/server"
import {COOKIE,validToken} from "@/lib/admin-auth"
import {getAllBlogPosts,saveBlogEdit} from "@/lib/blog-edits"
export const runtime="nodejs"
export const dynamic="force-dynamic"
async function authorized(){return validToken((await cookies()).get(COOKIE)?.value)}
export async function GET(){
 if(!await authorized())return NextResponse.json({error:"Não autorizado"},{status:401})
 try{return NextResponse.json({posts:await getAllBlogPosts()},{headers:{"Cache-Control":"no-store"}})}
 catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Falha ao carregar artigos"},{status:503})}
}
export async function PUT(req:Request){
 if(!await authorized())return NextResponse.json({error:"Não autorizado"},{status:401})
 try{
  if(Number(req.headers.get("content-length")||0)>800000)return NextResponse.json({error:"Artigo muito grande"},{status:413})
  const post=await saveBlogEdit(await req.json())
  return NextResponse.json({post})
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Falha ao salvar artigo"},{status:400})}
}
