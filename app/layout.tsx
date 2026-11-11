import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import './site3/site3-v2.css'
import { DM_Mono, Space_Grotesk } from 'next/font/google'
import { PublicSiteProvider } from '@/components/public-site-provider'
import { I18nProvider } from '@/lib/i18n'
import { ScrollEffects } from '@/components/scroll-effects'
import { TrafficTracker } from '@/components/traffic-tracker'

const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--f-mono' })
const sans = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--f-sans' })

export const metadata: Metadata = {
  title: 'Bawerk Solutions | você pode ir além do que imagina',
  description: 'Sites, softwares sob medida, CRM, automação, marketing e design. Você pode ir além do que imagina.',
  metadataBase: new URL('https://bawerk.solutions'),
  alternates: { canonical: 'https://bawerk.solutions/' },
  openGraph: {
    title: 'Bawerk Solutions | você pode ir além do que imagina',
    description: 'Desenvolvimento web, software, CRM, automação, marketing e design sob medida.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#02090D',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`bg-background font-sans text-foreground antialiased ${mono.variable} ${sans.variable}`}>
        <I18nProvider><ScrollEffects /><TrafficTracker /><PublicSiteProvider>{children}</PublicSiteProvider></I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
