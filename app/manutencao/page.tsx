import type {Metadata} from "next"

export const metadata:Metadata={
 title:"Site temporariamente bloqueado | BAWERK Solutions",
 description:"Acesso público temporariamente indisponível.",
 robots:{index:false,follow:false},
}

export default function MaintenancePage(){
 return <main style={{minHeight:"100dvh",display:"grid",placeItems:"center",padding:"32px 20px",background:"radial-gradient(circle at 50% 30%,#101947 0%,#080c18 48%,#05070c 100%)",color:"#f5f7ff",textAlign:"center",fontFamily:"Arial, sans-serif"}}>
  <section style={{maxWidth:720,display:"grid",justifyItems:"center",gap:22}}>
   <p style={{margin:0,fontSize:12,letterSpacing:".3em",color:"#9caacb",fontWeight:600}}>BAWERK SOLUTIONS</p>
   <div style={{height:1,width:160,background:"linear-gradient(90deg,transparent,#0026c0,transparent)"}}/>
   <h1 style={{fontSize:"clamp(42px,9vw,100px)",lineHeight:1.06,fontWeight:800,letterSpacing:"-.065em",margin:0}}>carneiro <span style={{color:"#5275ff"}}>viado</span><span style={{color:"#fff"}}>.</span></h1>
   <p style={{maxWidth:480,color:"#9ba9be",fontSize:14,lineHeight:1.8,margin:0}}>Este site está temporariamente bloqueado para visitantes.</p>
   <small style={{color:"#62718b",fontSize:10,letterSpacing:".15em"}}>ACESSO TEMPORARIAMENTE INDISPONÍVEL</small>
  </section>
 </main>
}
