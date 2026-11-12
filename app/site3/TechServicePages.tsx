import Link from './PublicLink'
import {ArrowUpRight, Smartphone, Code2, BellRing, LockKeyhole, Database, Settings2, Layers3, MonitorSmartphone} from 'lucide-react'
import type { ReactNode } from 'react'

function Layout({eyebrow,headline,accent,description,children}:{eyebrow:string;headline:string;accent:string;description:string;children:ReactNode}){
 return <div className="b3-container">
  <header className="b3-page-head">
   <span className="b3-overline">[ {eyebrow} / BAWERK SOLUTIONS ]</span>
   <h1>{headline}<br/><em>{accent}<span className="b3-dot-white">.</span></em></h1>
   <p>{description}</p>
   <div className="b3-cta-row" style={{justifyContent:'center'}}><Link href="/site3/contato" className="b3-primary">Solicitar um orçamento <ArrowUpRight size={17}/></Link><Link href="/site3/servicos" className="b3-secondary">Todos os serviços <ArrowUpRight size={17}/></Link></div>
  </header>
  {children}
 </div>
}
const steps=[
 {n:'01',title:'Entendimento',description:'Objetivos do negócio, público, plataformas e funções essenciais.'},
 {n:'02',title:'Arquitetura e design',description:'Prototipação, telas, banco de dados, segurança e integrações.'},
 {n:'03',title:'Desenvolvimento',description:'Construção iterativa, testes e validação das jornadas.'},
 {n:'04',title:'Entrega e evolução',description:'Preparação para distribuição, manutenção e próximos aprimoramentos.'}
]
export function MobileAppsPage(){
 const features=[
 {Icon:Smartphone,title:'Apps para Android e iOS',description:'Desenvolvimento de aplicativos personalizados para smartphones e tablets, pensando em navegação, desempenho e usabilidade.'},
 {Icon:BellRing,title:'Notificações e recursos mobile',description:'Fluxos de alertas, permissões do aparelho, acesso a funcionalidades do dispositivo e notificações quando o escopo exigir.'},
 {Icon:Database,title:'Aplicativos conectados',description:'Integração de aplicativos com CRM, APIs, autenticação, painéis administrativos e bancos de dados.'},
 {Icon:LockKeyhole,title:'Segurança e privacidade',description:'Controle de acesso, tratamento de dados e boas práticas de desenvolvimento de acordo com as necessidades do projeto.'},
 ]
 return <Layout eyebrow="APLICATIVOS MOBILE" headline="Aplicativos para" accent="seu negócio" description="A BAWERK SOLUTIONS também desenvolve aplicativos para celular: soluções Android e iOS sob medida, conectadas à sua operação e à experiência dos seus clientes.">
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ DESENVOLVIMENTO MOBILE ]</span><span className="b3-overline">ANDROID / IOS</span></div>
   <h2>Da ideia à tela<span className="b3-dot-blue">.</span></h2><p className="b3-section-lead">Um app pode ajudar a vender, atender, monitorar operações e facilitar tarefas. Construímos cada solução com base no objetivo, sem vender funcionalidades desnecessárias.</p>
   <div className="b3-cols2" style={{marginTop:32}}>{features.map(({Icon,title,description})=><article className="b3-card" key={title}><Icon size={29} color="#42b7ff"/><h3 className="b3-card-title">{title}</h3><p className="b3-card-copy">{description}</p></article>)}</div>
  </section>
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ ETAPAS DO PROJETO ]</span></div><div className="b3-cols4">{steps.map(step=><article className="b3-card" key={step.n}><span className="b3-card-index">{step.n} / 04</span><h3 className="b3-card-title">{step.title}</h3><p className="b3-card-copy">{step.description}</p></article>)}</div></section>
  <section className="b3-section"><h2>Seu próximo aplicativo<br/><span className="b3-electric">começa aqui<span className="b3-dot-white">.</span></span></h2><p className="b3-section-lead">Conte se você precisa de um app interno para sua equipe, um produto para clientes ou um aplicativo conectado ao seu sistema.</p><Link href="/site3/contato" className="b3-primary">Conversar sobre meu aplicativo <ArrowUpRight size={16}/></Link></section>
 </Layout>
}
export function CustomSoftwarePage(){
 const features=[
 {Icon:Code2,title:'Sistemas e plataformas',description:'Sistemas web empresariais, portais, plataformas de serviços, soluções internas e fluxos específicos de negócio.'},
 {Icon:Layers3,title:'Painéis e CRM',description:'Gestão de leads, usuários, propostas, notificações, tarefas, relatórios e processos comerciais.'},
 {Icon:Database,title:'APIs e integrações',description:'Comunicação entre aplicativos, sites, bancos de dados, automações e sistemas externos.'},
 {Icon:Settings2,title:'Manutenção e evolução',description:'Melhorias incrementais, desempenho, monitoramento e mudanças de funcionalidades conforme novas demandas.'},
 ]
 return <Layout eyebrow="SOFTWARE SOB MEDIDA" headline="Softwares que" accent="fazem sentido" description="A BAWERK SOLUTIONS cria softwares personalizados para empresas que precisam organizar dados, automatizar rotinas ou oferecer novas experiências digitais.">
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ ENGENHARIA DE SOFTWARE ]</span><span className="b3-overline">WEB / SISTEMAS / APIs</span></div>
   <h2>Uma solução para<br/><span className="b3-electric">seu jeito de trabalhar<span className="b3-dot-white">.</span></span></h2><p className="b3-section-lead">Não é necessário adaptar sua empresa a uma ferramenta rígida. Um software sob medida pode centralizar operações, conectar departamentos e gerar informação útil para decisões.</p>
   <div className="b3-cols2" style={{marginTop:32}}>{features.map(({Icon,title,description})=><article className="b3-card" key={title}><Icon size={29} color="#42b7ff"/><h3 className="b3-card-title">{title}</h3><p className="b3-card-copy">{description}</p></article>)}</div>
  </section>
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ DO DIAGNÓSTICO À ENTREGA ]</span></div><div className="b3-cols4">{steps.map(step=><article className="b3-card" key={step.n}><span className="b3-card-index">{step.n} / 04</span><h3 className="b3-card-title">{step.title}</h3><p className="b3-card-copy">{step.description}</p></article>)}</div></section>
  <section className="b3-section"><h2>Transforme processos<br/><span className="b3-electric">em possibilidades<span className="b3-dot-white">.</span></span></h2><p className="b3-section-lead">Descreva o problema que o seu sistema precisa resolver e as ferramentas que ele deve integrar.</p><Link href="/site3/contato" className="b3-primary">Falar sobre meu software <ArrowUpRight size={16}/></Link></section>
 </Layout>
}
