import type { Metadata } from 'next'
import Site3Client from './Site3Client'
import './site3.css'

export const metadata: Metadata = {
  title: 'BAWERK — Your Tech Partner | Site 3',
  description: 'Bawerk Solutions. Bespoke software, digital experiences, intelligent automation and systems designed to move business forward.',
  alternates: { canonical: 'https://bawerk.solutions/site3/' },
  openGraph: { title: 'BAWERK — Your Tech Partner', description: 'You can go beyond what you imagine. Technology built to evolve with you.', type: 'website', url: 'https://bawerk.solutions/site3/' },
}

export default function Site3Page() {
  return <Site3Client />
}