"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Cookie, ShieldCheck, Settings2, X } from "lucide-react"

const CONSENT_KEY = "bawerk_analytics_consent_v1"
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-91BEZ30Z23"
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "ijk58bv50m"
const gaValid = /^G-[A-Z0-9]{5,20}$/.test(GA_ID)
const clarityValid = /^[a-z0-9]{5,32}$/i.test(CLARITY_ID)
type Consent = "accepted" | "rejected" | null

declare global {
 interface Window {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  clarity?: (...args: unknown[]) => void
  __bawerkAnalyticsStarted?: boolean
 }
}
function currentPage() { return window.location.origin + window.location.pathname }
function deleteKnownCookies() {
 const names = document.cookie.split(";").map(value => value.split("=")[0]?.trim()).filter(Boolean)
 for (const name of names) {
  if (name.startsWith("_ga") || name === "_gid" || name === "_gat" || name === "_clck" || name === "_clsk") {
   document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax"
   document.cookie = name + "=; Max-Age=0; path=/; domain=." + location.hostname.replace(/^www\./,"") + "; SameSite=Lax"
  }
 }
}
function startAnalytics() {
 if (window.__bawerkAnalyticsStarted) return
 window.__bawerkAnalyticsStarted = true
 if (gaValid) {
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args) }
  window.gtag("consent", "default", {
   analytics_storage: "denied", ad_storage: "denied",
   ad_user_data: "denied", ad_personalization: "denied"
  })
  window.gtag("consent", "update", { analytics_storage: "granted" })
  window.gtag("js", new Date())
  window.gtag("config", GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false })
  const script = document.createElement("script")
  script.async = true
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID)
  script.dataset.bawerkAnalytics = "ga4"
  document.head.appendChild(script)
 }
 if (clarityValid) {
  window.clarity = window.clarity || function (...args: unknown[]) {
   const fn = window.clarity as ((...a: unknown[])=>void) & { q?: unknown[][] }
   ;(fn.q = fn.q || []).push(args)
  }
  const script = document.createElement("script")
  script.async = true
  script.src = "https://www.clarity.ms/tag/" + encodeURIComponent(CLARITY_ID)
  script.dataset.bawerkAnalytics = "clarity"
  document.head.appendChild(script)
  // ConsentV2: no advertising consent is requested.
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" })
 }
}
function trackPageView() {
 if (!gaValid || !window.gtag) return
 window.gtag("event", "page_view", { page_location: currentPage(), page_path: location.pathname, page_title: document.title })
}

export function PublicAnalytics() {
 const pathname = usePathname()
 const [consent,setConsent] = useState<Consent>(null)
 const [ready,setReady] = useState(false)
 const [settingsOpen,setSettingsOpen] = useState(false)
 const previousPath = useRef<string | null>(null)
 const isPrivate = pathname.startsWith("/admin")
 const enabled = gaValid || clarityValid

 useEffect(() => {
  if (!enabled || isPrivate) return
  try {
   const stored = window.localStorage.getItem(CONSENT_KEY)
   setConsent(stored==="accepted" || stored==="rejected" ? stored : null)
  } catch { setConsent(null) }
  setReady(true)
 },[enabled,isPrivate])

 useEffect(() => {
  if (!enabled || isPrivate || !ready || consent!=="accepted") return
  startAnalytics()
  const path = pathname || "/"
  if (previousPath.current !== path) {
   previousPath.current = path
   trackPageView()
  }
 },[enabled,isPrivate,ready,consent,pathname])


 // First-party engagement: record page views and visible reading time only after consent.
 useEffect(() => {
  if (!enabled || isPrivate || !ready || consent!=="accepted") return
  const path = pathname || "/"
  const id = crypto.randomUUID()
  let sid = ""
  try {
   sid = sessionStorage.getItem("bawerk_engagement_session") || ""
   if (!/^[a-f0-9-]{36}$/i.test(sid)) {
    sid = crypto.randomUUID()
    sessionStorage.setItem("bawerk_engagement_session", sid)
   }
  } catch { sid = crypto.randomUUID() }
  const params = new URLSearchParams(location.search)
  let source = (params.get("utm_source")||"").slice(0,100)
  if (!source && document.referrer) {
   try { source = new URL(document.referrer).hostname.replace(/^www\\./,"") } catch {}
  }
  if (!source) source = "Direto"
  const device = window.innerWidth < 640 ? "Mobile" : window.innerWidth < 1024 ? "Tablet" : "Desktop"
  let activeStart = document.visibilityState==="visible" ? performance.now() : 0
  let activeMs = 0
  let lastSentSeconds = -1
  const send = (force=false) => {
   if (activeStart) {
    const now = performance.now()
    activeMs += Math.max(0,now-activeStart)
    activeStart = now
   }
   const seconds = Math.min(18000, Math.floor(activeMs/1000))
   if (!force && seconds===lastSentSeconds) return
   lastSentSeconds = seconds
   const payload = JSON.stringify({id,sessionId:sid,path,source,device,seconds})
   if (!navigator.sendBeacon?.("/api/engagement",new Blob([payload],{type:"application/json"}))) {
    void fetch("/api/engagement",{method:"POST",headers:{"Content-Type":"application/json"},body:payload,keepalive:true}).catch(()=>{})
   }
  }
  send(true)
  const onVisibility=()=>{
   if (document.visibilityState==="hidden") {send(true);activeStart=0}
   else if (!activeStart) activeStart=performance.now()
  }
  const onPageHide=()=>send(true)
  const interval=window.setInterval(()=>send(),15000)
  document.addEventListener("visibilitychange",onVisibility)
  window.addEventListener("pagehide",onPageHide)
  return ()=>{
   window.clearInterval(interval)
   document.removeEventListener("visibilitychange",onVisibility)
   window.removeEventListener("pagehide",onPageHide)
   send(true)
  }
 },[enabled,isPrivate,ready,consent,pathname])

 const choose = useCallback((value: "accepted" | "rejected")=>{
  try { localStorage.setItem(CONSENT_KEY,value) } catch {}
  setConsent(value)
  setSettingsOpen(false)
  if (value==="rejected" && window.__bawerkAnalyticsStarted) {
   window.gtag?.("consent", "update", { analytics_storage: "denied" })
   window.clarity?.("consentv2",{ ad_Storage:"denied", analytics_Storage:"denied" })
   deleteKnownCookies()
   // Remove active analytics sessions and their event handlers immediately.
   window.location.reload()
  }
 },[])

 if (!enabled || isPrivate || !ready) return null
 if (consent!==null && !settingsOpen) return <button type="button" aria-label="Gerenciar cookies analíticos" title="Preferências de privacidade" onClick={()=>setSettingsOpen(true)} className="bawerk-consent-settings"><Cookie size={17}/></button>

 return <div className="bawerk-consent-overlay" role="region" aria-label="Preferências de privacidade">
  <section className="bawerk-consent-box">
   <div className="bawerk-consent-heading"><span className="bawerk-consent-icon"><ShieldCheck size={23}/></span><div><strong>Privacidade e experiência</strong><small>BAWERK SOLUTIONS · PREFERÊNCIAS</small></div>{settingsOpen && <button type="button" aria-label="Fechar preferências" onClick={()=>setSettingsOpen(false)}><X size={18}/></button>}</div>
   <p>Podemos usar cookies analíticos do Google Analytics e do Microsoft Clarity para entender visitas e melhorar a navegação. Você pode aceitar, recusar ou mudar sua escolha quando quiser. Os recursos essenciais do site continuam funcionando se você recusar.</p>
   <div className="bawerk-consent-actions">
    <button type="button" className="bawerk-consent-no" onClick={()=>choose("rejected")}>Recusar opcionais</button>
    <button type="button" className="bawerk-consent-yes" onClick={()=>choose("accepted")}>Aceitar analíticos</button>
   </div>
   <span className="bawerk-consent-foot"><Settings2 size={14}/> Nenhuma ferramenta adicional de anúncios será ativada por esta escolha.</span>
  </section>
 </div>
}
