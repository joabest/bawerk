"use client"
import { useEffect } from "react"

export function ScrollEffects(){
  useEffect(()=>{
    const targets=[...document.querySelectorAll<HTMLElement>("main section > div, main section article, main section h2, main section h3")]
    targets.forEach((el,index)=>{el.classList.add("scroll-reveal");el.style.setProperty("--reveal-delay",`${Math.min(index%4,3)*70}ms`)})
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -8% 0px"})
    targets.forEach(el=>observer.observe(el))
    const cards=[...document.querySelectorAll<HTMLElement>(".glass-panel, .dotted-frame article, main article")]
    const move=(event:PointerEvent)=>{const card=(event.currentTarget as HTMLElement);const rect=card.getBoundingClientRect();card.style.setProperty("--mouse-x",`${event.clientX-rect.left}px`);card.style.setProperty("--mouse-y",`${event.clientY-rect.top}px`)}
    cards.forEach(card=>{card.classList.add("interactive-glow");card.addEventListener("pointermove",move)})
    const onScroll=()=>document.documentElement.style.setProperty("--page-scroll",String(window.scrollY))
    window.addEventListener("scroll",onScroll,{passive:true});onScroll()
    return()=>{observer.disconnect();cards.forEach(card=>card.removeEventListener("pointermove",move));window.removeEventListener("scroll",onScroll)}
  },[])
  return null
}
