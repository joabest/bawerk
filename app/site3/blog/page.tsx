import type {Metadata} from 'next'
import BlogClient from './BlogClient'
export const metadata:Metadata={title:'Blog — Ideias e tecnologia',description:'Conteúdos Bawerk sobre inteligência artificial, software, CRM, marketing e design.',alternates:{canonical:'https://bawerk.solutions/site3/blog'}}
export default function BlogPage(){return <BlogClient/>}
