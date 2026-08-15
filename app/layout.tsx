import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { I18nProvider } from '@/lib/i18n'
import { ScrollEffects } from '@/components/scroll-effects'

export const metadata: Metadata = {
  title: 'BAWERK SOLUTIONS | Software, APIs e experiências digitais',
  description: 'A Bawerk Solutions desenvolve softwares, websites, APIs personalizadas, integrações, automações e experiências digitais criadas para cada empresa.',
  openGraph: {
    title: 'BAWERK SOLUTIONS | Software, APIs e experiências digitais',
    description: 'Software, websites, APIs personalizadas, integrações e experiências digitais sob medida.',
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
      <body className="bg-background font-sans text-foreground antialiased">
        <I18nProvider><ScrollEffects />{children}</I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
