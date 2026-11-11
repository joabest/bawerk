'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {useEffect,useRef,useState} from 'react'
import {ArrowDown,ArrowRight,ArrowUpRight,Code2,Layers3,Search,Zap} from 'lucide-react'

const Globe3D=dynamic(()=>import('./Globe3D'),{ssr:false,loading:()=> <div className="b3-globe-loading">CARREGANDO GLOBO 3D...</div>})
type Location={city:string;latitude:number;longitude:number}
const challenges=[
 'meu site fica cada vez mais lento',
 'os leads desaparecem antes de chegar à equipe',
 'minha empresa faz tudo manualmente',
 'preciso de um sistema para organizar minhas operações',
 'quero crescer, mas não sei por onde começar'
]
const services=[
 {n:'01',name:'Sites e experiências digitais',text:'Design, performance e experiências web que destacam sua marca.'},
 {n:'02',name:'Softwares e plataformas',text:'Sistemas sob medida para a realidade da sua operação.'},
 {n:'03',name:'CRM e automação',text:'Leads, atendimento, notificações e processos conectados.'},
 {n:'04',name:'Marketing e design',text:'Identidade, campanhas e presença digital profissional.'}
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
 const [challenge,setChallenge]=useState(0)
 const [stepCount,setStepCount]=useState(0)
 const stageRef=useRef<HTMLElement|null>(null)
 useEffect(()=>{
   const motion=window.matchMedia('(prefers-reduced-motion: reduce)')
   setReducedMotion(motion.matches)
   const controller=new AbortController()
   fetch('https://ipapi.co/json/',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('IP location indisponível');return r.json()}).then(data=>{
     const lat=Number(data.latitude),lon=Number(data.longitude)
     if(!data.error&&typeof data.city==='string'&&Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180){
       setLocation({city:data.city.slice(0,42),latitude:lat,longitude:lon})
     }
   }).catch(()=>{})
   return ()=>controller.abort()
 },[])
 useEffect(()=>{
   if(reducedMotion)return
   const id=window.setInterval(()=>setChallenge(old=>(old+1)%challenges.length),2900)
   return()=>window.clearInterval(id)
 },[reducedMotion])
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
 return <>
  <section className="b3-container b3-home-hero">
   <div>
    <span className="b3-overline">[ BAWERK SOLUTIONS / ENGENHARIA DIGITAL ]</span>
    <h1>Você pode ir <em>além do que imagina.</em></h1>
    <p>Sites, softwares, CRM, automação, marketing e design. Tecnologia inteligente e experiências digitais que fazem a sua empresa evoluir.</p>
    <div className="b3-cta-row">
     <Link className="b3-primary" href="/site3/servicos">Explorar serviços <ArrowUpRight size={16}/></Link>
     <Link className="b3-secondary" href="/site3/contato">Falar sobre meu projeto <ArrowRight size={16}/></Link>
    </div>
    <div className="b3-home-stats"><span><strong>01</strong>Ideia</span><span><strong>02</strong>Estratégia</span><span><strong>03</strong>Execução</span></div>
   </div>
   <div className="b3-home-globe">
    <div className="b3-globe-canvas"><Globe3D location={location} reduceMotion={reducedMotion}/></div>
    <div className="b3-overline" style={{position:'absolute',bottom:12,left:20}}><span className="b3-live"/> {location?location.city.toUpperCase():'LOCALIZAÇÃO GLOBAL'} · REDE CONECTADA</div>
   </div>
  </section>
  <div className="b3-container" style={{borderTop:'1px solid #242d35',paddingTop:20,display:'flex',justifyContent:'space-between',font:'10px DM Mono,monospace',letterSpacing:'.13em',color:'#9ab2c5'}}><span>CRIANDO O QUE AINDA NÃO EXISTE</span><span>ROLE PARA EXPLORAR <ArrowDown size={13} style={{display:'inline'}}/></span></div>
  <section className="b3-container b3-friction">
   <span className="b3-overline">[ DIAGNÓSTICO / DESAFIOS REAIS ]</span>
   <h2>O que está <span className="b3-electric">dificultando</span> seu crescimento?</h2>
   <p>Conte o que está dificultando seu crescimento. Nós ajudamos a encontrar o melhor caminho.</p>
   <div key={challenge} className="b3-floatline"><span>✳</span>{challenges[challenge]}</div>
   <Link className="b3-forward" href="/site3/contato">Encontrar uma solução <ArrowUpRight size={16}/></Link>
  </section>
  <section className="b3-container b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ O QUE FAZEMOS ]</span><Link href="/site3/servicos" className="b3-forward">Todos os serviços <ArrowUpRight size={15}/></Link></div>
   <h2>Soluções digitais.<br/><span className="b3-electric">Resultados reais.</span></h2>
   <div className="b3-cols4">{services.map(s=><Link className="b3-card" href="/site3/servicos" key={s.n}><span className="b3-card-index">{s.n} / BAWERK</span><h3 className="b3-card-title">{s.name}</h3><p className="b3-card-copy">{s.text}</p><span className="b3-forward">Descobrir <ArrowUpRight size={15}/></span></Link>)}</div>
  </section>
  <section ref={stageRef} className="b3-container b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ NOSSO MÉTODO ]</span><Link href="/site3/metodo" className="b3-forward">Conhecer o método <ArrowUpRight size={16}/></Link></div>
   <h2>Do primeiro desafio<br/><span className="b3-electric">à evolução contínua.</span></h2>
   <div className="b3-cols4 b3-steps">{steps.map((step,i)=>{const Icon=step.icon;return <div key={step.name} className={'b3-card'+(stepCount>i?' b3-step-on':'')}><span className="b3-card-index">{String(i+1).padStart(2,'0')} / 04</span><div className="b3-step-ico"><Icon size={27}/></div><h3 className="b3-card-title">{step.name}</h3><p className="b3-card-copy">{step.description}</p></div>})}</div>
  </section>
  <section className="b3-container b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ CONTEÚDO & IDEIAS ]</span><Link href="/site3/blog" className="b3-forward">Acessar o blog <ArrowUpRight size={16}/></Link></div>
   <h2>Conhecimento que<br/><span className="b3-electric">move negócios.</span></h2>
   <p className="b3-section-lead">Artigos sobre inteligência artificial, desenvolvimento, CRM, design, automação e decisões melhores com tecnologia.</p>
   <div className="b3-cta-row"><Link href="/site3/blog" className="b3-secondary">Explorar todos os artigos <ArrowUpRight size={16}/></Link><Link href="/site3/sobre" className="b3-secondary">Conhecer a Bawerk <ArrowRight size={16}/></Link></div>
  </section>
 </>
}