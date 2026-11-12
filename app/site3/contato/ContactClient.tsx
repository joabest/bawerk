'use client'
import {useEffect,useRef,useState} from 'react'
import Link from '../PublicLink'
import {ArrowUpRight,CheckCircle2,Mail,MapPin,Phone,Send} from 'lucide-react'

type Status='idle'|'sending'|'sent'|'error'
const phone='https://wa.me/5511992779039'
export default function ContactPage(){
 const [status,setStatus]=useState<Status>('idle')
 const [error,setError]=useState('')
 const messageRef=useRef<HTMLTextAreaElement>(null)
 useEffect(()=>{
  const desafio=new URLSearchParams(window.location.search).get('desafio')
  if(desafio&&messageRef.current&&!messageRef.current.value)messageRef.current.value=`Meu desafio: ${desafio.slice(0,300)}\n\n`
 },[])
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault()
  if(status==='sending')return
  const form=event.currentTarget
  const data=new FormData(form)
  if(data.get('website'))return
  const body={
   name:String(data.get('name')||'').trim(),
   company:String(data.get('company')||'').trim(),
   email:String(data.get('email')||'').trim(),
   phone:String(data.get('phone')||'').trim(),
   service:String(data.get('service')||'').trim(),
   message:String(data.get('message')||'').trim(),
   budget:'A definir — Site 3',
  }
  if(!body.phone){setError('Informe um telefone ou WhatsApp para contato.');setStatus('error');return}
  setStatus('sending');setError('')
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})
   const json=await response.json()
   if(!response.ok)throw Error(json.error||'Não foi possível enviar sua mensagem.')
   setStatus('sent');form.reset()
  }catch(e){
   setError(e instanceof Error?e.message:'Falha na comunicação. Tente novamente ou use o WhatsApp.')
   setStatus('error')
  }
 }
 return <div className="b3-container">
  <header className="b3-page-head"><span className="b3-overline">[ CONTATO / INICIE SUA IDEIA ]</span><h1 className="b3-contact-headline"><span>Conte sua ideia<span className="b3-dot-blue">.</span></span><em>Vamos construir<span className="b3-dot-white">.</span></em></h1><p>Envie o briefing da sua empresa. Seu contato entra diretamente no sistema de atendimento da Bawerk.</p></header>
  <div className="b3-contact-grid">
   <aside className="b3-contact-info">
    <span className="b3-overline">[ FALE COM A EQUIPE ]</span>
    <h2 className="b3-section-title">Toda boa solução começa com uma conversa<span className="b3-dot-blue">.</span></h2>
    <p>Descreva seu projeto, serviço desejado ou desafio atual. Vamos entender sua necessidade e indicar o próximo passo.</p>
    <div style={{marginTop:38,display:'grid',gap:18}}>
     <a href={phone} target="_blank" rel="noreferrer" className="b3-card"><Phone size={22} color="#43bfff"/><h3 className="b3-card-title">WhatsApp</h3><p className="b3-card-copy">(11) 99277-9039</p></a>
     <a href="mailto:contato@bawerk.solutions" className="b3-card"><Mail size={22} color="#43bfff"/><h3 className="b3-card-title">E-mail</h3><p className="b3-card-copy">contato@bawerk.solutions</p></a>
     <div className="b3-card"><MapPin size={22} color="#43bfff"/><h3 className="b3-card-title">São Paulo</h3><p className="b3-card-copy">Vila Pierina · São Paulo — SP<br/>Projetos em todo o Brasil.</p></div>
    </div>
   </aside>
   <form className="b3-contact-form" onSubmit={submit}>
    <div className="b3-section-top"><span className="b3-overline">[ FORMULÁRIO DE CONTATO ]</span><span className="b3-overline">CAMPOS COM * OBRIGATÓRIOS</span></div>
    <div className="b3-field-grid">
     <label className="b3-field"><span>Nome *</span><input name="name" minLength={2} maxLength={100} required placeholder="Seu nome completo" autoComplete="name"/></label>
     <label className="b3-field"><span>Empresa</span><input name="company" maxLength={120} placeholder="Nome da empresa" autoComplete="organization"/></label>
     <label className="b3-field"><span>Telefone ou WhatsApp *</span><input name="phone" required inputMode="tel" type="tel" minLength={8} maxLength={25} placeholder="(11) 99999-9999" autoComplete="tel"/></label>
     <label className="b3-field"><span>E-mail *</span><input name="email" type="email" required maxLength={150} placeholder="voce@empresa.com" autoComplete="email"/></label>
    </div>
    <label className="b3-field"><span>Serviço de interesse</span><select name="service" defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Website ou landing page</option><option>Software sob medida</option><option>CRM</option><option>Automação e inteligência artificial</option><option>Marketing digital</option><option>Design e identidade visual</option><option>Outro / ainda não sei</option></select></label>
    <label className="b3-field"><span>Conte sobre o projeto *</span><textarea ref={messageRef} name="message" minLength={10} maxLength={2500} required placeholder="O que você quer criar, melhorar ou automatizar?" rows={6}/></label>
    <div style={{display:'none'}} aria-hidden="true"><label>Não preencha<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <p className="b3-form-note">Seus dados serão usados apenas para responder ao seu contato. O envio é feito diretamente pelo formulário da Bawerk.</p>
    <button className="b3-primary" type="submit" disabled={status==='sending'} style={{marginTop:22,width:'100%'}}>{status==='sending'?'ENVIANDO...':'ENVIAR SOLICITAÇÃO'} <Send size={16}/></button>
    {status==='sent'&&<p className="b3-form-status" role="status"><CheckCircle2 size={16} style={{display:'inline',marginRight:8}}/>Mensagem enviada. A Bawerk entrará em contato.</p>}
    {status==='error'&&<p className="b3-form-status" role="alert">{error} <a href={phone} target="_blank" rel="noreferrer">Conversar pelo WhatsApp <ArrowUpRight size={13}/></a></p>}
   </form>
  </div>
  <section className="b3-section"><div className="b3-section-top"><span className="b3-overline">[ CONTINUE EXPLORANDO ]</span></div><div className="b3-cta-row"><Link className="b3-secondary" href="/site3/servicos">Conheça os serviços <ArrowUpRight size={16}/></Link><Link className="b3-secondary" href="/site3/sobre">Sobre a Bawerk <ArrowUpRight size={16}/></Link></div></section>
 </div>
}
