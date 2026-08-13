import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { I18nProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'BAWERK SOLUTIONS | Software, websites, design e crescimento',
  description: 'Transformamos ideias em realidade digital por meio do desenvolvimento de software, websites, experiências digitais e estratégias de crescimento.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#00080b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <I18nProvider>{children}</I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
