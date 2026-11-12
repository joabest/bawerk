import type { Metadata } from 'next'
import { CustomSoftwarePage } from '../TechServicePages'
export const metadata: Metadata = { title: 'Softwares personalizados | Bawerk Solutions', description: 'A Bawerk Solutions desenvolve softwares sob medida e sistemas empresariais para empresas.', alternates: {canonical:'https://bawerk.solutions/site3/softwares'} }
export default function Page(){return <CustomSoftwarePage/>}
