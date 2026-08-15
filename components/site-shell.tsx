import { Navbar } from "./navbar"
import { CtaFooter } from "./cta-footer"
import { ParallaxBackground } from "./parallax-background"
export function SiteShell({children}:{children:React.ReactNode}){return <main className="relative min-h-screen bg-background"><ParallaxBackground/><div className="relative z-10"><Navbar/>{children}<CtaFooter/></div></main>}
