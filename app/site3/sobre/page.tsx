import type {Metadata} from 'next'
import {AboutPage} from '../StaticPages'
export const metadata:Metadata={title:'Sobre',alternates:{canonical:'https://bawerk.solutions/site3/sobre'}}
export default function Page(){return <AboutPage/>}
