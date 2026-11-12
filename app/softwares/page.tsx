import type { Metadata } from 'next'
import { CustomSoftwarePage } from '../site3/TechServicePages'
export const metadata: Metadata = { title: 'Softwares personalizados | Bawerk Solutions', description: 'A Bawerk Solutions desenvolve softwares sob medida e sistemas empresariais para empresas.', alternates: {canonical:'https://bawerk.solutions/softwares'} }
export default function Page(){return <CustomSoftwarePage/>}
