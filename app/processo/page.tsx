import type { Metadata } from 'next'
import { MethodPage } from '../site3/StaticPages'
export const metadata: Metadata = { title: 'Processo | Bawerk Solutions', alternates: { canonical: 'https://bawerk.solutions/metodo' } }
export default function Page() { return <MethodPage /> }
