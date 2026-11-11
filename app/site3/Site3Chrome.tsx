'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'

const links = [
  { label: 'Início', href: '/site3' },
  { label: 'Serviços', href: '/site3/servicos' },
  { label: 'Método', href: '/site3/metodo' },
  { label: 'Projetos', href: '/site3/projetos' },
  { label: 'Blog', href: '/site3/blog' },
  { label: 'Sobre', href: '/site3/sobre' },
  { label: 'Contato', href: '/site3/contato' },
]
const phone = 'https://wa.me/5511992779039'

function Brand() {
  return <Link className="b3-brand" href="/site3" aria-label="Bawerk Solutions — início">
    <Image src="/icon.svg" alt="" width={38} height={38} />
    <span><strong>BAWERK<span className="b3-electric">.</span></strong><small>SOLUTIONS</small></span>
  </Link>
}
export default function Site3Chrome({children}:{children:React.ReactNode}) {
  const pathname=usePathname()
  const [mobile,setMobile]=useState(false)
  const [search,setSearch]=useState(false)
  const [query,setQuery]=useState('')
  const matching=links.filter(item=>item.label.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')))
  return <div className="b3-root">
    <div className="b3-dotworld" aria-hidden="true" />
    <header className="b3-header">
      <nav className="b3-nav" aria-label="Navegação principal">
        <Brand />
        <div className="b3-nav-links">
          {links.map(item=><Link key={item.href} href={item.href}
            className={pathname===item.href || (item.href==='/site3/blog' && pathname.startsWith('/site3/blog/')) ? 'b3-active' : ''}
            aria-current={pathname===item.href ? 'page':undefined}>{item.label}</Link>)}
        </div>
        <div className="b3-header-actions">
          <button className="b3-icon-action" onClick={()=>setSearch(true)} aria-label="Pesquisar no site"><Search size={18}/></button>
          <a className="b3-contact-pill" href={phone} target="_blank" rel="noreferrer"><span className="b3-live"/> Fale conosco <ArrowUpRight size={15}/></a>
          <button className="b3-menu-toggle" onClick={()=>setMobile(v=>!v)} aria-label={mobile?'Fechar menu':'Abrir menu'} aria-expanded={mobile}>{mobile?<X size={21}/>:<Menu size={21}/>}</button>
        </div>
      </nav>
      {mobile&&<div className="b3-mobile-menu">{links.map(item=><Link key={item.href} href={item.href} onClick={()=>setMobile(false)}>{item.label} <ArrowUpRight size={16}/></Link>)}</div>}
    </header>
    <main className="b3-main">{children}</main>
    <footer className="b3-footer">
      <div className="b3-footer-top">
        <div><span className="b3-overline">[ CONTATO ]</span><h2>Toda empresa merece <em>evoluir.</em></h2><p>Bawerk Solutions — você pode ir além do que imagina.</p></div>
        <div className="b3-footer-actions">
          <a href="mailto:contato@bawerk.solutions">E-mail <ArrowUpRight size={16}/></a>
          <a href={phone} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16}/></a>
        </div>
      </div>
      <div className="b3-footer-grid">
        <div><span className="b3-overline">SERVIÇOS</span><Link href="/site3/servicos">Sites e software</Link><Link href="/site3/servicos">CRM e automação</Link><Link href="/site3/servicos">Marketing e design</Link></div>
        <div><span className="b3-overline">EMPRESA</span><Link href="/site3/sobre">Sobre a Bawerk</Link><Link href="/site3/metodo">Nosso método</Link><Link href="/site3/projetos">Projetos</Link></div>
        <div><span className="b3-overline">EXPLORAR</span><Link href="/site3/blog">Blog</Link><Link href="/site3/contato">Solicitar orçamento</Link><Link href="/site3">Voltar ao início</Link></div>
        <div className="b3-footer-location"><span className="b3-overline">LOCALIZAÇÃO</span><strong>São Paulo · Brasil</strong><p>Projetos digitais para todo o Brasil.</p></div>
      </div>
      <div className="b3-footer-bottom"><span>© {new Date().getFullYear()} BAWERK SOLUTIONS · TODOS OS DIREITOS RESERVADOS</span><span>VOCÊ PODE IR ALÉM DO QUE IMAGINA.</span></div>
    </footer>
    {search&&<div className="b3-search-mask" role="presentation" onClick={()=>setSearch(false)}><section className="b3-search-dialog" role="dialog" aria-modal="true" aria-label="Pesquisar páginas" onClick={e=>e.stopPropagation()}>
      <div className="b3-search-input"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} autoFocus placeholder="Pesquisar páginas..." aria-label="Pesquisar"/><button onClick={()=>setSearch(false)} aria-label="Fechar pesquisa"><X size={19}/></button></div>
      <div className="b3-search-list">{matching.length?matching.map(item=><Link href={item.href} key={item.href} onClick={()=>{setSearch(false);setQuery('')}}>{item.label}<ArrowUpRight size={15}/></Link>):<p>Nenhuma página encontrada.</p>}</div>
    </section></div>}
  </div>
}