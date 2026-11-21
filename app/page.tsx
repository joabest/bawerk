import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site fora do ar | BAWERK SOLUTIONS',
  description: 'Página temporária da BAWERK SOLUTIONS.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#07090e', color: '#f5f7ff', padding: '24px', fontFamily: 'Arial, Helvetica, sans-serif', textAlign: 'center' }}>
      <section style={{ maxWidth: 760, width: '100%' }}>
        <div style={{ fontSize: 13, letterSpacing: '0.32em', fontWeight: 700, color: '#6387ff', marginBottom: 40 }}>BAWERK SOLUTIONS</div>
        <div style={{ display: 'inline-block', padding: '9px 16px', border: '1px solid #29344c', borderRadius: 40, fontSize: 12, letterSpacing: '0.13em', color: '#c0c9dc', marginBottom: 24 }}>SITE TEMPORARIAMENTE FORA DO AR</div>
        <h1 style={{ margin: 0, fontSize: 'clamp(42px, 9vw, 100px)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.06em' }}>O Léo <span style={{ color: '#345cff' }}>Mil Grau</span></h1>
        <p style={{ color: '#a0abc1', fontSize: 17, lineHeight: 1.7, margin: '28px auto 0', maxWidth: 520 }}>Nosso site está temporariamente indisponível. Voltaremos em breve.</p>
        <div style={{ height: 1, background: '#222c3f', maxWidth: 320, margin: '48px auto 18px' }} />
        <p style={{ color: '#5c6880', fontSize: 11, letterSpacing: '0.16em' }}>SISTEMA EXCLUSIVO DESENVOLVIDO POR BAWERK SOLUTIONS</p>
      </section>
    </main>
  )
}
