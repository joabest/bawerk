import type { Metadata } from 'next'
import { ProjectsPage } from '../site3/StaticPages'
export const metadata: Metadata = { title: 'Projetos | Bawerk Solutions', description: 'Soluções e experiências digitais desenvolvidas pela Bawerk Solutions.', alternates: { canonical: 'https://bawerk.solutions/projetos' } }
export default function Page() { return <ProjectsPage /> }
