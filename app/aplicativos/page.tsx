import type { Metadata } from 'next'
import { MobileAppsPage } from '../site3/TechServicePages'
export const metadata: Metadata = { title: 'Aplicativos para Android e iOS | Bawerk Solutions', description: 'A Bawerk Solutions desenvolve aplicativos para Android e iOS para empresas.', alternates: {canonical:'https://bawerk.solutions/aplicativos'} }
export default function Page(){return <MobileAppsPage/>}
