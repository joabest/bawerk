import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProofFeatures } from "@/components/proof-features"
import { DepthScale } from "@/components/depth-scale"
import { FindingTrace } from "@/components/finding-trace"
import { Customers } from "@/components/customers"
import { CtaFooter } from "@/components/cta-footer"
import { ParallaxBackground } from "@/components/parallax-background"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParallaxBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ProofFeatures />
        <DepthScale />
        <FindingTrace />
        <Customers />
        <CtaFooter />
      </div>
    </main>
  )
}
