import type { Metadata } from 'next'
import { getPost, posts } from '../../site3/blog-data'
import ArticlePage from '../../site3/blog/[slug]/page'

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  return post
    ? { title: post.title, description: post.summary, alternates: { canonical: 'https://bawerk.solutions/blog/' + slug } }
    : { title: 'Artigo não encontrado | Bawerk Solutions' }
}
export default ArticlePage
