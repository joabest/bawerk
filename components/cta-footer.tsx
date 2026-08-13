import { XbowLogo } from "./xbow-logo"
import { Parallax } from "./parallax"

const footerCols = [
  {
    title: "Product",
    links: [
      "Platform",
      "Pricing",
      "API",
      "Resources",
      "About",
      "Partner Deal Registration",
      "Documentation",
      "Careers",
    ],
  },
  {
    title: "Legal",
    links: [
      "Terms Of Use",
      "Terms And Conditions",
      "Privacy Policy",
      "Trust Center",
      "Cookies Policy",
    ],
  },
  {
    title: "Social",
    links: ["Bluesky", "X", "Linkedin", "Mastodon"],
  },
]

export function CtaFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Glow CTA */}
      <div className="relative bg-gradient-to-b from-background via-primary/15 to-primary/40 px-4 pb-40 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-mono text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Can XBOW Hack Your App?
          </h2>
          <div className="mt-8 flex justify-center">
            <a
              href="#demo"
              className="rounded-md bg-[#00080b] px-6 py-3 font-mono text-sm text-[#f0f6fa] transition-transform hover:-translate-y-0.5"
            >
              Get a Demo
            </a>
          </div>
        </div>
      </div>

      {/* Footer nav on light gradient */}
      <div className="relative bg-gradient-to-b from-primary/40 via-primary/20 to-[#f7fafc]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 border-b border-[#00080b]/10 pb-12 text-[#00080b] md:grid-cols-4">
            <XbowLogo className="text-[#00080b]" />
            {footerCols.map((col) => (
              <div key={col.title}>
                <ul className="space-y-3 font-mono text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#00080b] transition-opacity hover:opacity-60">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Giant watermark */}
          <Parallax speed={0.06} className="pointer-events-none select-none pt-10 text-center">
            <span className="font-mono text-[18vw] font-semibold leading-none tracking-tighter text-[#00080b]/10">
              <span className="inline-block -skew-x-12">X</span>BOW
            </span>
          </Parallax>
        </div>
      </div>
    </footer>
  )
}
