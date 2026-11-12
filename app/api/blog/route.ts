import {NextResponse} from "next/server"
import {getAllBlogPosts} from "@/lib/blog-edits"
import {posts} from "@/app/site3/blog-data"
export const runtime="nodejs"
export const dynamic="force-dynamic"
export async function GET(){
 try{return NextResponse.json({posts:await getAllBlogPosts()},{headers:{"Cache-Control":"no-store"}})}
 catch{return NextResponse.json({posts},{headers:{"Cache-Control":"no-store"}})}
}
