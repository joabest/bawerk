import type { Metadata } from 'next'
import ContactClient from '../site3/contato/ContactClient'
export const metadata: Metadata = { title: 'Contato | Bawerk Solutions', description: 'Entre em contato com a Bawerk para solicitar orçamento de software, sites, CRM ou automação.', alternates: { canonical: 'https://bawerk.solutions/contato' } }
export default function Page() { return <ContactClient /> }
