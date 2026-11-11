import type { Metadata } from 'next'
import BlogClient from '../site3/blog/BlogClient'
export const metadata: Metadata = { title: 'Blog | Bawerk Solutions', description: 'Artigos sobre tecnologia, inteligência artificial, software, CRM, marketing e design.', alternates: { canonical: 'https://bawerk.solutions/blog' } }
export default function Page() { return <BlogClient /> }
