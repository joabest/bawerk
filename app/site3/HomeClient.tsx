'use client'
import Link from './PublicLink'
import {usePathname,useRouter} from 'next/navigation'
import dynamic from 'next/dynamic'
import {useEffect,useRef,useState} from 'react'
import {ArrowDown,ArrowRight,ArrowUpRight,Code2,Layers3,Search,Zap} from 'lucide-react'

const Globe3D=dynamic(()=>import('./Globe3D'),{ssr:false,loading:()=> <div className="b3-globe-loading">CARREGANDO GLOBO 3D...</div>})
type Location={city:string;latitude:number;longitude:number}
const frictions:[string,number,number][]=[
 ['meu site fica cada vez mais lento',64,62],
 ['os leads desaparecem antes de chegar à equipe',2,8],
 ['minha empresa faz tudo manualmente',70,10],
 ['preciso de um sistema para organizar minhas operações',2,40],
 ['quero crescer, mas não sei por onde começar',72,40],
 ['meus anúncios não trazem vendas',74,52],
 ['meu site cai toda semana',3,60],
 ['não sei meus números reais',36,78],
 ['não sei quem está sendo produtivo',58,86],
 ['planilhas demais, controle de menos',4,82],
 ['demoro a responder meus clientes',74,74],
 ['ninguém usa o meu CRM',6,50],
 ['perco orçamentos por falta de follow-up',18,70],
 ['meu site não aparece no Google',44,6],
 ['retrabalho em toda entrega',38,94]
]
const services=[
 {n:'01',name:'Sites e experiências digitais',text:'Design, performance e experiências web que destacam sua marca.'},
 {n:'02',name:'Softwares personalizados',text:'Sistemas empresariais, painéis, APIs e plataformas sob medida para sua operação.'},
 {n:'03',name:'Aplicativos para celular',text:'Desenvolvimento de apps Android e iOS, com interfaces modernas e integração com sistemas.'},
 {n:'04',name:'CRM e automação',text:'Leads, atendimento, notificações e processos conectados.'},
 {n:'05',name:'Marketing digital',text:'Campanhas e estratégias de aquisição e presença online.'},
 {n:'06',name:'Design e identidade visual',text:'Identidade, interfaces e experiências para fortalecer sua marca.'}
]
const steps=[
 {name:'Descobrir',description:'Objetivos, desafios, contexto e oportunidades.',icon:Search},
 {name:'Planejar',description:'Fluxos, interfaces e arquitetura técnica.',icon:Layers3},
 {name:'Desenvolver',description:'Criar, testar, aprimorar e integrar.',icon:Code2},
 {name:'Evoluir',description:'Analisar, otimizar e avançar continuamente.',icon:Zap}
]
export default function HomeClient(){
 const [location,setLocation]=useState<Location|null>(null)
 const [reducedMotion,setReducedMotion]=useState(false)
 const [friction,setFriction]=useState('')
 const [floatingPhrases,setFloatingPhrases]=useState<{index:number;x:number;y:number}[]>(()=>[0,2,4,7,10,12].map((index,i)=>({index,x:i%2===0?3:74,y:16+Math.floor(i/2)*29})))
 const [cloudLive,setCloudLive]=useState(false)
 const [phraseCycle,setPhraseCycle]=useState(0)
 const router=useRouter()
 const pathname=usePathname()
 const cloudRef=useRef<HTMLElement|null>(null)
 const inputRef=useRef<HTMLInputElement|null>(null)
 const [stepCount,setStepCount]=useState(0)
 const stageRef=useRef<HTMLElement|null>(null)
 useEffect(()=>{
   const motion=window.matchMedia('(prefers-reduced-motion: reduce)')
   setReducedMotion(motion.matches)
   try{const cached=sessionStorage.getItem('b3-loc');if(cached){const loc=JSON.parse(cached);if(typeof loc.city==='string'&&Number.isFinite(loc.latitude)&&Number.isFinite(loc.longitude)){setLocation(loc);return}}}catch{}
   const controller=new AbortController()
   const timeout=window.setTimeout(()=>controller.abort(),3500)
   const run=()=>fetch('https://ipapi.co/json/',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('IP location indisponível');return r.json()}).then(data=>{
     const lat=Number(data.latitude),lon=Number(data.longitude)
     if(!data.error&&typeof data.city==='string'&&Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180){
       const loc={city:data.city.slice(0,42),latitude:lat,longitude:lon}
       setLocation(loc)
       try{sessionStorage.setItem('b3-loc',JSON.stringify(loc))}catch{}
     }
   }).catch(()=>{}).finally(()=>{window.clearTimeout(timeout)})
   const w=window as unknown as {requestIdleCallback?:(cb:()=>void,o?:{timeout:number})=>number;cancelIdleCallback?:(id:number)=>void}
   const idle=w.requestIdleCallback?w.requestIdleCallback(run,{timeout:2000}):window.setTimeout(run,600)
   return ()=>{controller.abort();window.clearTimeout(timeout);if(w.cancelIdleCallback&&w.requestIdleCallback)w.cancelIdleCallback(idle);else window.clearTimeout(idle)}
 },[])
 useEffect(()=>{
   const el=cloudRef.current
   if(!el)return
   const io=new IntersectionObserver(([e])=>setCloudLive(e.isIntersecting),{rootMargin:'-5% 0px'})
   io.observe(el)
   return()=>io.disconnect()
 },[])
 useEffect(()=>{
   if(!cloudLive||reducedMotion)return
   const shuffle=()=>{
     const indexes=frictions.map((_,i)=>i)
     for(let i=indexes.length-1;i>0;i--){
       const j=Math.floor(Math.random()*(i+1))
       ;[indexes[i],indexes[j]]=[indexes[j],indexes[i]]
     }
     // One left and one right phrase in each of three bands.
     setFloatingPhrases(indexes.slice(0,6).map((index,i)=>({
       index,
       x:i%2===0?2+Math.random()*9:75+Math.random()*9,
       y:10+Math.floor(i/2)*28+Math.random()*10,
     })))
     setPhraseCycle(c=>c+1)
   }
   shuffle()
   const timer=window.setInterval(shuffle,5600)
   return()=>window.clearInterval(timer)
 },[cloudLive,reducedMotion])

 useEffect(()=>{
   const element=stageRef.current
   if(!element)return
   if(reducedMotion){setStepCount(4);return}
   let timer:number|undefined
   const observer=new IntersectionObserver(entries=>{
     if(!entries[0]?.isIntersecting)return
     observer.disconnect()
     let count=0
     timer=window.setInterval(()=>{
       count++
       setStepCount(count)
       if(count===4&&timer)window.clearInterval(timer)
     },700)
   },{threshold:.22})
   observer.observe(element)
   return()=>{observer.disconnect();if(timer)window.clearInterval(timer)}
 },[reducedMotion])
 const go=(text:string)=>{const v=text.trim();const route=pathname.startsWith('/site3')?'/site3/contato':'/contato';router.push(v?`${route}?desafio=${encodeURIComponent(v.slice(0,300))}`:route)}
 return <>
  <section className="b3-container b3-home-hero">
   <div className="b3-home-globe">
    <div className="b3-globe-canvas"><Globe3D location={location} reduceMotion={reducedMotion}/></div>
   </div>
   <div className="b3-home-copy">
    <span className="b3-overline">[ BAWERK SOLUTIONS / VOCÊ PODE IR ALÉM DO QUE IMAGINA ]</span>
    <h1>Sua parceira<br/><em>tecnológica<span className="b3-electric">.</span></em></h1>
    <p>Sites, softwares personalizados, aplicativos Android e iOS, CRM, automação, marketing e design. Tecnologia inteligente e experiências digitais que fazem a sua empresa evoluir.</p>
    <div className="b3-cta-row">
     <Link className="b3-primary" href="/site3/servicos">Explorar serviços <ArrowUpRight size={16}/></Link>
     <Link className="b3-secondary" href="/site3/contato">Falar sobre meu projeto <ArrowRight size={16}/></Link>
    </div>
    <div className="b3-home-stats"><span><strong>01</strong>Ideia</span><span><strong>02</strong>Estratégia</span><span><strong>03</strong>Execução</span></div>
   </div>
  </section>
  <div className="b3-container b3-scrollhint"><span>CRIANDO O QUE AINDA NÃO EXISTE</span><span>ROLE PARA EXPLORAR <ArrowDown size={13} style={{display:'inline'}}/></span></div>
  <section ref={cloudRef} className={'b3-container b3-friction'+(cloudLive&&!reducedMotion?' b3-cloud-live':'')} id="diagnostico">
   <span className="b3-overline">[ DIAGNÓSTICO / DESAFIOS REAIS ]</span>
   <h2>O que está te <span className="b3-electric">travando?</span></h2>
   <p>Você nomeia o atrito. Nós mapeamos a solução.<br/>Veja o que acontece depois.</p>
   <form className="b3-friction-input" onSubmit={e=>{e.preventDefault();go(friction)}}>
    <input ref={inputRef} value={friction} onChange={e=>setFriction(e.target.value)} maxLength={300} placeholder="meu site fica cada vez mais lento" aria-label="Descreva o que está dificultando seu crescimento"/>
    <button type="submit" aria-label="Enviar desafio"><ArrowRight size={18}/></button>
   </form>
   <div className="b3-cloud" aria-label="Desafios comuns. Clique em um para usar no diagnóstico.">
    {floatingPhrases.map(({index,x,y})=><button type="button" key={`${phraseCycle}-${index}`} className="b3-chip-float" style={{'--x':x+'%','--y':y+'%'} as React.CSSProperties} onClick={()=>setFriction(frictions[index][0])}>{frictions[index][0]} <span aria-hidden="true">↗</span></button>)}
   </div>
  </section>
  <section className="b3-container b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ O QUE FAZEMOS ]</span><Link href="/site3/servicos" className="b3-forward">Todos os serviços <ArrowUpRight size={15}/></Link></div>
   <h2>Soluções digitais<span className="b3-dot-blue">.</span><br/><span className="b3-electric">Resultados reais<span className="b3-dot-white">.</span></span></h2>
   <div className="b3-cols3">{services.map(s=><Link className="b3-card" href="/site3/servicos" key={s.n}><span className="b3-card-index">{s.n} / BAWERK</span><h3 className="b3-card-title">{s.name}</h3><p className="b3-card-copy">{s.text}</p><span className="b3-forward">Descobrir <ArrowUpRight size={15}/></span></Link>)}</div>
  </section>
  <section ref={stageRef} className="b3-container b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ NOSSO MÉTODO ]</span><Link href="/site3/metodo" className="b3-forward">Conhecer o método <ArrowUpRight size={16}/></Link></div>
   <h2>Do primeiro desafio<br/><span className="b3-electric">à evolução contínua<span className="b3-dot-white">.</span></span></h2>
   <div className="b3-cols4 b3-steps">{steps.map((step,i)=>{const Icon=step.icon;return <div key={step.name} className={'b3-card'+(stepCount>i?' b3-step-on':'')}><span className="b3-card-index">{String(i+1).padStart(2,'0')} / 04</span><div className="b3-step-ico"><Icon size={27}/></div><h3 className="b3-card-title">{step.name}</h3><p className="b3-card-copy">{step.description}</p></div>})}</div>
  </section>
  <section className="b3-container b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ CONTEÚDO & IDEIAS ]</span><Link href="/site3/blog" className="b3-forward">Acessar o blog <ArrowUpRight size={16}/></Link></div>
   <h2>Conhecimento que<br/><span className="b3-electric">move negócios<span className="b3-dot-white">.</span></span></h2>
   <p className="b3-section-lead">Artigos sobre inteligência artificial, desenvolvimento de softwares, aplicativos para Android e iOS, CRM, design e automação.</p>
   <div className="b3-cta-row"><Link href="/site3/blog" className="b3-secondary">Explorar todos os artigos <ArrowUpRight size={16}/></Link><Link href="/site3/sobre" className="b3-secondary">Conhecer a Bawerk <ArrowRight size={16}/></Link></div>
  </section>
 </>
}