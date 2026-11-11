import type { Metadata } from 'next'
import Site3Client from './Site3Client'
import './site3.css'

export const metadata: Metadata = {
  title: 'BAWERK SOLUTIONS — Sua parceira tecnológica',
  description: 'A Bawerk Solutions desenvolve sites, softwares sob medida, experiências digitais, CRM, APIs e automações inteligentes para impulsionar empresas.',
  alternates: { canonical: 'https://bawerk.solutions/site3/' },
  openGraph: { title: 'BAWERK SOLUTIONS — Sua parceira tecnológica', description: 'Você pode ir além do que imagina. Tecnologia criada para evoluir junto com seu negócio.', type: 'website', url: 'https://bawerk.solutions/site3/' },
}

export default function Site3Page() {
  return <Site3Client />
}