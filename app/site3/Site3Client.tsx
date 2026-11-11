'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Code2, Command, Cpu, Globe2, Layers3, Mail, Menu, MoveUpRight, MousePointer2, Search, Send, ShieldCheck, Sparkles, X, Zap } from 'lucide-react'

const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false, loading: () => <div className="site3-globe-loading"><span className="site3-loading-ring" /><span>INICIANDO REDE GLOBAL</span></div> })
const WHATSAPP = 'https://wa.me/5511992779039'
const CONTACT_EMAIL = 'contato@bawerk.solutions'
type MenuName = 'services' | 'tools' | 'more'
type Location = { city: string; latitude: number; longitude: number }
type Choice = 'accepted' | 'rejected' | null

const services = [
  { id: 'web', index: '01', category: 'EXPERIÊNCIAS DIGITAIS', title: 'Desenvolvimento web', description: 'Sites de alto desempenho e experiências digitais criadas para impressionar.', tags: ['Next.js', '3D / WebGL', 'UX/UI'], art: 'web', symbol: '◈' },
  { id: 'software', index: '02', category: 'ENGENHARIA', title: 'Software sob medida', description: 'Plataformas personalizadas que simplificam processos complexos.', tags: ['SaaS', 'Plataformas', 'APIs'], art: 'software', symbol: '⌘' },
  { id: 'automation', index: '03', category: 'INTELIGÊNCIA', title: 'IA e automação', description: 'Fluxos inteligentes que liberam sua equipe para o que realmente importa.', tags: ['Agentes de IA', 'Fluxos de trabalho', 'Integrações'], art: 'automation', symbol: '✳' },
  { id: 'crm', index: '04', category: 'SISTEMAS EMPRESARIAIS', title: 'CRM e operações', description: 'Conversas, leads e operações reunidos em um só lugar.', tags: ['CRM', 'Painéis', 'Análises'], art: 'crm', symbol: '◎' },
  { id: 'cloud', index: '05', category: 'INFRAESTRUTURA', title: 'Nuvem e APIs', description: 'Infraestrutura confiável que conecta ferramentas, dados e oportunidades.', tags: ['Nuvem', 'Bancos de dados', 'Segurança'], art: 'cloud', symbol: '▦' },
  { id: 'design', index: '06', category: 'SOLUÇÕES CRIATIVAS', title: 'Marca e design', description: 'Identidades marcantes e interfaces em que cada detalhe tem propósito.', tags: ['Identidade visual', 'Animação', 'Design'], art: 'design', symbol: '✦' },
]
const friction = [
  { label: 'meu site fica cada vez mais lento', count: '01', insight: 'Infraestrutura mais rápida, Core Web Vitals monitorados e uma experiência pronta para crescer.', service: 'web' },
  { label: 'os leads somem antes de chegar às vendas', count: '02', insight: 'Integre formulários, etapas comerciais e notificações em um CRM completo.', service: 'crm' },
  { label: 'minha equipe faz tudo manualmente', count: '03', insight: 'Automatize tarefas repetitivas e conecte os sistemas que sua equipe já utiliza.', service: 'automation' },
  { label: 'nossos sistemas não se comunicam', count: '04', insight: 'Crie APIs e integrações seguras para conectar toda a operação.', service: 'cloud' },
  { label: 'temos uma ideia, mas não um produto', count: '05', insight: 'Transforme a estratégia do produto em uma plataforma testada e pronta para lançar.', service: 'software' },
  { label: 'nossa marca parece igual às outras', count: '06', insight: 'Crie uma identidade visual própria, com design, movimento e comunicação consistente.', service: 'design' },
]
const searches = [
  { title: 'Desenvolvimento web', label: 'SERVIÇO', href: '#services' },
  { title: 'Software sob medida', label: 'SERVIÇO', href: '#services' },
  { title: 'IA e automação', label: 'SERVIÇO', href: '#services' },
  { title: 'CRM e operações', label: 'SERVIÇO', href: '#services' },
  { title: 'Como trabalhamos', label: 'PROCESSO', href: '#method' },
  { title: 'Soluções selecionadas', label: 'PROJETOS', href: '#work' },
  { title: 'Planeje seu projeto', label: 'FERRAMENTA', href: '#tools' },
  { title: 'Fale com nossa equipe', label: 'CONTATO', href: '#contact' },
]
const navigation = [{ label: 'Serviços', id: 'services', menu: 'services' as MenuName }, { label: 'Método', id: 'method' }, { label: 'Projetos', id: 'work' }, { label: 'Ferramentas', id: 'tools', menu: 'tools' as MenuName }, { label: 'Mais', id: 'about', menu: 'more' as MenuName }, { label: 'Contato', id: 'contact' }]

function Logo() {
  return <a className="site3-logo" href="#top" aria-label="Bawerk Solutions, página inicial">
    <svg viewBox="0 0 42 42" width="35" height="35" aria-hidden="true"><path d="M7 5h12l-6 12h13l5-12h7L28 27H15l-5 10H2L16 8H9z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M25 9h8" stroke="#129bff" strokeWidth="3.5" strokeLinecap="round" /></svg>
    <span className="site3-logo-type"><strong>BAWERK<span className="site3-blue">.</span></strong><small>SOLUTIONS / ENGENHARIA DIGITAL</small></span>
  </a>
}
function ServiceArt({ variant, large = false }: { variant: string; large?: boolean }) {
  return <div className={`site3-service-art site3-art-${variant}${large ? ' site3-art-large' : ''}`} aria-hidden="true">
    <div className="site3-art-grid" /><div className="site3-art-haze" />
    <div className="site3-art-figure"><i /><i /><i /><i /></div>
    <span className="site3-art-corner top">+ 0{variant.length}.128</span><span className="site3-art-corner bottom">BAWERK // LAB</span>
  </div>
}
function Chip({ children }: { children: React.ReactNode }) { return <span className="site3-chip">{children}</span> }
function ArrowLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) { return <a className={`site3-arrow-link ${light ? 'site3-arrow-link-light' : ''}`} href={href}>{children}<ArrowUpRight size={15}/></a> }

export default function Site3Client() {
  const root = useRef<HTMLElement>(null)
  const [menu, setMenu] = useState<MenuName | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [choice, setChoice] = useState<Choice>(null)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)
  const [selectedFriction, setSelectedFriction] = useState(1)
  const [activeService, setActiveService] = useState('web')
  const [briefServices, setBriefServices] = useState<string[]>(['web'])
  const [brief, setBrief] = useState('')
  const [scrollPercent, setScrollPercent] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [clocks, setClocks] = useState(['--:--', '--:--', '--:--'])
  const selectedService = services.find(s => s.id === activeService) || services[0]
  const filteredSearch = useMemo(() => searches.filter(item => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 7), [query])

  useEffect(() => {
    try { const saved = localStorage.getItem('bawerk-site3-preferences'); if (saved === 'accepted' || saved === 'rejected') setChoice(saved) } catch { /* blocked local storage */ }
    setPreferencesLoaded(true)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduceMotion(motion.matches)
    updateMotion(); motion.addEventListener('change', updateMotion)
    return () => motion.removeEventListener('change', updateMotion)
  }, [])

  useEffect(() => {
    if (choice !== 'accepted') { setLocation(null); return }
    const controller = new AbortController()
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(r => { if (!r.ok) throw Error('Serviço de localização indisponível'); return r.json() })
      .then(data => {
        const latitude = Number(data.latitude)
        const longitude = Number(data.longitude)
        if (!data.error && typeof data.city === 'string' && Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
          setLocation({ city: data.city.slice(0, 38), latitude, longitude })
        }
      })
      .catch(() => { /* location stays generic on network/privacy failures */ })
    return () => controller.abort()
  }, [choice])

  useEffect(() => {
    const timezones = ['America/Sao_Paulo', 'America/New_York', 'Europe/London']
    const tick = () => setClocks(timezones.map(timeZone => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date())))
    tick(); const timer = window.setInterval(tick, 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let frame = 0
    const scroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const length = document.documentElement.scrollHeight - window.innerHeight
        setScrollPercent(length > 0 ? Math.round(window.scrollY / length * 100) : 0)
        frame = 0
      })
    }
    scroll(); window.addEventListener('scroll', scroll, { passive: true })
    return () => { window.removeEventListener('scroll', scroll); if (frame) cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    const elements = root.current?.querySelectorAll('.site3-reveal')
    if (!elements) return
    if (reduceMotion || !('IntersectionObserver' in window)) { elements.forEach(el => el.classList.add('site3-visible')); return }
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('site3-visible'); io.unobserve(entry.target) } }), { threshold: .10, rootMargin: '0px 0px -28px 0px' })
    elements.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(null); setSearchOpen(false); setMobileMenu(false) }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(v => !v) }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [])

  const storeChoice = (selected: Exclude<Choice, null>) => {
    setChoice(selected)
    try { localStorage.setItem('bawerk-site3-preferences', selected) } catch { /* browsing without storage */ }
  }
  const closeNav = useCallback(() => { setMenu(null); setMobileMenu(false) }, [])
  const selectService = (id: string) => { setActiveService(id); closeNav() }
  const toggleBriefService = (id: string) => setBriefServices(previous => previous.includes(id) ? (previous.length > 1 ? previous.filter(x => x !== id) : previous) : [...previous, id])
  const submitBrief = () => {
    const selected = services.filter(s => briefServices.includes(s.id)).map(s => s.title).join(', ')
    const message = `Olá, Bawerk! Gostaria de conversar sobre um projeto.\nServiços: ${selected}\nDescrição do projeto: ${brief.trim() || 'Gostaria de conversar sobre as possibilidades.'}`
    window.open(`${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return <main ref={root} className="site3-root" lang="pt-BR" onPointerMove={event => {
    if (!root.current || event.pointerType === 'touch') return
    root.current.style.setProperty('--pointer-x', `${event.clientX}px`)
    root.current.style.setProperty('--pointer-y', `${event.clientY}px`)
  }}>
    <div className="site3-noise" aria-hidden="true" /><div className="site3-mouse-glow" aria-hidden="true" />

    <header className="site3-header" onMouseLeave={() => setMenu(null)}>
      <nav className="site3-nav" aria-label="Navegação principal">
        <Logo />
        <div className="site3-desktop-nav">
          {navigation.map(item => item.menu ? <button key={item.id} className={`site3-nav-item${menu === item.menu ? ' site3-nav-active' : ''}`} aria-expanded={menu === item.menu} aria-haspopup="true" onMouseEnter={() => setMenu(item.menu)} onFocus={() => setMenu(item.menu)} onClick={() => setMenu(menu === item.menu ? null : item.menu || null)}>{item.label}<ChevronDown size={10} /></button> : <a key={item.id} className="site3-nav-item" href={`#${item.id}`} onMouseEnter={() => setMenu(null)} onClick={closeNav}>{item.label}</a>)}
        </div>
        <div className="site3-nav-actions"><button className="site3-icon-button site3-search-trigger" aria-label="Pesquisar" onClick={() => { setSearchOpen(true); setMenu(null) }}><Search size={18} /></button><a className="site3-message-button" href={WHATSAPP} target="_blank" rel="noopener noreferrer"><span className="site3-live-dot"/> fale conosco <ArrowUpRight size={15} /></a><button className="site3-mobile-toggle" aria-label={mobileMenu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(s => !s)}>{mobileMenu ? <X size={22}/> : <Menu size={22}/>}</button></div>
      </nav>
      {menu && <div className={`site3-mega-menu site3-mega-${menu}`} onMouseEnter={() => setMenu(menu)}>
        {menu === 'services' && <><div className="site3-mega-eyebrow">ESPECIALIDADES <span>— ENGENHARIA COM PROPÓSITO</span></div><div className="site3-mega-grid">{services.map(service => <a href="#services" onClick={() => selectService(service.id)} className="site3-mega-card" key={service.id}><span className="site3-mega-index">{service.index} / {service.category}</span><span className="site3-mega-title">{service.title} <ArrowUpRight size={15}/></span><span className="site3-mega-desc">{service.description}</span><span className={`site3-mega-glyph site3-glyph-${service.art}`}>{service.symbol}</span></a>)}</div></>}
        {menu === 'tools' && <><div className="site3-mega-eyebrow">FERRAMENTAS GRATUITAS <span>— SEM CADASTRO</span></div><div className="site3-mega-grid site3-mega-grid-3"><a className="site3-mega-card" href="#tools" onClick={closeNav}><span className="site3-mega-index">01 / ESTRATÉGIA</span><span className="site3-mega-title">Planejador de projetos <ArrowUpRight size={16}/></span><span className="site3-mega-desc">Monte uma primeira descrição do projeto em poucos minutos.</span><span className="site3-mega-glyph">◎</span></a><a className="site3-mega-card" href="#friction" onClick={closeNav}><span className="site3-mega-index">02 / DIAGNÓSTICO</span><span className="site3-mega-title">Identifique seu desafio <ArrowUpRight size={16}/></span><span className="site3-mega-desc">Descubra onde a tecnologia pode fazer a diferença.</span><span className="site3-mega-glyph">✳</span></a><a className="site3-mega-card" href="#method" onClick={closeNav}><span className="site3-mega-index">03 / PROCESSO</span><span className="site3-mega-title">Metodologia de desenvolvimento <ArrowUpRight size={16}/></span><span className="site3-mega-desc">Conheça cada etapa do desenvolvimento.</span><span className="site3-mega-glyph">◈</span></a></div></>}
        {menu === 'more' && <><div className="site3-mega-eyebrow">CONHEÇA MAIS A BAWERK</div><div className="site3-mega-grid site3-mega-grid-3">{[{label:'Nossa história',desc:'Visão independente. Desenvolvimento de ponta a ponta.',href:'#about'},{label:'Nossos projetos',desc:'Plataformas, automação e experiências digitais imersivas.',href:'#work'},{label:'Iniciar conversa',desc:'Grandes projetos começam com uma boa conversa.',href:'#contact'}].map((item,i) => <a className="site3-mega-card" href={item.href} key={item.label} onClick={closeNav}><span className="site3-mega-index">0{i+1} / BAWERK</span><span className="site3-mega-title">{item.label} <ArrowUpRight size={16}/></span><span className="site3-mega-desc">{item.desc}</span></a>)}</div></>}
      </div>}
      {mobileMenu && <div className="site3-mobile-panel">{navigation.map(item => <a href={`#${item.id}`} key={item.id} onClick={closeNav}>{item.label}<ArrowUpRight size={16}/></a>)}<a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={16}/></a></div>}
    </header>

    <div className="site3-progress" aria-label={`Progresso da página: ${scrollPercent}%`}><div className="site3-progress-track"><span style={{ height: `${scrollPercent}%` }} /></div><span>{String(scrollPercent).padStart(3, '0')}%</span></div>
    <a className="site3-side-language" href="#about" aria-label="Sobre a Bawerk"><span className="site3-status-orbit" /> PREPARADOS PARA O FUTURO</a>

    <section className="site3-hero" id="top">
      <div className="site3-hero-corner"><span className="site3-eyebrow"><span className="site3-mini-square" /> ENGENHARIA DIGITAL INDEPENDENTE</span><p>SÃO PAULO · CONECTADOS AO MUNDO</p></div>
      <div className="site3-hero-globe"><div className="site3-globe-glow"/><Globe3D location={location} reduceMotion={reduceMotion}/><div className="site3-globe-coordinate">GEO / 23°33′S · 46°38′W <span>↗</span></div><div className="site3-globe-caption">VISÃO GLOBAL<br />UM MUNDO CONECTADO</div></div>
      <div className="site3-hero-copy"><span className="site3-eyebrow site3-hero-eyebrow"><span className="site3-blue">●</span> ESTRATÉGIA · CÓDIGO · EVOLUÇÃO</span><h1>Sua parceira<br /><em>tecnológica<span className="site3-blue">.</span></em></h1><div className="site3-hero-bottom"><p>A melhor tecnologia não se limita ao que já é possível.<br />Ela cria novas possibilidades.</p><div className="site3-hero-ctas"><a className="site3-btn site3-btn-primary" href="#services">Conheça nossas soluções <ArrowUpRight size={17}/></a><a className="site3-btn site3-btn-outline" href="#contact">Vamos conversar <ArrowRight size={17}/></a></div></div></div>
      <div className="site3-hero-scroll"><span>ROLE PARA EXPLORAR</span><span className="site3-scroll-mouse"><span /></span><ArrowDown size={14}/></div>
      <div className="site3-hero-footnote"><span>CRIANDO O QUE AINDA NÃO EXISTE</span><span>01 — 06</span></div>
    </section>

    <div className="site3-ticker" aria-label="Nossas especialidades"><div>ENGENHARIA DE SOFTWARE <span>✳</span> EXPERIÊNCIAS DIGITAIS <span>✳</span> SISTEMAS INTELIGENTES <span>✳</span> MARCA E DESIGN <span>✳</span> AUTOMAÇÃO <span>✳</span> ENGENHARIA DE SOFTWARE <span>✳</span> EXPERIÊNCIAS DIGITAIS <span>✳</span> SISTEMAS INTELIGENTES <span>✳</span></div></div>

    <section className="site3-friction site3-section" id="friction"><div className="site3-section-label site3-reveal"><span>02 / IDENTIFIQUE OS DESAFIOS</span><span>ENCONTRE O VERDADEIRO PROBLEMA <MoveUpRight size={12}/></span></div><div className="site3-friction-stage"><div className="site3-friction-orb" aria-hidden="true" /><span className="site3-small-statement site3-reveal">AS MELHORES SOLUÇÕES COMEÇAM COM AS PERGUNTAS CERTAS.</span><h2 className="site3-friction-heading site3-reveal">O que está<br /><span>atrasando você?</span></h2><p className="site3-friction-sub site3-reveal">Conte o que está dificultando seu crescimento.<br />Nós ajudamos a encontrar o melhor caminho.</p><div className="site3-friction-bubbles">{friction.map((f,i) => <button key={f.count} onClick={() => setSelectedFriction(i)} className={`site3-friction-bubble site3-bubble-${i}${selectedFriction===i ? ' site3-bubble-active' : ''}`} aria-pressed={selectedFriction === i}>{f.label}<small>{f.count} ↗</small></button>)}</div></div><div className="site3-friction-answer site3-reveal"><div><span className="site3-eyebrow"><span className="site3-mini-square" /> NOSSA ABORDAGEM / 0{selectedFriction + 1}</span><h3>{friction[selectedFriction].label}<span className="site3-blue">.</span></h3><p>{friction[selectedFriction].insight}</p></div><a href="#services" onClick={() => setActiveService(friction[selectedFriction].service)} className="site3-round-arrow" aria-label="Explorar solução relacionada"><ArrowUpRight size={24}/></a></div></section>

    <section className="site3-services site3-section" id="services"><div className="site3-section-label site3-reveal"><span>03 / O QUE FAZEMOS</span><span>DESENVOLVIMENTO COM PROPÓSITO <MoveUpRight size={12}/></span></div><div className="site3-section-intro site3-reveal"><div><span className="site3-kicker">ESPECIALIDADES / 06 ÁREAS</span><h2>Não há limites<br />para o que podemos <em>criar<span className="site3-blue">.</span></em></h2></div><p>Nada de soluções genéricas. Criamos produtos, sistemas e experiências digitais sob medida para o funcionamento da sua empresa.</p></div><div className="site3-services-grid">{services.map(service => <button className={`site3-service-card site3-reveal${activeService === service.id ? ' site3-service-selected' : ''}`} key={service.id} onClick={() => setActiveService(service.id)} aria-pressed={activeService===service.id}><ServiceArt variant={service.art}/><span className="site3-service-card-body"><span className="site3-service-label">{service.index} / {service.category}</span><strong>{service.title}<ArrowUpRight size={19}/></strong><span className="site3-service-description">{service.description}</span></span></button>)}</div><div className="site3-service-detail site3-reveal"><div><span className="site3-eyebrow">EM DESTAQUE <span className="site3-blue">●</span> {selectedService.category}</span><h3>{selectedService.title}</h3><p>{selectedService.description}</p><div className="site3-tags">{selectedService.tags.map(t => <Chip key={t}>{t}</Chip>)}</div></div><div className="site3-detail-action"><ArrowLink href="#contact" light>Vamos criar juntos</ArrowLink></div></div></section>

    <section className="site3-work site3-section" id="work"><div className="site3-section-label site3-reveal"><span>04 / POSSIBILIDADES DIGITAIS</span><span>CRIADO PARA GERAR IMPACTO <MoveUpRight size={12}/></span></div><div className="site3-section-intro site3-reveal"><div><span className="site3-kicker">IDEIAS TRANSFORMADAS EM SISTEMAS</span><h2>Soluções digitais.<br /><em>Resultados reais.</em></h2></div><p>Do primeiro lead a uma plataforma que movimenta toda a operação, conectamos cada etapa do seu negócio.</p></div><div className="site3-work-grid"><article className="site3-work-card site3-reveal"><ServiceArt variant="crm" large/><div className="site3-work-info"><span>SOLUÇÃO EXEMPLO / SISTEMAS EMPRESARIAIS</span><h3>Sua empresa<br />conectada.</h3><p>Leads, vendas, operações e jornada do cliente em um único ambiente.</p><a href="#contact" aria-label="Conversar sobre solução de CRM"><ArrowUpRight size={20}/></a></div></article><article className="site3-work-card site3-reveal"><ServiceArt variant="automation" large/><div className="site3-work-info"><span>SOLUÇÃO EXEMPLO / OPERAÇÕES INTELIGENTES</span><h3>Menos tarefas.<br />Mais resultados.</h3><p>IA e automação aplicadas onde geram valor mensurável.</p><a href="#contact" aria-label="Conversar sobre automação"><ArrowUpRight size={20}/></a></div></article></div><div className="site3-work-note"><span>BOAS IDEIAS MERECEM UMA EXECUÇÃO EXCELENTE.</span><a href="/projetos" className="site3-arrow-link">Conheça a Bawerk <ArrowUpRight size={16}/></a></div></section>

    <section className="site3-method site3-section" id="method"><div className="site3-section-label site3-reveal"><span>05 / NOSSO MÉTODO</span><span>UMA IDEIA É SÓ O COMEÇO <MoveUpRight size={12}/></span></div><div className="site3-section-intro site3-reveal"><div><span className="site3-kicker">NOSSO JEITO DE TRABALHAR</span><h2>Processo simples.<br /><em>Visão estratégica.</em></h2></div><p>Transformamos desafios complexos em caminhos claros, da primeira conversa ao lançamento e à evolução contínua.</p></div><div className="site3-method-grid">{[{n:'01',title:'Descobrir',desc:'Objetivos, desafios, contexto e oportunidades.',icon:<Search size={28}/>},{n:'02',title:'Planejar',desc:'Fluxos, interfaces e arquitetura técnica.',icon:<Layers3 size={28}/>},{n:'03',title:'Desenvolver',desc:'Criar, testar, aprimorar e integrar.',icon:<Code2 size={28}/>},{n:'04',title:'Evoluir',desc:'Analisar, otimizar e avançar continuamente.',icon:<Zap size={28}/>}].map(m => <div className="site3-method-step site3-reveal" key={m.n}><span className="site3-method-number">{m.n} / 04</span><div className="site3-method-circle"><div className="site3-method-icon">{m.icon}</div></div><h3>{m.title}</h3><p>{m.desc}</p></div>)}</div><p className="site3-method-statement site3-reveal">A boa tecnologia está sempre em evolução.<br /><strong>Evolui junto com você.</strong></p></section>

    <section className="site3-tool-section site3-section" id="tools"><div className="site3-section-label site3-reveal"><span>06 / COMECE SEU PROJETO</span><span>PLANEJAMENTO GRATUITO <MoveUpRight size={12}/></span></div><div className="site3-tool-layout"><div className="site3-tool-intro site3-reveal"><span className="site3-kicker">UM GRANDE PROJETO COMEÇA AQUI</span><h2>O que vamos<br /><em>criar juntos?</em></h2><p>Conte sua ideia, selecione os serviços desejados, descreva seu desafio e envie a proposta diretamente para nossa equipe.</p><div className="site3-tool-foot"><ShieldCheck size={20}/><span>SEM CADASTRO. SEM FORMULÁRIOS PERDIDOS.<br />CONVERSA DIRETA COM NOSSA EQUIPE.</span></div></div><div className="site3-brief-card site3-reveal"><div className="site3-brief-top"><span><span className="site3-live-dot"/> DESCRIÇÃO DO PROJETO / 001</span><Command size={20}/></div><label className="site3-brief-label">01 — DO QUE VOCÊ PRECISA?</label><div className="site3-brief-options">{services.map(service => <button key={service.id} className={briefServices.includes(service.id) ? 'site3-option-active' : ''} aria-pressed={briefServices.includes(service.id)} onClick={() => toggleBriefService(service.id)}>{briefServices.includes(service.id) ? <Check size={14}/> : <span className="site3-option-plus">+</span>}{service.title}</button>)}</div><label className="site3-brief-label" htmlFor="site3-brief-text">02 — CONTE SOBRE SUA IDEIA</label><textarea id="site3-brief-text" value={brief} onChange={e => setBrief(e.target.value)} placeholder="O problema que queremos resolver, o projeto que imaginamos ou apenas uma ideia inicial..." maxLength={1200} rows={4}/><div className="site3-brief-footer"><span>{String(brief.length).padStart(3,'0')} / 1200</span><button className="site3-btn site3-btn-primary" onClick={submitBrief}>Enviar projeto <Send size={17}/></button></div></div></div></section>

    <section className="site3-about site3-section" id="about"><div className="site3-about-glow"/><div className="site3-section-label site3-reveal"><span>BAWERK / O QUE NOS MOVE</span><span>SEMPRE EM EVOLUÇÃO <MoveUpRight size={12}/></span></div><div className="site3-about-layout"><div className="site3-about-stamp site3-reveal"><div className="site3-stamp-circle"><Cpu size={54} strokeWidth={1}/><span>INDEPENDENTES<br/>POR NATUREZA</span></div></div><div className="site3-about-copy site3-reveal"><span className="site3-kicker">SOMOS A BAWERK SOLUTIONS</span><h2>Sempre evoluindo.<br /><span>Nunca comuns.</span></h2><p>Unimos engenharia, automação, design e atenção a cada detalhe para criar experiências digitais que impressionam e funcionam de verdade.</p><p className="site3-about-signature">Você pode ir além do que imagina.</p><ArrowLink href="#contact" light>Conheça sua parceira tecnológica</ArrowLink></div></div></section>

    <section className="site3-contact site3-section" id="contact"><div className="site3-section-label site3-reveal"><span>VAMOS CRIAR O FUTURO</span><span>CONTATO / BAWERK SOLUTIONS <MoveUpRight size={12}/></span></div><div className="site3-contact-body site3-reveal"><span className="site3-kicker">TEM UM DESAFIO PARA RESOLVER?</span><h2>Toda empresa<br />merece <em>evoluir<span>.</span></em></h2><p>Da primeira ideia à próxima grande transformação da sua empresa, desenvolvemos com você tudo o que vem pela frente.</p><div className="site3-contact-actions"><a className="site3-btn site3-btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Iniciar conversa <ArrowUpRight size={20}/></a><a className="site3-btn site3-btn-outline" href={`mailto:${CONTACT_EMAIL}`}><Mail size={17}/> Envie um e-mail</a></div></div><div className="site3-global-clock site3-reveal"><span className="site3-clock-label">CONECTADOS EM DIFERENTES FUSOS</span><div>{[{city:'SÃO PAULO',time:clocks[0],zone:'BR'},{city:'NOVA YORK',time:clocks[1],zone:'US'},{city:'LONDRES',time:clocks[2],zone:'UK'}].map(item => <div className="site3-clock" key={item.city}><Globe2 size={15}/><strong>{item.city}</strong><span>{item.zone} · {item.time}</span></div>)}</div></div></section>

    <footer className="site3-footer"><div className="site3-footer-brand"><Logo/><p>Construindo experiências digitais extraordinárias.</p></div><div className="site3-footer-links"><div><small>EXPLORE</small><a href="#services">Serviços</a><a href="#method">Nosso método</a><a href="#work">Soluções</a></div><div><small>FALE CONOSCO</small><a href="#contact">Contato</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`mailto:${CONTACT_EMAIL}`}>E-mail</a></div><div><small>MAIS</small><a href="#about">Sobre</a><a href="#tools">Planejador de projetos</a><button onClick={() => { setChoice(null); setPreferencesLoaded(true) }}>Preferências de privacidade</button></div></div><div className="site3-footer-end"><span>© {new Date().getFullYear()} BAWERK SOLUTIONS. TODOS OS DIREITOS RESERVADOS.</span><span>CRIADO PARA EVOLUIR <span className="site3-blue">✳</span></span><a href="#top">VOLTAR AO TOPO ↑</a></div></footer>

    {preferencesLoaded && choice === null && <div className="site3-cookie" role="region" aria-label="Preferências de privacidade"><span className="site3-cookie-shield"><ShieldCheck size={22}/></span><p>Usamos armazenamento essencial para lembrar suas preferências. Com sua autorização, também mostramos sua cidade aproximada com base no endereço IP. <strong>Você está no controle.</strong></p><button onClick={() => storeChoice('rejected')} className="site3-cookie-reject">SOMENTE ESSENCIAIS</button><button onClick={() => storeChoice('accepted')} className="site3-cookie-accept">ACEITAR <Check size={15}/></button></div>}

    {searchOpen && <div className="site3-search-backdrop" onMouseDown={e => { if (e.currentTarget === e.target) setSearchOpen(false) }}><div className="site3-search-dialog" role="dialog" aria-modal="true" aria-label="Pesquisar na Bawerk"><div className="site3-search-head"><Search size={22}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar serviços, métodos, ferramentas..." aria-label="Pesquisar páginas"/><button aria-label="Fechar pesquisa" onClick={() => setSearchOpen(false)}><X size={20}/></button></div><div className="site3-search-results">{filteredSearch.length ? filteredSearch.map(item => <a key={item.title} href={item.href} onClick={() => { setSearchOpen(false); setQuery('') }}><span>{item.label}</span>{item.title}<ArrowUpRight size={17}/></a>) : <div className="site3-no-results">Nenhum resultado. Tente “software”, “CRM” ou “contato”.</div>}</div><div className="site3-search-hint"><span><kbd>ESC</kbd> FECHAR</span><span>BAWERK / PESQUISA</span></div></div></div>}
  </main>
}