'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Code2, Command, Cpu, Globe2, Layers3, Mail, Menu, MoveUpRight, MousePointer2, Search, Send, ShieldCheck, Sparkles, X, Zap } from 'lucide-react'

const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false, loading: () => <div className="site3-globe-loading"><span className="site3-loading-ring" /><span>INITIALIZING GLOBAL NETWORK</span></div> })
const WHATSAPP = 'https://wa.me/5511992779039'
const CONTACT_EMAIL = 'contato@bawerk.solutions'
type MenuName = 'services' | 'tools' | 'more'
type Location = { city: string; latitude: number; longitude: number }
type Choice = 'accepted' | 'rejected' | null

const services = [
  { id: 'web', index: '01', category: 'DIGITAL EXPERIENCES', title: 'Web development', description: 'High-performance websites and digital worlds built to make an impression.', tags: ['Next.js', '3D / WebGL', 'UX/UI'], art: 'web', symbol: '◈' },
  { id: 'software', index: '02', category: 'ENGINEERING', title: 'Custom software', description: 'Purpose-built platforms that make complex work feel effortless.', tags: ['SaaS', 'Platforms', 'APIs'], art: 'software', symbol: '⌘' },
  { id: 'automation', index: '03', category: 'INTELLIGENCE', title: 'AI & automation', description: 'Intelligent workflows that free your team to do their best work.', tags: ['AI Agents', 'Workflows', 'Integrations'], art: 'automation', symbol: '✳' },
  { id: 'crm', index: '04', category: 'BUSINESS SYSTEMS', title: 'CRM & operations', description: 'All your customer conversations, leads and operations in one place.', tags: ['CRM', 'Dashboards', 'Analytics'], art: 'crm', symbol: '◎' },
  { id: 'cloud', index: '05', category: 'INFRASTRUCTURE', title: 'Cloud & APIs', description: 'Reliable foundations connecting your tools, data and ambitions.', tags: ['Cloud', 'Databases', 'Security'], art: 'cloud', symbol: '▦' },
  { id: 'design', index: '06', category: 'CREATIVE SYSTEMS', title: 'Brand & design', description: 'Memorable identities and interfaces where every detail has a purpose.', tags: ['Identity', 'Motion', 'Design'], art: 'design', symbol: '✦' },
]
const friction = [
  { label: 'my site keeps slowing down', count: '01', insight: 'Faster infrastructure, measured Core Web Vitals and an experience built for scale.', service: 'web' },
  { label: 'leads disappear before sales', count: '02', insight: 'Connect forms, pipeline stages and notifications in one accountable CRM.', service: 'crm' },
  { label: 'my team does everything manually', count: '03', insight: 'Automate repeated work and connect the systems your team already uses.', service: 'automation' },
  { label: 'our systems do not talk', count: '04', insight: 'Build secure APIs and integrations that let the whole operation move together.', service: 'cloud' },
  { label: 'we have an idea, not a product', count: '05', insight: 'Turn a clear product strategy into a tested, launch-ready digital platform.', service: 'software' },
  { label: 'our brand looks like everyone else', count: '06', insight: 'Create an ownable visual language with design, motion and a consistent voice.', service: 'design' },
]
const searches = [
  { title: 'Web development', label: 'SERVICE', href: '#services' },
  { title: 'Custom software', label: 'SERVICE', href: '#services' },
  { title: 'AI & automation', label: 'SERVICE', href: '#services' },
  { title: 'CRM & operations', label: 'SERVICE', href: '#services' },
  { title: 'How we work', label: 'PROCESS', href: '#method' },
  { title: 'Selected solutions', label: 'WORK', href: '#work' },
  { title: 'Plan your project', label: 'TOOL', href: '#tools' },
  { title: 'Contact our team', label: 'CONTACT', href: '#contact' },
]
const navigation = [{ label: 'Services', id: 'services', menu: 'services' as MenuName }, { label: 'Method', id: 'method' }, { label: 'Case studies', id: 'work' }, { label: 'Tools', id: 'tools', menu: 'tools' as MenuName }, { label: 'More', id: 'about', menu: 'more' as MenuName }, { label: 'Contact', id: 'contact' }]

function Logo() {
  return <a className="site3-logo" href="#top" aria-label="Bawerk Solutions, home">
    <svg viewBox="0 0 42 42" width="35" height="35" aria-hidden="true"><path d="M7 5h12l-6 12h13l5-12h7L28 27H15l-5 10H2L16 8H9z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M25 9h8" stroke="#129bff" strokeWidth="3.5" strokeLinecap="round" /></svg>
    <span className="site3-logo-type"><strong>BAWERK<span className="site3-blue">.</span></strong><small>SOLUTIONS / DIGITAL ENGINEERING</small></span>
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
      .then(r => { if (!r.ok) throw Error('Location service unavailable'); return r.json() })
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
    const tick = () => setClocks(timezones.map(timeZone => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date())))
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
    const message = `Hello Bawerk! I'd like to talk about a project.\nServices: ${selected}\nProject brief: ${brief.trim() || 'Let’s discuss the possibilities.'}`
    window.open(`${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return <main ref={root} className="site3-root" lang="en" onPointerMove={event => {
    if (!root.current || event.pointerType === 'touch') return
    root.current.style.setProperty('--pointer-x', `${event.clientX}px`)
    root.current.style.setProperty('--pointer-y', `${event.clientY}px`)
  }}>
    <div className="site3-noise" aria-hidden="true" /><div className="site3-mouse-glow" aria-hidden="true" />

    <header className="site3-header" onMouseLeave={() => setMenu(null)}>
      <nav className="site3-nav" aria-label="Main navigation">
        <Logo />
        <div className="site3-desktop-nav">
          {navigation.map(item => item.menu ? <button key={item.id} className={`site3-nav-item${menu === item.menu ? ' site3-nav-active' : ''}`} aria-expanded={menu === item.menu} aria-haspopup="true" onMouseEnter={() => setMenu(item.menu)} onFocus={() => setMenu(item.menu)} onClick={() => setMenu(menu === item.menu ? null : item.menu || null)}>{item.label}<ChevronDown size={10} /></button> : <a key={item.id} className="site3-nav-item" href={`#${item.id}`} onMouseEnter={() => setMenu(null)} onClick={closeNav}>{item.label}</a>)}
        </div>
        <div className="site3-nav-actions"><button className="site3-icon-button site3-search-trigger" aria-label="Search" onClick={() => { setSearchOpen(true); setMenu(null) }}><Search size={18} /></button><a className="site3-message-button" href={WHATSAPP} target="_blank" rel="noopener noreferrer"><span className="site3-live-dot"/> message us <ArrowUpRight size={15} /></a><button className="site3-mobile-toggle" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(s => !s)}>{mobileMenu ? <X size={22}/> : <Menu size={22}/>}</button></div>
      </nav>
      {menu && <div className={`site3-mega-menu site3-mega-${menu}`} onMouseEnter={() => setMenu(menu)}>
        {menu === 'services' && <><div className="site3-mega-eyebrow">CAPABILITIES <span>— THOUGHTFULLY ENGINEERED</span></div><div className="site3-mega-grid">{services.map(service => <a href="#services" onClick={() => selectService(service.id)} className="site3-mega-card" key={service.id}><span className="site3-mega-index">{service.index} / {service.category}</span><span className="site3-mega-title">{service.title} <ArrowUpRight size={15}/></span><span className="site3-mega-desc">{service.description}</span><span className={`site3-mega-glyph site3-glyph-${service.art}`}>{service.symbol}</span></a>)}</div></>}
        {menu === 'tools' && <><div className="site3-mega-eyebrow">FREE PLANNING TOOLS <span>— NO SIGNUP</span></div><div className="site3-mega-grid site3-mega-grid-3"><a className="site3-mega-card" href="#tools" onClick={closeNav}><span className="site3-mega-index">01 / STRATEGY</span><span className="site3-mega-title">Project planner <ArrowUpRight size={16}/></span><span className="site3-mega-desc">Build a useful first brief in minutes.</span><span className="site3-mega-glyph">◎</span></a><a className="site3-mega-card" href="#friction" onClick={closeNav}><span className="site3-mega-index">02 / DIAGNOSTIC</span><span className="site3-mega-title">Find your friction <ArrowUpRight size={16}/></span><span className="site3-mega-desc">Identify where technology can make the difference.</span><span className="site3-mega-glyph">✳</span></a><a className="site3-mega-card" href="#method" onClick={closeNav}><span className="site3-mega-index">03 / PROCESS</span><span className="site3-mega-title">Build methodology <ArrowUpRight size={16}/></span><span className="site3-mega-desc">Understand every phase of the journey.</span><span className="site3-mega-glyph">◈</span></a></div></>}
        {menu === 'more' && <><div className="site3-mega-eyebrow">MORE FROM BAWERK</div><div className="site3-mega-grid site3-mega-grid-3">{[{label:'Our story',desc:'Independent thinking. End-to-end building.',href:'#about'},{label:'Our work',desc:'Platforms, automation and immersive web.',href:'#work'},{label:'Start a conversation',desc:'Good projects begin with a real conversation.',href:'#contact'}].map((item,i) => <a className="site3-mega-card" href={item.href} key={item.label} onClick={closeNav}><span className="site3-mega-index">0{i+1} / BAWERK</span><span className="site3-mega-title">{item.label} <ArrowUpRight size={16}/></span><span className="site3-mega-desc">{item.desc}</span></a>)}</div></>}
      </div>}
      {mobileMenu && <div className="site3-mobile-panel">{navigation.map(item => <a href={`#${item.id}`} key={item.id} onClick={closeNav}>{item.label}<ArrowUpRight size={16}/></a>)}<a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={16}/></a></div>}
    </header>

    <div className="site3-progress" aria-label={`Page scroll progress ${scrollPercent}%`}><div className="site3-progress-track"><span style={{ height: `${scrollPercent}%` }} /></div><span>{String(scrollPercent).padStart(3, '0')}%</span></div>
    <a className="site3-side-language" href="#about" aria-label="About Bawerk"><span className="site3-status-orbit" /> EST. FOR WHAT'S NEXT</a>

    <section className="site3-hero" id="top">
      <div className="site3-hero-corner"><span className="site3-eyebrow"><span className="site3-mini-square" /> INDEPENDENT DIGITAL ENGINEERING</span><p>SÃO PAULO · CONNECTED WORLDWIDE</p></div>
      <div className="site3-hero-globe"><div className="site3-globe-glow"/><Globe3D location={location} reduceMotion={reduceMotion}/><div className="site3-globe-coordinate">GEO / 23°33′S · 46°38′W <span>↗</span></div><div className="site3-globe-caption">GLOBAL MINDSET<br />ONE CONNECTED WORLD</div></div>
      <div className="site3-hero-copy"><span className="site3-eyebrow site3-hero-eyebrow"><span className="site3-blue">●</span> STRATEGY · CODE · EVOLUTION</span><h1>Your tech<br /><em>partner<span className="site3-blue">.</span></em></h1><div className="site3-hero-bottom"><p>Great technology doesn&apos;t follow what&apos;s possible.<br />It expands what&apos;s next.</p><div className="site3-hero-ctas"><a className="site3-btn site3-btn-primary" href="#services">Explore our work <ArrowUpRight size={17}/></a><a className="site3-btn site3-btn-outline" href="#contact">Let&apos;s talk <ArrowRight size={17}/></a></div></div></div>
      <div className="site3-hero-scroll"><span>SCROLL TO EXPLORE</span><span className="site3-scroll-mouse"><span /></span><ArrowDown size={14}/></div>
      <div className="site3-hero-footnote"><span>BUILDING THE UNBUILT</span><span>01 — 06</span></div>
    </section>

    <div className="site3-ticker" aria-label="Our capabilities"><div>SOFTWARE ENGINEERING <span>✳</span> DIGITAL EXPERIENCES <span>✳</span> INTELLIGENT SYSTEMS <span>✳</span> BRAND & DESIGN <span>✳</span> AUTOMATION <span>✳</span> SOFTWARE ENGINEERING <span>✳</span> DIGITAL EXPERIENCES <span>✳</span> INTELLIGENT SYSTEMS <span>✳</span></div></div>

    <section className="site3-friction site3-section" id="friction"><div className="site3-section-label site3-reveal"><span>02 / DIAGNOSE THE FRICTION</span><span>FIND THE REAL PROBLEM <MoveUpRight size={12}/></span></div><div className="site3-friction-stage"><div className="site3-friction-orb" aria-hidden="true" /><span className="site3-small-statement site3-reveal">THE BEST SOLUTIONS START WITH A BETTER QUESTION.</span><h2 className="site3-friction-heading site3-reveal">What&apos;s slowing<br />you <span>down?</span></h2><p className="site3-friction-sub site3-reveal">Tell us what&apos;s getting in the way.<br />We&apos;ll help design the way forward.</p><div className="site3-friction-bubbles">{friction.map((f,i) => <button key={f.count} onClick={() => setSelectedFriction(i)} className={`site3-friction-bubble site3-bubble-${i}${selectedFriction===i ? ' site3-bubble-active' : ''}`} aria-pressed={selectedFriction === i}>{f.label}<small>{f.count} ↗</small></button>)}</div></div><div className="site3-friction-answer site3-reveal"><div><span className="site3-eyebrow"><span className="site3-mini-square" /> OUR APPROACH / 0{selectedFriction + 1}</span><h3>{friction[selectedFriction].label}<span className="site3-blue">.</span></h3><p>{friction[selectedFriction].insight}</p></div><a href="#services" onClick={() => setActiveService(friction[selectedFriction].service)} className="site3-round-arrow" aria-label="Explore related solution"><ArrowUpRight size={24}/></a></div></section>

    <section className="site3-services site3-section" id="services"><div className="site3-section-label site3-reveal"><span>03 / WHAT WE DO</span><span>BUILDING WITH PURPOSE <MoveUpRight size={12}/></span></div><div className="site3-section-intro site3-reveal"><div><span className="site3-kicker">CAPABILITIES / 06 AREAS</span><h2>There&apos;s nothing<br />we can&apos;t <em>build<span className="site3-blue">.</span></em></h2></div><p>Not a template. Not a workaround. Digital products, systems and experiences designed for how your business actually works.</p></div><div className="site3-services-grid">{services.map(service => <button className={`site3-service-card site3-reveal${activeService === service.id ? ' site3-service-selected' : ''}`} key={service.id} onClick={() => setActiveService(service.id)} aria-pressed={activeService===service.id}><ServiceArt variant={service.art}/><span className="site3-service-card-body"><span className="site3-service-label">{service.index} / {service.category}</span><strong>{service.title}<ArrowUpRight size={19}/></strong><span className="site3-service-description">{service.description}</span></span></button>)}</div><div className="site3-service-detail site3-reveal"><div><span className="site3-eyebrow">CURRENTLY EXPLORING <span className="site3-blue">●</span> {selectedService.category}</span><h3>{selectedService.title}</h3><p>{selectedService.description}</p><div className="site3-tags">{selectedService.tags.map(t => <Chip key={t}>{t}</Chip>)}</div></div><div className="site3-detail-action"><ArrowLink href="#contact" light>Let&apos;s build this</ArrowLink></div></div></section>

    <section className="site3-work site3-section" id="work"><div className="site3-section-label site3-reveal"><span>04 / DIGITAL POSSIBILITIES</span><span>DESIGNED TO MAKE AN IMPACT <MoveUpRight size={12}/></span></div><div className="site3-section-intro site3-reveal"><div><span className="site3-kicker">IDEAS INTO SYSTEMS</span><h2>Digital solutions.<br /><em>Real momentum.</em></h2></div><p>From a lead arriving in your pipeline to a platform powering an entire operation, everything connects.</p></div><div className="site3-work-grid"><article className="site3-work-card site3-reveal"><ServiceArt variant="crm" large/><div className="site3-work-info"><span>EXAMPLE SOLUTION / BUSINESS SYSTEMS</span><h3>The connected<br />business.</h3><p>Unified leads, sales, operations and customer journeys.</p><a href="#contact" aria-label="Discuss CRM solution"><ArrowUpRight size={20}/></a></div></article><article className="site3-work-card site3-reveal"><ServiceArt variant="automation" large/><div className="site3-work-info"><span>EXAMPLE SOLUTION / INTELLIGENT OPERATIONS</span><h3>Less busywork.<br />More progress.</h3><p>AI and automation where they create measurable value.</p><a href="#contact" aria-label="Discuss automation solution"><ArrowUpRight size={20}/></a></div></article></div><div className="site3-work-note"><span>GOOD IDEAS DESERVE GREAT EXECUTION.</span><a href="/projetos" className="site3-arrow-link">Discover Bawerk <ArrowUpRight size={16}/></a></div></section>

    <section className="site3-method site3-section" id="method"><div className="site3-section-label site3-reveal"><span>05 / THE METHOD</span><span>AN IDEA IS JUST THE BEGINNING <MoveUpRight size={12}/></span></div><div className="site3-section-intro site3-reveal"><div><span className="site3-kicker">OUR WAY OF WORKING</span><h2>Simple process.<br /><em>Serious thinking.</em></h2></div><p>We bring clarity to complexity — from the first conversation through launch and continuous evolution.</p></div><div className="site3-method-grid">{[{n:'01',title:'Discover',desc:'Goals, friction, context and opportunity.',icon:<Search size={28}/>},{n:'02',title:'Design',desc:'Flows, interfaces and technical architecture.',icon:<Layers3 size={28}/>},{n:'03',title:'Engineer',desc:'Build, test, refine and integrate.',icon:<Code2 size={28}/>},{n:'04',title:'Evolve',desc:'Learn, optimize and keep moving forward.',icon:<Zap size={28}/>}].map(m => <div className="site3-method-step site3-reveal" key={m.n}><span className="site3-method-number">{m.n} / 04</span><div className="site3-method-circle"><div className="site3-method-icon">{m.icon}</div></div><h3>{m.title}</h3><p>{m.desc}</p></div>)}</div><p className="site3-method-statement site3-reveal">Great technology is never really finished.<br /><strong>It evolves with you.</strong></p></section>

    <section className="site3-tool-section site3-section" id="tools"><div className="site3-section-label site3-reveal"><span>06 / START SOMETHING</span><span>PROJECT DISCOVERY / FREE <MoveUpRight size={12}/></span></div><div className="site3-tool-layout"><div className="site3-tool-intro site3-reveal"><span className="site3-kicker">A BETTER BRIEF BEGINS HERE</span><h2>What are we<br /><em>building next?</em></h2><p>Tell us what you&apos;re imagining. Pick the areas you need, write a little about your challenge, and send your brief straight to the team.</p><div className="site3-tool-foot"><ShieldCheck size={20}/><span>NO SIGNUP. NO FORMS DISAPPEARING INTO THE VOID.<br />JUST A DIRECT CONVERSATION.</span></div></div><div className="site3-brief-card site3-reveal"><div className="site3-brief-top"><span><span className="site3-live-dot"/> PROJECT BRIEF / 001</span><Command size={20}/></div><label className="site3-brief-label">01 — WHAT DO YOU NEED?</label><div className="site3-brief-options">{services.map(service => <button key={service.id} className={briefServices.includes(service.id) ? 'site3-option-active' : ''} aria-pressed={briefServices.includes(service.id)} onClick={() => toggleBriefService(service.id)}>{briefServices.includes(service.id) ? <Check size={14}/> : <span className="site3-option-plus">+</span>}{service.title}</button>)}</div><label className="site3-brief-label" htmlFor="site3-brief-text">02 — TELL US ABOUT THE IDEA</label><textarea id="site3-brief-text" value={brief} onChange={e => setBrief(e.target.value)} placeholder="The problem we're solving, what we want to build, or even just a rough idea..." maxLength={1200} rows={4}/><div className="site3-brief-footer"><span>{String(brief.length).padStart(3,'0')} / 1200</span><button className="site3-btn site3-btn-primary" onClick={submitBrief}>Send project brief <Send size={17}/></button></div></div></div></section>

    <section className="site3-about site3-section" id="about"><div className="site3-about-glow"/><div className="site3-section-label site3-reveal"><span>BAWERK / WHAT DRIVES US</span><span>ALWAYS BUILDING FORWARD <MoveUpRight size={12}/></span></div><div className="site3-about-layout"><div className="site3-about-stamp site3-reveal"><div className="site3-stamp-circle"><Cpu size={54} strokeWidth={1}/><span>INDEPENDENT<br/>BY DESIGN</span></div></div><div className="site3-about-copy site3-reveal"><span className="site3-kicker">WE ARE BAWERK SOLUTIONS</span><h2>Always evolving.<br /><span>Never ordinary.</span></h2><p>We bring together engineering, automation, design and a healthy obsession with detail to build digital experiences that feel as good as they work.</p><p className="site3-about-signature">Você pode ir além do que imagina.</p><ArrowLink href="#contact" light>Meet your next tech partner</ArrowLink></div></div></section>

    <section className="site3-contact site3-section" id="contact"><div className="site3-section-label site3-reveal"><span>LET'S CREATE WHAT'S NEXT</span><span>CONNECT / BAWERK SOLUTIONS <MoveUpRight size={12}/></span></div><div className="site3-contact-body site3-reveal"><span className="site3-kicker">GOT A PROBLEM WORTH SOLVING?</span><h2>And every business<br />deserves to <em>evolve<span>.</span></em></h2><p>From that first spark of an idea to the next major evolution of your business, we&apos;re here to build what comes next.</p><div className="site3-contact-actions"><a className="site3-btn site3-btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Start a conversation <ArrowUpRight size={20}/></a><a className="site3-btn site3-btn-outline" href={`mailto:${CONTACT_EMAIL}`}><Mail size={17}/> Email us</a></div></div><div className="site3-global-clock site3-reveal"><span className="site3-clock-label">CONNECTED ACROSS TIMEZONES</span><div>{[{city:'SÃO PAULO',time:clocks[0],zone:'BR'},{city:'NEW YORK',time:clocks[1],zone:'US'},{city:'LONDON',time:clocks[2],zone:'UK'}].map(item => <div className="site3-clock" key={item.city}><Globe2 size={15}/><strong>{item.city}</strong><span>{item.zone} · {item.time}</span></div>)}</div></div></section>

    <footer className="site3-footer"><div className="site3-footer-brand"><Logo/><p>Engineering extraordinary digital futures.</p></div><div className="site3-footer-links"><div><small>EXPLORE</small><a href="#services">Services</a><a href="#method">Our method</a><a href="#work">Solutions</a></div><div><small>GET IN TOUCH</small><a href="#contact">Contact</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`mailto:${CONTACT_EMAIL}`}>Email</a></div><div><small>MORE</small><a href="#about">About</a><a href="#tools">Project planner</a><button onClick={() => { setChoice(null); setPreferencesLoaded(true) }}>Privacy preferences</button></div></div><div className="site3-footer-end"><span>© {new Date().getFullYear()} BAWERK SOLUTIONS. ALL RIGHTS RESERVED.</span><span>DESIGNED TO EVOLVE <span className="site3-blue">✳</span></span><a href="#top">BACK TO TOP ↑</a></div></footer>

    {preferencesLoaded && choice === null && <div className="site3-cookie" role="region" aria-label="Privacy preferences"><span className="site3-cookie-shield"><ShieldCheck size={22}/></span><p>We use essential storage for site preferences. With your permission, we&apos;ll also display an approximate city based on your IP address. <strong>You&apos;re in control.</strong></p><button onClick={() => storeChoice('rejected')} className="site3-cookie-reject">ESSENTIAL ONLY</button><button onClick={() => storeChoice('accepted')} className="site3-cookie-accept">ACCEPT <Check size={15}/></button></div>}

    {searchOpen && <div className="site3-search-backdrop" onMouseDown={e => { if (e.currentTarget === e.target) setSearchOpen(false) }}><div className="site3-search-dialog" role="dialog" aria-modal="true" aria-label="Search Bawerk"><div className="site3-search-head"><Search size={22}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services, methods, tools..." aria-label="Search pages"/><button aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={20}/></button></div><div className="site3-search-results">{filteredSearch.length ? filteredSearch.map(item => <a key={item.title} href={item.href} onClick={() => { setSearchOpen(false); setQuery('') }}><span>{item.label}</span>{item.title}<ArrowUpRight size={17}/></a>) : <div className="site3-no-results">No results. Try “software”, “CRM” or “contact”.</div>}</div><div className="site3-search-hint"><span><kbd>ESC</kbd> CLOSE</span><span>BAWERK / SEARCH</span></div></div></div>}
  </main>
}