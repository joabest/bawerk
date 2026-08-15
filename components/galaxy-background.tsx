"use client"

import { useEffect, useRef } from "react"

type Star = { x: number; y: number; z: number; size: number; alpha: number; blue: number }

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    const stars: Star[] = []
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let targetX = 0
    let targetY = 0
    let lastScroll = scrollY
    let scrollBoost = 0

    const resetStar = (star: Star, randomDepth = true) => {
      star.x = (Math.random() - 0.5) * width * 1.9
      star.y = (Math.random() - 0.5) * height * 1.9
      star.z = randomDepth ? Math.random() * width + 40 : width
      star.size = 0.45 + Math.random() * 1.25
      star.alpha = 0.28 + Math.random() * 0.7
      star.blue = Math.random()
    }

    const resize = () => {
      width = innerWidth
      height = innerHeight
      dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(520, Math.max(180, Math.round((width * height) / 4200)))
      while (stars.length < count) {
        const star = {} as Star
        resetStar(star)
        stars.push(star)
      }
      stars.length = count
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / width - 0.5) * 34
      targetY = (event.clientY / height - 0.5) * 24
    }

    const onScroll = () => {
      scrollBoost = Math.min(7, scrollBoost + Math.abs(scrollY - lastScroll) * 0.028)
      lastScroll = scrollY
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      pointerX += (targetX - pointerX) * 0.035
      pointerY += (targetY - pointerY) * 0.035
      scrollBoost *= 0.93
      const speed = reducedMotion ? 0 : 0.22 + scrollBoost
      const focal = Math.max(width, height) * 0.78
      const centerX = width / 2 + pointerX
      const centerY = height / 2 + pointerY

      for (const star of stars) {
        star.z -= speed
        if (star.z < 8) resetStar(star, false)
        const scale = focal / star.z
        const x = centerX + star.x * scale
        const y = centerY + star.y * scale
        if (x < -30 || x > width + 30 || y < -30 || y > height + 30) {
          resetStar(star, false)
          continue
        }
        const depth = 1 - star.z / width
        const radius = Math.max(0.35, star.size * scale * 0.72)
        const opacity = Math.min(0.88, star.alpha * (0.32 + depth * 0.8))
        ctx.beginPath()
        ctx.fillStyle = star.blue > 0.82
          ? `rgba(108,142,255,${opacity})`
          : `rgba(220,230,255,${opacity})`
        ctx.shadowColor = "rgba(65,105,225,.8)"
        ctx.shadowBlur = radius > 1.15 ? 7 : 0
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    addEventListener("resize", resize)
    addEventListener("pointermove", onPointerMove, { passive: true })
    addEventListener("scroll", onScroll, { passive: true })
    draw()
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("resize", resize)
      removeEventListener("pointermove", onPointerMove)
      removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden="true" />
}
