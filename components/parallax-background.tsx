"use client"

import { useEffect, useRef } from "react"

/**
 * Camada de fundo fixa (fixed inset-0) sobre a qual o conteúdo rola,
 * criando a sensação de profundidade/parallax do xbow.com.
 * Contém uma grade sutil e um brilho verde-limão que reage levemente ao scroll.
 */
export function ParallaxBackground() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        if (glowRef.current) {
          // brilho se desloca mais devagar que o conteúdo (parallax)
          glowRef.current.style.transform = `translate3d(0, ${y * 0.15}px, 0)`
        }
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* grade fixa */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      {/* brilho parallax */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-[-10%] h-[70vh] w-[80vw] -translate-x-1/2 rounded-full opacity-40 blur-[120px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--color-primary) 35%, transparent), transparent 60%)",
        }}
      />
    </div>
  )
}
