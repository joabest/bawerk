'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

type PublicLinkProps = ComponentProps<typeof Link>

/** Keep both copies independent: /site3/* remains a preview and root URLs serve the promoted site. */
export default function PublicLink({ href, ...props }: PublicLinkProps) {
  const pathname = usePathname()
  const mainSite = !pathname.startsWith('/site3')
  const mappedHref = mainSite && typeof href === 'string' && href.startsWith('/site3') &&
    (href.length === 6 || href[6] === '/' || href[6] === '#')
    ? (href.slice(6) || '/')
    : href
  return <Link href={mappedHref} {...props} />
}
