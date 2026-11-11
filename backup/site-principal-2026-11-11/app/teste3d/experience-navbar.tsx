"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Activity, ArrowUpRight, Boxes, ChevronDown, Code2, Cpu, Globe2, Layers, Menu, Network, ShieldCheck, Sparkles, Workflow, X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const EN = {
  capabilities: "CAPABILITIES", industries: "INDUSTRIES", cases: "PROJECTS",
  manifesto: "ABOUT", cta: "START A PROJECT", diagnostic: "TALK TO AN EXPERT",
  mobile: "NAVIGATION", services: [
    ["Software Engineering", "Custom corporate systems and digital products."],
    ["Intelligent Automation", "Connected workflows and operational efficiency."],
    ["APIs & Connectivity", "Integrations built for your ecosystem."],
    ["Digital Experiences", "Fast, immersive and accessible interfaces."],
  ],
  sectors: [
    ["Financial Technology", "Scalable systems and integrations."],
    ["Logistics & Operations", "Connected processes and automation."],
    ["Healthcare Technology", "Digital journeys and information workflows."],
  ],
}
const PT = {
  capabilities: "CAPACIDADES", industries: "INDÚSTRIAS", cases: "PROJETOS",
  manifesto: "SOBRE", cta: "INICIAR PROJETO", diagnostic: "FALAR COM ESPECIALISTA",
  mobile: "NAVEGAÇÃO", services: [
    ["Engenharia de Software", "Sistemas corporativos e produtos sob medida."],
    ["Automações Inteligentes", "Fluxos conectados e eficiência operacional."],
    ["APIs & Conectividade", "Integrações desenhadas para seu ecossistema."],
    ["Experiências Digitais", "Interfaces imersivas, rápidas e acessíveis."],
  ],
  sectors: [
    ["Tecnologia Financeira", "Sistemas e integrações escaláveis."],
    ["Logística & Operações", "Processos conectados e automação."],
    ["Tecnologia para Saúde", "Jornadas digitais e fluxos de informação."],
  ],
}
const capabilities = [
  { href: "/servicos", Icon: Cpu },
  { href: "#automacoes", Icon: Workflow },
  { href: "#conectividade", Icon: Network },
  { href: "/servicos", Icon: Layers },
]
const industries = [
  { href: "/projetos", Icon: ShieldCheck },
  { href: "/projetos", Icon: Boxes },
  { href: "/projetos", Icon: Activity },
]

export default function ExperienceNavbar() {
  const { language, setLanguage } = useI18n()
  const copy = language === "en" ? EN : PT
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<"capabilities" | "industries" | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onEscape)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onEscape)
    }
  }, [open])

  useEffect(() => {
    const onOutside = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setActive(null)
    }
    document.addEventListener("pointerdown", onOutside)
    return () => document.removeEventListener("pointerdown", onOutside)
  }, [])

  const closeMobile = () => setOpen(false)
  const toggle = (name: "capabilities" | "industries") => setActive(current => current === name ? null : name)

  return (
    <header className={`bw3d-header ${scrolled || open ? "bw3d-header-scrolled" : ""}`} ref={navRef}>
      <div className="bw3d-header-inner">
        <Link href="/" className="bw3d-wordmark" aria-label="Bawerk Solutions — início">
          BAWERK<span>.</span><small>SOLUTIONS</small>
        </Link>

        <nav className="bw3d-desktop-menu" aria-label={language === "en" ? "Main navigation" : "Menu principal"}>
          <div className="bw3d-menu-group" onMouseEnter={() => setActive("capabilities")} onMouseLeave={() => setActive(null)}>
            <button type="button" aria-haspopup="true" aria-expanded={active === "capabilities"} onClick={() => toggle("capabilities")}>
              01 // {copy.capabilities} <ChevronDown size={14} className={active === "capabilities" ? "bw3d-chevron-open" : ""} />
            </button>
            {active === "capabilities" && (
              <div className="bw3d-megamenu bw3d-megamenu-wide">
                {capabilities.map(({ href, Icon }, i) => (
                  <Link key={i} href={href} onClick={() => setActive(null)} className="bw3d-megamenu-entry">
                    <Icon size={19} />
                    <span><strong>{copy.services[i][0]}</strong><small>{copy.services[i][1]}</small></span>
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="bw3d-menu-group" onMouseEnter={() => setActive("industries")} onMouseLeave={() => setActive(null)}>
            <button type="button" aria-haspopup="true" aria-expanded={active === "industries"} onClick={() => toggle("industries")}>
              02 // {copy.industries} <ChevronDown size={14} className={active === "industries" ? "bw3d-chevron-open" : ""} />
            </button>
            {active === "industries" && (
              <div className="bw3d-megamenu bw3d-megamenu-sectors">
                {industries.map(({ href, Icon }, i) => (
                  <Link key={i} href={href} onClick={() => setActive(null)} className="bw3d-megamenu-entry">
                    <Icon size={19} />
                    <span><strong>{copy.sectors[i][0]}</strong><small>{copy.sectors[i][1]}</small></span>
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/projetos">03 // {copy.cases}</Link>
          <Link href="/sobre">04 // {copy.manifesto}</Link>
        </nav>

        <div className="bw3d-header-actions">
          <button className="bw3d-lang" type="button" onClick={() => setLanguage(language === "en" ? "pt-BR" : "en")} aria-label={language === "en" ? "Mudar para português" : "Switch to English"}>
            <Globe2 size={15} /> {language === "en" ? "EN" : "PT"}
          </button>
          <Link className="bw3d-nav-cta" href="/contato">{copy.cta} <ArrowUpRight size={15} /></Link>
          <button type="button" className="bw3d-mobile-trigger" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="bw3d-mobile-menu" onClick={() => { setOpen(v => !v); setActive(null) }}>
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="bw3d-mobile-drawer" id="bw3d-mobile-menu">
          <div className="bw3d-mobile-top">
            <span>// {copy.mobile}</span>
            <div className="bw3d-mobile-links">
              <a href="#conectividade" onClick={closeMobile}>01 // {copy.capabilities} <ArrowUpRight size={18}/></a>
              <a href="#automacoes" onClick={closeMobile}>02 // {language === "en" ? "AUTOMATION" : "AUTOMAÇÕES"} <ArrowUpRight size={18}/></a>
              <Link href="/projetos" onClick={closeMobile}>03 // {copy.cases} <ArrowUpRight size={18}/></Link>
              <Link href="/sobre" onClick={closeMobile}>04 // {copy.manifesto} <ArrowUpRight size={18}/></Link>
            </div>
            <span className="bw3d-mobile-caption">{language === "en" ? "MORE SOLUTIONS" : "OUTRAS SOLUÇÕES"}</span>
            <div className="bw3d-mobile-categories">
              <Link href="/servicos" onClick={closeMobile}><Code2 size={15} /> {copy.services[0][0]}</Link>
              <Link href="/apis" onClick={closeMobile}><Network size={15} /> {copy.services[2][0]}</Link>
              <Link href="/servicos" onClick={closeMobile}><Sparkles size={15} /> {copy.services[3][0]}</Link>
            </div>
          </div>
          <div className="bw3d-mobile-bottom">
            <Link href="/contato" onClick={closeMobile}>{copy.diagnostic} <ArrowUpRight size={18}/></Link>
            <small>BAWERK SOLUTIONS // 2026</small>
          </div>
        </div>
      )}
    </header>
  )
}
