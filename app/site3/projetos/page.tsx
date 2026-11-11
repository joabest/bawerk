import type {Metadata} from 'next'
import {ProjectsPage} from '../StaticPages'
export const metadata:Metadata={title:'Projetos',alternates:{canonical:'https://bawerk.solutions/site3/projetos'}}
export default function Page(){return <ProjectsPage/>}
