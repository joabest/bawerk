import { engineeringArticles } from './blog-engineering'
import { intelligenceArticles } from './blog-intelligence'
import { growthArticles } from './blog-growth'

export type BlogCategory = 'IA' | 'SOFTWARE' | 'APLICATIVOS' | 'CRM' | 'DESIGN' | 'MARKETING' | 'INSIGHTS'
export type BlogSection = { heading: string; paragraphs: string[] }
export type BlogPost = {
 slug: string
 title: string
 category: BlogCategory
 summary: string
 theme: string
 symbol: string
 readMinutes: number
 body: BlogSection[]
}

// Curated editorial collection: practical, original guides to Bawerk's capabilities.
// Individual posts live in category-specific modules for simpler reviews and maintenance.
export const posts: BlogPost[] = [...engineeringArticles, ...intelligenceArticles, ...growthArticles]
export const categories = ['TODOS','IA','SOFTWARE','APLICATIVOS','CRM','DESIGN','MARKETING','INSIGHTS'] as const
export const getPost = (slug: string) => posts.find(post => post.slug === slug)
export const getRelated = (post: BlogPost, count = 3) => [
 ...posts.filter(item => item.slug !== post.slug && item.category === post.category),
 ...posts.filter(item => item.slug !== post.slug && item.category !== post.category)
].slice(0, count)

export const getWordCount = (post: BlogPost) => post.body.reduce((n, section) => n + section.paragraphs.join(' ').split(' ').filter(Boolean).length, 0)
export const getReadingTime = (post: BlogPost) => Math.max(2, Math.ceil(getWordCount(post) / 175))
