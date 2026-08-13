"use client"
import { Lightbulb, PanelsTopLeft, Rocket } from "lucide-react"
import { useI18n } from "@/lib/i18n"
const icons=[Lightbulb,PanelsTopLeft,Rocket]
export function DepthScale(){const {t}=useI18n();return <section className="px-4 py-24"><div className="mx-auto max-w-4xl text-center"><h2 className="font-mono text-3xl sm:text-4xl md:text-5xl">{t.process.title}</h2><p className="mt-4 font-mono text-2xl">{t.process.subtitle}</p></div><div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3">{t.process.cards.map((card,i)=>{const Icon=icons[i];return <article key={card.title} className="rounded-2xl border border-border bg-card p-6"><div className="flex h-36 items-center justify-center"><Icon className="h-14 w-14 text-primary drop-shadow-[0_0_18px_#4169E1]" strokeWidth={1}/></div><h3 className="text-lg font-medium">{card.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p></article>})}</div></section>}
