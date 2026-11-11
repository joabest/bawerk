import type { Metadata } from 'next'
import { MethodPage } from '../site3/StaticPages'

export const metadata: Metadata = {
  title: 'Método | Bawerk Solutions',
  description: 'As quatro etapas de desenvolvimento da Bawerk Solutions: descobrir, planejar, desenvolver e evoluir.',
  alternates: { canonical: 'https://bawerk.solutions/metodo' },
}

export default function Page() { return <MethodPage /> }
