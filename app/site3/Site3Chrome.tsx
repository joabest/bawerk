'use client'
import Link from './PublicLink'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {useCallback,useEffect,useMemo,useRef,useState} from 'react'
import {ArrowUpRight,ChevronDown,Menu,Search,X,MessageCircle} from 'lucide-react'
import {BrandIcon} from './BrandIcon'

type MenuName = 'services'|'tools'|'more'
const phone='https://wa.me/5511992779039'
const siteLinks=[
 {label:'Início',href:'/site3'},
 {label:'Serviços',href:'/site3/servicos'},
 {label:'Aplicativos',href:'/site3/aplicativos'},
 {label:'Softwares',href:'/site3/softwares'},
 {label:'Método',href:'/site3/metodo'},
 {label:'Projetos',href:'/site3/projetos'},
 {label:'Blog',href:'/site3/blog'},
 {label:'Sobre',href:'/site3/sobre'},
 {label:'Contato',href:'/site3/contato'},
]
const serviceCards=[
 {index:'01',cat:'EXPERIÊNCIAS DIGITAIS',title:'Desenvolvimento web',desc:'Sites de alto desempenho, interfaces e experiências digitais.',symbol:'◈',href:'/site3/servicos'},
 {index:'02',cat:'ENGENHARIA',title:'Software sob medida',desc:'Plataformas e sistemas criados para o seu negócio.',symbol:'⌘',href:'/site3/softwares'},
 {index:'07',cat:'MOBILE',title:'Aplicativos Android e iOS',desc:'Apps para celular personalizados e conectados aos seus sistemas.',symbol:'▣',href:'/site3/aplicativos'},
 {index:'03',cat:'INTELIGÊNCIA',title:'IA e automação',desc:'Fluxos inteligentes e integrações que poupam tempo.',symbol:'✳',href:'/site3/servicos'},
 {index:'04',cat:'NEGÓCIOS',title:'CRM e operações',desc:'Leads, funis de vendas, atendimento e painéis.',symbol:'◎',href:'/site3/servicos'},
 {index:'05',cat:'INFRAESTRUTURA',title:'Nuvem e APIs',desc:'Integração de sistemas, dados e serviços.',symbol:'▦',href:'/site3/servicos'},
 {index:'06',cat:'CRIAÇÃO',title:'Marca e design',desc:'Identidades visuais e interfaces marcantes.',symbol:'✦',href:'/site3/servicos'},
]
const toolCards=[
 {index:'01',cat:'ESTRATÉGIA',title:'Planejador de projetos',desc:'Preencha um briefing completo para a equipe Bawerk.',symbol:'◎',href:'/site3/contato'},
 {index:'02',cat:'DIAGNÓSTICO',title:'Identifique seu desafio',desc:'Descubra o que está dificultando seu crescimento.',symbol:'✳',href:'/site3/#diagnostico'},
 {index:'03',cat:'PROCESSO',title:'Metodologia de desenvolvimento',desc:'Conheça nossas quatro etapas de trabalho.',symbol:'◈',href:'/site3/metodo'},
]
const moreCards=[
 {index:'01',cat:'EMPRESA',title:'Sobre a Bawerk',desc:'Nossa visão, essência e forma de construir.',symbol:'◉',href:'/site3/sobre'},
 {index:'02',cat:'CONTEÚDO',title:'Blog e artigos',desc:'Tecnologia, design, IA e tendências digitais.',symbol:'▤',href:'/site3/blog'},
 {index:'03',cat:'PORTFÓLIO',title:'Projetos',desc:'Conheça algumas experiências desenvolvidas.',symbol:'↗',href:'/site3/projetos'},
]

function Brand(){
 return <Link className="site3-logo" href="/site3" aria-label="Bawerk Solutions — página inicial">
  <Image src="/icon.svg" alt="" width={35} height={35} />
  <span className="site3-logo-type"><strong>BAWERK<span className="site3-blue">.</span></strong><small>SOLUTIONS / ENGENHARIA DIGITAL</small></span>
 </Link>
}
export default function Site3Chrome({children}:{children:React.ReactNode}){
 const pathname=usePathname()
 const [menu,setMenu]=useState<MenuName|null>(null)
 const closeTimer = useRef<ReturnType<typeof setTimeout>|null>(null)
 const cancelMenuClose = useCallback(()=>{if(closeTimer.current!==null){clearTimeout(closeTimer.current);closeTimer.current=null}},[])
 const openMenu = useCallback((next:MenuName)=>{cancelMenuClose();setMenu(next)},[cancelMenuClose])
 const scheduleMenuClose = useCallback(()=>{cancelMenuClose();closeTimer.current=setTimeout(()=>{setMenu(null);closeTimer.current=null},260)},[cancelMenuClose])
 const [mobileMenu,setMobileMenu]=useState(false)
 const [searchOpen,setSearchOpen]=useState(false)
 const [query,setQuery]=useState('')
 const [scrollPercent,setScrollPercent]=useState(0)
 const cursorGlowRef=useRef<HTMLDivElement>(null)
 const closeNav=useCallback(()=>{cancelMenuClose();setMenu(null);setMobileMenu(false)},[cancelMenuClose])
 const searchResults=useMemo(()=>siteLinks.filter(item=>item.label.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))),[query])
 useEffect(()=>{
   const onKey=(e:KeyboardEvent)=>{
     if(e.key==='Escape'){setMenu(null);setMobileMenu(false);setSearchOpen(false)}
     if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(open=>!open)}
   }
   document.addEventListener('keydown',onKey)
   return()=>{document.removeEventListener('keydown',onKey);cancelMenuClose()}
 },[cancelMenuClose])
 useEffect(()=>{
  let frame=0
  const update=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const limit=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);setScrollPercent(limit?Math.min(100,Math.max(0,Math.round(window.scrollY/limit*100))):0)})}
  update()
  window.addEventListener('scroll',update,{passive:true})
  window.addEventListener('resize',update)
  const observer=new ResizeObserver(update)
  observer.observe(document.documentElement)
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);observer.disconnect();if(frame)cancelAnimationFrame(frame)}
 },[pathname])
 const entries=menu==='services'?serviceCards:menu==='tools'?toolCards:moreCards
 const onGlassMouseMove=(e:React.MouseEvent<HTMLDivElement>)=>{
   if(cursorGlowRef.current){
     cursorGlowRef.current.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`
     cursorGlowRef.current.style.opacity='1'
   }
   const el=(e.target as HTMLElement).closest<HTMLElement>('.b3-card,.b3-blog-card,.site3-mega-card,.b3-footer-contact-links>a,.b3-primary,.b3-secondary,.site3-message-button,.b3-footer-social-links>a')
   if(!el)return
   const box=el.getBoundingClientRect()
   el.style.setProperty('--glass-x',e.clientX-box.left+'px')
   el.style.setProperty('--glass-y',e.clientY-box.top+'px')
 }
 return <div className="b3-root" id="top" onMouseMove={onGlassMouseMove} onMouseLeave={()=>{if(cursorGlowRef.current)cursorGlowRef.current.style.opacity="0"}}>
  <div ref={cursorGlowRef} className="b3-cursor-neon" aria-hidden="true"/>
  <div className="b3-dotworld" aria-hidden="true"/>
  <header className="site3-header" onMouseEnter={cancelMenuClose} onMouseLeave={scheduleMenuClose}>
   <nav className="site3-nav" aria-label="Navegação principal">
    <Brand/>
    <div className="site3-desktop-nav">
     <button className={'site3-nav-item'+(menu==='services'?' site3-nav-active':'')} onMouseEnter={()=>openMenu('services')} onFocus={()=>openMenu('services')} onClick={()=>{cancelMenuClose();setMenu(menu==='services'?null:'services')}} aria-expanded={menu==='services'}>Serviços <ChevronDown size={11}/></button>
     <Link className="site3-nav-item" href="/site3/metodo" onMouseEnter={scheduleMenuClose} onClick={closeNav}>Método</Link>
     <Link className="site3-nav-item" href="/site3/projetos" onMouseEnter={scheduleMenuClose} onClick={closeNav}>Projetos</Link>
     <button className={'site3-nav-item'+(menu==='tools'?' site3-nav-active':'')} onMouseEnter={()=>openMenu('tools')} onFocus={()=>openMenu('tools')} onClick={()=>{cancelMenuClose();setMenu(menu==='tools'?null:'tools')}} aria-expanded={menu==='tools'}>Ferramentas <span className="site3-nav-free">GRÁTIS</span><ChevronDown size={11}/></button>
     <button className={'site3-nav-item'+(menu==='more'?' site3-nav-active':'')} onMouseEnter={()=>openMenu('more')} onFocus={()=>openMenu('more')} onClick={()=>{cancelMenuClose();setMenu(menu==='more'?null:'more')}} aria-expanded={menu==='more'}>Mais <ChevronDown size={11}/></button>
     <Link className="site3-nav-item" href="/site3/contato" onMouseEnter={scheduleMenuClose} onClick={closeNav}>Contato</Link>
    </div>
    <div className="site3-nav-actions">
     <button className="site3-icon-button" aria-label="Pesquisar no site" onClick={()=>{setSearchOpen(true);setMenu(null)}}><Search size={18}/></button>
     <a className="site3-message-button" href={phone} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" width={15} height={15} aria-hidden="true"/> FALE CONOSCO <ArrowUpRight size={15}/></a>
     <button className="site3-mobile-toggle" aria-label={mobileMenu?'Fechar menu':'Abrir menu'} aria-expanded={mobileMenu} onClick={()=>{setMobileMenu(p=>!p);setMenu(null)}}>{mobileMenu?<X size={22}/>:<Menu size={22}/>}</button>
    </div>
   </nav>
   {menu&&<div className={'site3-mega-menu site3-mega-'+menu} onMouseEnter={cancelMenuClose} onMouseLeave={scheduleMenuClose}>
    <div className="site3-mega-eyebrow">{menu==='services'?'SERVIÇOS':menu==='tools'?'FERRAMENTAS GRATUITAS':'CONHEÇA A BAWERK'} <span>— {menu==='services'?'ENGENHARIA COM PROPÓSITO':menu==='tools'?'NAVEGUE SEM CADASTRO':'OUTRAS PÁGINAS'}</span></div>
    <div className={'site3-mega-grid'+(menu==='services'?'':' site3-mega-grid-3')}>
     {entries.map(item=><Link href={item.href} key={item.index} className="site3-mega-card" onClick={closeNav}>
       <span className="site3-mega-index">{item.index} / {item.cat}</span>
       <span className="site3-mega-title">{item.title} <ArrowUpRight size={15}/></span>
       <span className="site3-mega-desc">{item.desc}</span>
       <span className="site3-mega-art" aria-hidden="true"><span className="site3-mega-art-ring"/><span className="site3-mega-glyph">{item.symbol}</span><span className="site3-mega-art-pips">•••</span></span>
     </Link>)}
    </div>
   </div>}
   {mobileMenu&&<div className="site3-mobile-panel">
    {siteLinks.map(item=><Link key={item.href} href={item.href} onClick={closeNav}>{item.label}<ArrowUpRight size={14}/></Link>)}
    <a href={phone} target="_blank" rel="noopener noreferrer" onClick={closeNav}>WhatsApp <ArrowUpRight size={14}/></a>
   </div>}
  </header>
  <main className="b3-main">{children}</main>
  <footer className="b3-footer b3-footer-v2">
   <div className="b3-footer-contact-row">
    <span className="b3-overline">[ CONVERSE COM A BAWERK ]</span>
    <div className="b3-footer-contact-links">
     <a href="mailto:contato@bawerk.solutions"><span><span className="b3-footer-contact-icon"><ArrowUpRight size={18}/></span><span className="b3-footer-contact-copy"><strong>E-mail</strong><small>contato@bawerk.solutions</small></span></span><ArrowUpRight size={18}/></a>
     <a href={phone} target="_blank" rel="noopener noreferrer"><span><span className="b3-footer-contact-icon"><MessageCircle size={18}/></span><span className="b3-footer-contact-copy"><strong>WhatsApp</strong><small>(11) 99277-9039</small></span></span><ArrowUpRight size={18}/></a>
    </div>
   </div>
   <div className="b3-footer-hero">
    <div className="b3-footer-particle-globe" aria-hidden="true" />
    <span className="b3-overline">[ NOSSA MISSÃO ]</span>
    <h2 className="b3-footer-mission-title"><span className="b3-footer-mission-first"><span className="b3-mission-blue">VOCÊ</span> <span className="b3-mission-white">PODE IR</span> <span className="b3-mission-blue">ALÉM</span></span><span className="b3-footer-mission-second"><span className="b3-mission-white">DO QUE</span> <span className="b3-mission-blue">IMAGINA</span><span className="b3-mission-dot">.</span></span></h2>
   </div>
   <div className="b3-footer-follow">
    <span className="b3-overline">[ ACOMPANHE ]</span>
    <div className="b3-footer-social-links">
     <a href="https://www.instagram.com/Bawerksolutions/" target="_blank" rel="noopener noreferrer"><BrandIcon name="instagram" width={16} height={16}/> Instagram <ArrowUpRight size={13}/></a>
     <a href="https://www.facebook.com/Bawerksolutions/" target="_blank" rel="noopener noreferrer"><BrandIcon name="facebook" width={16} height={16}/> Facebook <ArrowUpRight size={13}/></a>
     <a href={phone} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" width={16} height={16}/> WhatsApp <ArrowUpRight size={13}/></a>
    </div>
   </div>
   <div className="b3-footer-grid b3-footer-navigation">
    <div><span className="b3-overline">SERVIÇOS</span><Link href="/site3/servicos">Desenvolvimento web</Link><Link href="/site3/softwares">Software sob medida</Link><Link href="/site3/aplicativos">Aplicativos Android e iOS</Link><Link href="/site3/servicos">CRM e automação</Link><Link href="/site3/servicos">Marketing e design</Link></div>
    <div><span className="b3-overline">EMPRESA</span><Link href="/site3/sobre">Sobre nós</Link><Link href="/site3/metodo">Nosso método</Link><Link href="/site3/projetos">Projetos</Link><Link href="/site3/contato">Contato</Link></div>
    <div><span className="b3-overline">ACESSO RÁPIDO</span><Link href="/site3/blog">Blog</Link><Link href="/site3/contato">Solicitar orçamento</Link><Link href="/site3/#diagnostico">Diagnóstico digital</Link><Link href="/site3">Página inicial</Link></div>
   </div>
   <div className="b3-footer-location-strip">
    <span className="b3-footer-location-badge">ATENDIMENTO DIGITAL · TODO O BRASIL</span>
    <span className="b3-footer-location-badge">TECNOLOGIA · DESIGN · EVOLUÇÃO</span>
   </div>
   <div className="b3-footer-bottom b3-footer-bottom-v2">
    <span>© {new Date().getFullYear()} BAWERK SOLUTIONS · TODOS OS DIREITOS RESERVADOS</span>
    <Link href="/site3">BAWERK SOLUTIONS <span className="b3-electric">•</span> VOCÊ PODE IR ALÉM DO QUE IMAGINA.</Link>
    <a href="#top">VOLTAR AO TOPO ↑</a>
   </div>
  </footer>
  <div className="b3-scroll-progress" aria-label={`Progresso da página: ${scrollPercent}%`}><span className="b3-scroll-progress-text">{String(scrollPercent).padStart(2,'0')}%</span><span className="b3-scroll-progress-track"><span style={{height:scrollPercent+'%'}}/></span><span className="b3-scroll-progress-caption">SCROLL</span></div>
  {searchOpen&&<div className="b3-search-mask" onMouseDown={e=>{if(e.target===e.currentTarget)setSearchOpen(false)}}>
   <section className="b3-search-dialog" role="dialog" aria-modal="true" aria-label="Pesquisar páginas">
    <div className="b3-search-input"><Search size={20}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar páginas..." aria-label="Pesquisar"/><button onClick={()=>setSearchOpen(false)} aria-label="Fechar pesquisa"><X size={19}/></button></div>
    <div className="b3-search-list">{searchResults.length?searchResults.map(item=><Link key={item.href} href={item.href} onClick={()=>{setSearchOpen(false);setQuery('')}}>{item.label}<ArrowUpRight size={15}/></Link>):<p>Nenhuma página encontrada.</p>}</div>
   </section>
  </div>}
 </div>
}