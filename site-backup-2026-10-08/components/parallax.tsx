"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ParallaxProps {
  children: ReactNode
  /** Velocidade relativa. Negativo sobe, positivo desce. Ex.: -0.15 */
  speed?: number
  className?: string
}

/**
 * Desloca seu conteúdo verticalmente em relação ao scroll da viewport,
 * criando efeito parallax. O deslocamento é calculado a partir da posição
 * do elemento em relação ao centro da tela.
 */
export function Parallax({ children, speed = -0.12, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const viewportCenter = window.innerHeight / 2
        const elementCenter = rect.top + rect.height / 2
        const distance = elementCenter - viewportCenter
        el.style.transform = `translate3d(0, ${distance * speed}px, 0)`
      })
    }
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    update()
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  )
}
