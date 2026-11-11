import type { Metadata } from 'next'
import { DM_Mono, Space_Grotesk } from 'next/font/google'
import Site3Chrome from './Site3Chrome'
import './site3-v2.css'

const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--f-mono' })
const sans = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--f-sans' })

export const metadata: Metadata = {
  title: { default: 'Bawerk Solutions | você pode ir além do que imagina', template: '%s | Bawerk Solutions' },
  description: 'Sites, sistemas, CRM, automação, marketing e design. Você pode ir além do que imagina.',
  metadataBase: new URL('https://bawerk.solutions'),
}

export default function Site3Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${mono.variable} ${sans.variable}`}><Site3Chrome>{children}</Site3Chrome></div>
}
