import type { Metadata } from 'next'
import { ServicesPage } from '../site3/StaticPages'
export const metadata: Metadata = { title: 'Serviços | Bawerk Solutions', description: 'Desenvolvimento web, software, CRM, automação, marketing e design para empresas.', alternates: { canonical: 'https://bawerk.solutions/servicos' } }
export default function Page() { return <ServicesPage /> }
