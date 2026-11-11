import type { Metadata } from 'next'
import { AboutPage } from '../site3/StaticPages'
export const metadata: Metadata = { title: 'Sobre | Bawerk Solutions', description: 'Conheça a Bawerk Solutions e nossa visão de tecnologia, design e estratégia.', alternates: { canonical: 'https://bawerk.solutions/sobre' } }
export default function Page() { return <AboutPage /> }
