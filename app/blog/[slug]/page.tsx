import type { Metadata } from 'next'
import { posts } from '../../site3/blog-data'
import {getBlogPost} from '@/lib/blog-edits'
import ArticlePage from '../../site3/blog/[slug]/page'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  return post
    ? { title: post.title, description: post.summary, alternates: { canonical: 'https://bawerk.solutions/blog/' + slug } }
    : { title: 'Artigo não encontrado | Bawerk Solutions' }
}
export default ArticlePage
