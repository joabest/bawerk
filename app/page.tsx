import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mensagem temporária | Bawerk Solutions',
  description: 'Mensagem de brincadeira exibida temporariamente na página inicial.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://bawerk.solutions/' },
}

export default function Page() {
  return (
    <section aria-label="Mensagem temporária de brincadeira" style={{
      minHeight:'76vh',display:'flex',alignItems:'center',justifyContent:'center',
      padding:'110px 22px 100px',textAlign:'center',position:'relative',
    }}>
      <div style={{maxWidth:930}}>
        <span style={{
          display:'inline-block',fontSize:11,letterSpacing:'.19em',
          color:'#8293ac',marginBottom:26,fontFamily:'monospace'
        }}>[ MENSAGEM TEMPORÁRIA / BRINCADEIRA ]</span>
        <h1 style={{
          margin:0,fontSize:'clamp(39px,7vw,92px)',fontWeight:750,
          lineHeight:1.06,letterSpacing:'-.065em',color:'#fff'
        }}>
          Esse site foi hackeado pelo escritório do{' '}
          <span style={{color:'#0026c0'}}>Ulisses Pena Máxima.</span>
        </h1>
        <p style={{marginTop:32,fontSize:14,color:'#9faabb',lineHeight:1.7}}>
          Mensagem humorística. O site não sofreu invasão.
        </p>
      </div>
    </section>
  )
}
