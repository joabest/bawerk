import type {Metadata} from 'next'
import ContactClient from './ContactClient'
export const metadata:Metadata={title:'Contato — Solicite um projeto',description:'Fale com a Bawerk Solutions sobre desenvolvimento web, software, CRM, automação, marketing ou design.',alternates:{canonical:'https://bawerk.solutions/site3/contato'}}
export default function Contact(){return <ContactClient/>}
