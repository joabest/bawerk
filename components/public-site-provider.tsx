'use client'
import { usePathname } from 'next/navigation'
import Site3Chrome from '@/app/site3/Site3Chrome'

const staticPublicPages = new Set(['/', '/servicos', '/metodo', '/processo', '/projetos', '/blog', '/sobre', '/contato'])

export function PublicSiteProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const publicPage = staticPublicPages.has(pathname) || pathname.startsWith('/blog/')
  // Admin, API routes, /site3 and other experiments retain their existing layout.
  return publicPage ? <Site3Chrome>{children}</Site3Chrome> : <>{children}</>
}
