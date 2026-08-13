"use client"

import { useI18n } from "@/lib/i18n"
import { BawerkLogo } from "./xbow-logo"

export function Navbar() {
  const { t, language, setLanguage } = useI18n()
  const items = [[t.nav.services,"#servicos"],[t.nav.projects,"#projetos"],[t.nav.about,"#sobre"],[t.nav.faq,"#faq"]]
  return <header className="fixed inset-x-0 top-4 z-50 px-4"><nav aria-label={t.nav.home} className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-xl border border-border bg-[#f7fafc] px-4 py-3 text-[#00080b] shadow-lg">
    <a href="#inicio" aria-label={t.nav.home}><BawerkLogo className="h-5 text-[#00080b]" /></a>
    <ul className="hidden items-center gap-6 font-mono text-sm md:flex">{items.map(([label,href])=><li key={href}><a className="transition-opacity hover:opacity-60" href={href}>{label}</a></li>)}</ul>
    <div className="flex items-center gap-3"><div aria-label={t.nav.language} className="flex items-center gap-1 font-mono text-xs"><button aria-pressed={language==="pt-BR"} className={language==="pt-BR"?"font-bold text-primary":"opacity-50 hover:opacity-100"} onClick={()=>setLanguage("pt-BR")}>PT</button><span aria-hidden>|</span><button aria-pressed={language==="en"} className={language==="en"?"font-bold text-primary":"opacity-50 hover:opacity-100"} onClick={()=>setLanguage("en")}>EN</button></div><a href="#contato" className="rounded-md bg-[#00080b] px-3 py-2 font-mono text-xs text-[#f0f6fa] transition-transform hover:-translate-y-0.5 sm:text-sm">{t.nav.cta}</a></div>
  </nav></header>
}
