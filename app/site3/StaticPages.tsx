import Link from 'next/link'
import {ArrowUpRight,Code2,Globe2,Layers3,Palette,Search,Settings2,TrendingUp,Zap} from 'lucide-react'

const services=[
 {n:'01',title:'Sites e experiências digitais',category:'WEB / UX',text:'Sites institucionais, landing pages, interfaces e experiências 3D responsivas. Foco em clareza, velocidade e conversão.',tags:['Next.js','UI/UX','Performance']},
 {n:'02',title:'Softwares sob medida',category:'ENGENHARIA',text:'Painéis administrativos, softwares empresariais, plataformas de atendimento e sistemas construídos para seus processos.',tags:['Sistemas','Plataformas','APIs']},
 {n:'03',title:'CRM e gestão comercial',category:'NEGÓCIOS',text:'Organização de leads, funis, orçamentos, notificações, dashboards e relacionamento com clientes.',tags:['Leads','CRM','Dashboards']},
 {n:'04',title:'Automação e inteligência artificial',category:'EFICIÊNCIA',text:'Integrações, agentes assistivos e fluxos de trabalho que reduzem tarefas repetitivas.',tags:['Automação','IA','Integrações']},
 {n:'05',title:'Marketing digital',category:'CRESCIMENTO',text:'Estratégia digital, campanhas, conteúdo e presença de marca para ampliar oportunidades.',tags:['Campanhas','SEO','Conteúdo']},
 {n:'06',title:'Identidade visual e design',category:'CRIATIVIDADE',text:'Design de marca, materiais gráficos, animações, layouts e sistemas visuais consistentes.',tags:['Branding','Motion','Design']},
]
const process=[
 {n:'01',title:'Descobrir',desc:'Objetivos, desafios, contexto e oportunidades.',extra:'Escutamos sua equipe, entendemos a jornada do cliente e priorizamos o que precisa mudar.',icon:Search},
 {n:'02',title:'Planejar',desc:'Fluxos, interfaces e arquitetura técnica.',extra:'Organizamos prioridades, desenhamos jornadas e definimos uma estrutura viável para o projeto.',icon:Layers3},
 {n:'03',title:'Desenvolver',desc:'Criar, testar, aprimorar e integrar.',extra:'Construímos interfaces e sistemas, validamos funcionalidades e conectamos ferramentas.',icon:Code2},
 {n:'04',title:'Evoluir',desc:'Analisar, otimizar e avançar continuamente.',extra:'Acompanhamos resultados, ajustamos o produto e planejamos os próximos ciclos.',icon:TrendingUp},
]
const projects=[
 {n:'01',name:'OSPE Floor',kind:'Experiência digital',url:'https://ospefloor.com.br/',text:'Presença digital de produtos e soluções para revestimentos.'},
 {n:'02',name:'Linara Decorações',kind:'Site institucional',url:'https://www.linaradecoracao.com.br',text:'Apresentação digital de soluções em decoração e ambientes.'},
 {n:'03',name:'DINATOP Decorações',kind:'Presença digital',url:'https://www.dinatopdecoracoes.com.br',text:'Estrutura de apresentação, catálogo e atendimento ao público.'},
]
function Head({eyebrow,title,desc}:{eyebrow:string;title:React.ReactNode;desc:string}){
 return <header className="b3-page-head"><span className="b3-overline">[ {eyebrow} ]</span><h1>{title}</h1><p>{desc}</p></header>
}
export function ServicesPage(){
 return <div className="b3-container">
  <Head eyebrow="01 / SERVIÇOS" title={<>Tecnologia para <em>ir além.</em></>} desc="Uma operação mais conectada, uma marca mais forte e produtos digitais criados para gerar valor."/>
  <section className="b3-section">
   <div className="b3-section-top"><span className="b3-overline">[ CAPACIDADES ]</span><span className="b3-overline">06 FRENTES / SOLUÇÕES SOB MEDIDA</span></div>
   <div className="b3-service-stack">{services.map(s=><article className="b3-card" key={s.n}><span className="b3-card-index">{s.n} / {s.category}</span><h2 className="b3-card-title">{s.title}</h2><p className="b3-card-copy">{s.text}</p><div className="b3-chips">{s.tags.map(t=><span key={t} className="b3-chip">{t}</span>)}</div><Link className="b3-forward" href="/site3/contato">Conversar sobre este serviço <ArrowUpRight size={15}/></Link></article>)}</div>
  </section>
  <section className="b3-section"><h2>Seu negócio é único.<br/><span className="b3-electric">A solução também.</span></h2><p className="b3-section-lead">Criamos uma arquitetura adequada aos objetivos e recursos da sua empresa, sem depender de modelos engessados.</p><div className="b3-cta-row"><Link className="b3-primary" href="/site3/contato">Solicitar proposta <ArrowUpRight size={15}/></Link></div></section>
 </div>
}
export function MethodPage(){
 return <div className="b3-container">
  <Head eyebrow="02 / MÉTODO" title={<>Processo claro.<br/><em>Execução inteligente.</em></>} desc="Do primeiro diagnóstico à melhoria contínua: cada etapa tem um objetivo e uma entrega."/>
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ COMO CONSTRUÍMOS ]</span><span className="b3-overline">04 ETAPAS / UMA DIREÇÃO</span></div><div className="b3-cols2">{process.map(s=>{const Icon=s.icon;return <article className="b3-card" key={s.n}><span className="b3-card-index">{s.n} / 04</span><div className="b3-step-ico"><Icon size={28}/></div><h2 className="b3-card-title">{s.title}</h2><p className="b3-card-copy">{s.desc}</p><p className="b3-card-copy">{s.extra}</p></article>})}</div></section>
  <section className="b3-section"><h2>A tecnologia evolui.<br/><span className="b3-electric">Seu negócio também.</span></h2><Link className="b3-primary" href="/site3/contato">Iniciar um projeto <ArrowUpRight size={16}/></Link></section>
 </div>
}
export function ProjectsPage(){
 return <div className="b3-container">
  <Head eyebrow="03 / PROJETOS" title={<>Ideias reais.<br/><em>Experiências marcantes.</em></>} desc="Alguns projetos e soluções apresentados pela Bawerk. Cada negócio exige identidade, desempenho e estratégia."/>
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ PROJETOS SELECIONADOS ]</span><span className="b3-overline">ABRIR PROJETO ↗</span></div><div style={{display:'grid',gap:14}}>{projects.map(s=><article className="b3-card b3-project-card" key={s.n}><div><span className="b3-card-index">{s.n} / {s.kind.toUpperCase()}</span><h3>{s.name}</h3><p className="b3-card-copy">{s.text}</p></div><a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={'Visitar '+s.name}>VISITAR SITE <ArrowUpRight size={16}/></a></article>)}</div></section>
  <section className="b3-section"><h2>Seu próximo projeto<br/><span className="b3-electric">pode estar aqui.</span></h2><Link className="b3-primary" href="/site3/contato">Falar sobre minha ideia <ArrowUpRight size={16}/></Link></section>
 </div>
}
export function AboutPage(){
 return <div className="b3-container">
  <Head eyebrow="04 / SOBRE A BAWERK" title={<>Você pode ir além<br/><em>do que imagina.</em></>} desc="BAWERK SOLUTIONS · Engenharia, tecnologia, criatividade e estratégia para empresas que querem evoluir."/>
  <section className="b3-section b3-cols2">
   <article className="b3-card"><span className="b3-card-index">[ NOSSA ESSÊNCIA ]</span><h2 className="b3-card-title">Criar o que ainda não existe.</h2><p className="b3-card-copy">A Bawerk Solutions une desenvolvimento web, softwares personalizados, CRM, automação, marketing e design para transformar desafios reais em soluções digitais claras, modernas e funcionais.</p><p className="b3-card-copy">Combinamos engenharia e experiência visual para que cada projeto tenha uma identidade própria e uma estrutura preparada para crescer.</p></article>
   <article className="b3-card"><span className="b3-card-index">[ NOSSA VISÃO ]</span><h2 className="b3-card-title">Menos complexidade. Mais possibilidades.</h2><p className="b3-card-copy">Queremos tornar a tecnologia útil no dia a dia de pessoas e empresas. Isso significa entender o contexto antes de escolher as ferramentas e manter a experiência simples para quem utiliza.</p><p className="b3-card-copy">Pensamos em performance, acessibilidade, integrações e evolução contínua desde o início.</p></article>
  </section>
  <section className="b3-section"><div className="b3-cols3">
   <div className="b3-card"><Globe2 color="#45beff" size={32}/><h3 className="b3-card-title">Conexão</h3><p className="b3-card-copy">Tecnologia aproximando empresas, equipes e clientes.</p></div>
   <div className="b3-card"><Settings2 color="#45beff" size={32}/><h3 className="b3-card-title">Engenharia</h3><p className="b3-card-copy">Soluções com atenção à arquitetura e à manutenção.</p></div>
   <div className="b3-card"><Palette color="#45beff" size={32}/><h3 className="b3-card-title">Criatividade</h3><p className="b3-card-copy">Design pensado para comunicar e facilitar decisões.</p></div>
  </div></section>
  <section className="b3-section"><h2>Vamos construir<br/><span className="b3-electric">a próxima etapa?</span></h2><Link className="b3-primary" href="/site3/contato">Entrar em contato <ArrowUpRight size={16}/></Link></section>
 </div>
}
