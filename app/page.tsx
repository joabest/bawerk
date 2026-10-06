import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TechnicalPanel } from "@/components/technical-panel"
import { ProofFeatures } from "@/components/proof-features"
import { ApiSection } from "@/components/api-section"
import { Customers } from "@/components/customers"
import { CtaFooter } from "@/components/cta-footer"
import { ParallaxBackground } from "@/components/parallax-background"

const WA="https://wa.me/5511992779039"

export default function Page(){return <main className="relative min-h-screen bg-background"><ParallaxBackground/><div className="relative z-10"><Navbar/><Hero/><TechnicalPanel/><ProofFeatures/><ApiSection/><Customers/><CtaFooter/></div><a href={WA} target="_blank" rel="noreferrer" aria-label="Falar com a Bawerk pelo WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#07151c]/95 px-4 font-sans text-sm font-semibold text-white shadow-[0_10px_35px_rgba(0,0,0,.45),0_0_24px_rgba(37,211,102,.16)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#25D366]/80"><span className="whatsapp-icon-blink h-2.5 w-2.5 shrink-0 rounded-full bg-[#25D366] shadow-[0_0_12px_rgba(37,211,102,.95)]" aria-hidden/><span>WhatsApp</span></a></main>}
