import { Navbar } from "@/components/navbar"

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-[#4169E1]">Bawerk Solutions</span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
        <p className="mt-5 max-w-lg text-base opacity-75">Em breve, novidades, dicas e conteúdos sobre tecnologia.</p>
        <a href="/" className="mt-8 rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Voltar ao início</a>
      </section>
    </main>
  )
}
