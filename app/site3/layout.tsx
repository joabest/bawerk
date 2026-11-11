import type { Metadata } from 'next'
import Site3Chrome from './Site3Chrome'
import './site3-v2.css'

export const metadata: Metadata = {
  title: { default: 'Bawerk Solutions | você pode ir além do que imagina', template: '%s | Bawerk Solutions' },
  description: 'Sites, sistemas, CRM, automação, marketing e design. Você pode ir além do que imagina.',
  metadataBase: new URL('https://bawerk.solutions'),
}

export default function Site3Layout({children}:{children:React.ReactNode}) {
  return <Site3Chrome>{children}</Site3Chrome>
}