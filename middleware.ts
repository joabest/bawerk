import {NextRequest,NextResponse} from "next/server"

/**
 * Temporary public-site lock requested by the site owner.
 * Administrative pages, APIs and Next.js assets remain reachable.
 * To reopen the public website, remove the middleware or set
 * BAWERK_SITE_LOCKED=false in Vercel and redeploy.
 */
export function middleware(request:NextRequest){
 const pathname=request.nextUrl.pathname
 if(process.env.BAWERK_SITE_LOCKED==="false")return NextResponse.next()
 if(pathname==="/manutencao"||pathname.startsWith("/manutencao/"))return NextResponse.next()
 if(pathname==="/admin"||pathname.startsWith("/admin/"))return NextResponse.next()
 if(pathname==="/api"||pathname.startsWith("/api/"))return NextResponse.next()
 const destination=request.nextUrl.clone()
 destination.pathname="/manutencao"
 destination.search=""
 const response=NextResponse.rewrite(destination,{status:503})
 response.headers.set("Cache-Control","no-store, max-age=0")
 response.headers.set("X-Robots-Tag","noindex, nofollow")
 return response
}

export const config={
 matcher:["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|css|js|map)$).*)"],
}
