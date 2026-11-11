import type { Metadata } from 'next'
import HomeClient from './site3/HomeClient'
export const metadata: Metadata = {
  title: 'Bawerk Solutions | você pode ir além do que imagina',
  description: 'Sites, software sob medida, CRM, automação, marketing e design. Tecnologia e criatividade para ir além.',
  alternates: { canonical: 'https://bawerk.solutions/' },
}
export default function Page() { return <HomeClient /> }
