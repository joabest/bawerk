"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { ArrowDown, ArrowUpRight, Code2, Network, Workflow, Zap } from "lucide-react"

const WHATSAPP = "https://wa.me/5511992779039?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20um%20projeto%20com%20a%20Bawerk."
const SECTION_IDS = ["inicio", "conectividade", "automacoes", "contato"] as const

/** Progress shared with WebGL without setState on every scroll frame. */
type Motion = {
  progress: number
  mouseX: number
  mouseY: number
  reduced: boolean
}

const stages = [
  { rotation: 0, spread: 0.7, scale: 1, x: 0.7, y: 0, camera: 7.9 },
  { rotation: 2.1, spread: 1.55, scale: 1.07, x: 1.05, y: -0.1, camera: 8.2 },
  { rotation: 4.5, spread: 2.05, scale: 0.83, x: -0.85, y: 0.12, camera: 10.3 },
  { rotation: 6.28, spread: 0.9, scale: 1.08, x: 0, y: 0, camera: 8.5 },
] as const

function TechCore({ motion }: { motion: React.RefObject<Motion> }) {
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const { points, links } = useRef((() => {
    const points: THREE.Vector3[] = []
    const count = 48
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const ring = Math.sqrt(Math.max(0, 1 - y * y))
      const a = i * Math.PI * (3 - Math.sqrt(5))
      points.push(new THREE.Vector3(Math.cos(a) * ring * 2.1, y * 2.1, Math.sin(a) * ring * 2.1))
    }
    const coords: number[] = []
    points.forEach((p, i) => {
      for (const offset of [5, 13]) {
        const next = points[(i + offset) % count]
        coords.push(p.x, p.y, p.z, next.x, next.y, next.z)
      }
    })
    const links = new THREE.BufferGeometry()
    links.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3))
    return { points, links }
  })()).current

  useEffect(() => () => links.dispose(), [links])

  useFrame(({ clock }, delta) => {
    if (!group.current || !inner.current) return
    const m = motion.current
    const stagePosition = Math.min(2.9999, Math.max(0, m.progress * 3))
    const index = Math.floor(stagePosition)
    const t = stagePosition - index
    const a = stages[index], b = stages[index + 1]
    const mix = (key: keyof typeof a) => THREE.MathUtils.lerp(a[key], b[key], t)
    const damp = 1 - Math.exp(-Math.min(delta, 0.08) * 4.2)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mix("rotation") + (m.reduced ? 0 : clock.elapsedTime * 0.035), damp)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, m.reduced ? 0 : m.mouseY * 0.1 + 0.16, damp)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, mix("x") + (m.reduced ? 0 : m.mouseX * 0.18), damp)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, mix("y"), damp)
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, mix("scale"), damp))
    inner.current.scale.setScalar(THREE.MathUtils.lerp(inner.current.scale.x, mix("spread"), damp))
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, mix("camera"), damp)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, m.reduced ? 0 : m.mouseX * 0.24, damp)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, m.reduced ? 0 : -m.mouseY * 0.14, damp)
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshPhysicalMaterial color="#1745aa" metalness={0.85} roughness={0.24} clearcoat={0.85} flatShading />
      </mesh>
      <mesh scale={1.13}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#83bbff" wireframe transparent opacity={0.22} />
      </mesh>
      <group ref={inner}>
        <lineSegments geometry={links}>
          <lineBasicMaterial color="#407fff" transparent opacity={0.32} />
        </lineSegments>
        {points.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 7, 7]} />
            <meshBasicMaterial color={i % 5 === 0 ? "#ffffff" : "#65b6ff"} />
          </mesh>
        ))}
      </group>
      <mesh rotation={[0.55, 0.32, 0]}>
        <torusGeometry args={[2.28, 0.012, 5, 96]} />
        <meshBasicMaterial color="#76a9ff" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function WebGLScene({ motion, isMobile }: { motion: React.RefObject<Motion>; isMobile: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.9], fov: isMobile ? 53 : 42 }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
      fallback={<div className="bw3d-static-orb" />}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={3.1} color="#9dc1ff" />
      <pointLight position={[-4, -2, 2]} intensity={38} color="#275cff" />
      <TechCore motion={motion} />
    </Canvas>
  )
}

function SceneSurface({ motion, isMobile }: { motion: React.RefObject<Motion>; isMobile: boolean }) {
  return <div className="bw3d-canvas" aria-hidden="true"><WebGLScene motion={motion} isMobile={isMobile} /></div>
}

const Scene = dynamic(() => Promise.resolve(SceneSurface), { ssr: false })

function GlassCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const card = useRef<HTMLDivElement>(null)
  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!card.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const r = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - r.left) / r.width - 0.5
    const y = (event.clientY - r.top) / r.height - 0.5
    card.current.style.transform = `perspective(850px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`
  }
  return (
    <div className="bw3d-card-wrap" onMouseMove={onMove} onMouseLeave={() => { if (card.current) card.current.style.transform = "" }}>
      <div className="bw3d-card" ref={card}>
        <span className="bw3d-card-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  )
}

export default function Experience3D() {
  const root = useRef<HTMLElement>(null)
  const motion = useRef<Motion>({ progress: 0, mouseX: 0, mouseY: 0, reduced: false })
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0)
  const [webgl, setWebgl] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mobile = window.matchMedia("(max-width: 767px)")
    const refreshMobile = () => setIsMobile(mobile.matches)
    const onMotion = () => { motion.current.reduced = reduced.matches }
    refreshMobile()
    onMotion()
    mobile.addEventListener("change", refreshMobile)
    reduced.addEventListener("change", onMotion)

    try {
      const canvas = document.createElement("canvas")
      setWebgl(!!(canvas.getContext("webgl2") || canvas.getContext("webgl")))
    } catch {
      setWebgl(false)
    }

    let frame = 0
    const calculate = () => {
      frame = 0
      const el = root.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight)
      const raw = THREE.MathUtils.clamp(-rect.top / scrollable, 0, 1)
      motion.current.progress = raw
      setActive(Math.min(3, Math.floor(raw * 4 + 0.02)))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(calculate) }
    const onPointer = (e: PointerEvent) => {
      motion.current.mouseX = e.clientX / window.innerWidth * 2 - 1
      motion.current.mouseY = e.clientY / window.innerHeight * 2 - 1
    }
    calculate()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("pointermove", onPointer, { passive: true })

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("bw3d-visible")
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.14 })
    root.current?.querySelectorAll(".bw3d-reveal").forEach(el => observer.observe(el))
    return () => {
      cancelAnimationFrame(frame)
      mobile.removeEventListener("change", refreshMobile)
      reduced.removeEventListener("change", onMotion)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("pointermove", onPointer)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="bw3d" ref={root}>
      <div className="bw3d-atmosphere" aria-hidden="true" />
      {webgl && !motion.current.reduced ? <Scene motion={motion} isMobile={isMobile} /> : <div className="bw3d-static-orb" aria-hidden="true" />}
      <header className="bw3d-nav">
        <Link href="/" className="bw3d-wordmark" aria-label="Bawerk Solutions — página inicial">BAWERK<span>.</span><small>SOLUTIONS</small></Link>
        <div className="bw3d-nav-right"><span className="bw3d-experiment">LAB / EXPERIENCE 001</span><Link className="bw3d-nav-cta" href="/contato">INICIAR PROJETO <ArrowUpRight size={14} /></Link></div>
      </header>
      <aside className="bw3d-progress" aria-label="Seções da experiência">
        {SECTION_IDS.map((id, i) => (
          <a href={`#${id}`} key={id} className={active === i ? "is-active" : ""} aria-label={`Ir para seção ${i + 1}`}><span>0{i + 1}</span><i /></a>
        ))}
      </aside>

      <section id="inicio" className="bw3d-section bw3d-hero">
        <div className="bw3d-section-inner bw3d-reveal">
          <span className="bw3d-kicker"><span className="bw3d-dot" /> SOFTWARE / AUTOMAÇÃO / EXPERIÊNCIAS DIGITAIS</span>
          <h1>VOCÊ PODE IR<br /><em>ALÉM DO QUE</em><br />IMAGINA<span className="bw3d-period">.</span></h1>
          <p>Criamos sistemas que fazem negócios avançarem. Engenharia de software sob medida, integrações inteligentes e tecnologia sem limites.</p>
          <a href="#conectividade" className="bw3d-explore">EXPLORE O QUE FAZEMOS <ArrowDown size={17} /></a>
        </div>
        <div className="bw3d-bottom-note">01 / 04 <span>SCROLL TO EXPLORE</span></div>
      </section>

      <section id="conectividade" className="bw3d-section">
        <div className="bw3d-section-inner bw3d-reveal">
          <span className="bw3d-kicker">01 — APIs & CONECTIVIDADE</span>
          <h2>TUDO<br />CONECTADO<span className="bw3d-period">.</span></h2>
          <p>Conectamos ferramentas, dados e processos para que sua operação funcione como um único ecossistema inteligente.</p>
          <GlassCard icon={<Network size={22} />} title="APIs & integrações">Arquitetura robusta, fluxos seguros e sistemas que conversam sem atrito.</GlassCard>
        </div>
        <div className="bw3d-bottom-note">02 / 04 <span>DESIGNED TO CONNECT</span></div>
      </section>

      <section id="automacoes" className="bw3d-section bw3d-right">
        <div className="bw3d-section-inner bw3d-reveal">
          <span className="bw3d-kicker">02 — AUTOMAÇÕES & ESCALA</span>
          <h2>MENOS<br />LIMITES<span className="bw3d-period">.</span><br /><em>MAIS FUTURO.</em></h2>
          <p>Eliminamos tarefas repetitivas, aceleramos operações e desenvolvemos soluções preparadas para crescer com você.</p>
          <div className="bw3d-card-pair">
            <GlassCard icon={<Workflow size={21} />} title="Automação">Fluxos inteligentes do início ao fim.</GlassCard>
            <GlassCard icon={<Code2 size={21} />} title="Software sob medida">Produtos desenhados para seu negócio.</GlassCard>
          </div>
        </div>
        <div className="bw3d-bottom-note">03 / 04 <span>BUILT TO SCALE</span></div>
      </section>

      <section id="contato" className="bw3d-section bw3d-last">
        <div className="bw3d-section-inner bw3d-reveal">
          <span className="bw3d-kicker"><Zap size={15} /> 03 — VAMOS CRIAR O PRÓXIMO NÍVEL</span>
          <h2>O PRÓXIMO<br /><em>PASSO</em> É SEU<span className="bw3d-period">.</span></h2>
          <p>Seu desafio é o ponto de partida. Vamos construir a solução que sua empresa ainda não encontrou.</p>
          <div className="bw3d-actions">
            <Link className="bw3d-primary" href="/contato">COMEÇAR UM PROJETO <ArrowUpRight size={19}/></Link>
            <a className="bw3d-secondary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">FALAR NO WHATSAPP <ArrowUpRight size={17}/></a>
          </div>
        </div>
        <footer className="bw3d-footer"><Link href="/">© {new Date().getFullYear()} BAWERK SOLUTIONS</Link><span>ENGENHARIA DIGITAL ALÉM DO ÓBVIO</span><Link href="/">VOLTAR AO SITE <ArrowUpRight size={14}/></Link></footer>
      </section>
    </main>
  )
}
