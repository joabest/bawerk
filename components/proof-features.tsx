import { ShieldHalf, Sparkles, Terminal } from "lucide-react"

const features = [
  {
    icon: ShieldHalf,
    title: "Creative Discovery.\nReal Proof.",
    body: "Point XBOW at a URL and it does the rest. The more context you give it, the deeper it goes. XBOW explores your applications and APIs like a real attacker, chaining vulnerabilities into working attacks and independently proving exploitability before a finding ever reaches your team.",
    cta: "See How XBOW Works",
  },
  {
    icon: Sparkles,
    title: "Full Autonomy,\nGoverned for Production.",
    body: "You define the scope, every action is logged and auditable, and deployment aligns with your data separation, residency, and compliance requirements (SOC 2, ISO 27001, PCI DSS, NIS 2). Full autonomy, with the governance enterprise security requires.",
    cta: "See How XBOW Guardrails",
  },
  {
    icon: Terminal,
    title: "Proven in the Open,\nAgainst the World's Best.",
    body: "XBOW proved itself in public, against the best human researchers on earth, including a 9.8 critical Microsoft flaw it found completely on its own. No other AI has done this. Today 150+ security teams point that same engine at their own applications to prove what's exploitable before attackers do.",
    cta: "Read the Writeup",
  },
]

export function ProofFeatures() {
  return (
    <section id="platform" className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-balance font-mono text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Security Teams Don&apos;t Need More Findings. They Need Proof.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          AI surfaces vulnerabilities by the thousands, but finding a flaw isn&apos;t the same as
          proving it&apos;s exploitable. XBOW proves exploitability across your attack surface
          continuously, so you know what to fix first. Risk is measured every day, not estimated
          once a year.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-6xl space-y-16 rounded-3xl border border-dashed border-border p-6 md:p-12 dotted-frame">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
          >
            <div>
              <div className="inline-flex rounded-lg border border-border bg-card p-2.5">
                <feature.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 whitespace-pre-line font-mono text-2xl leading-snug tracking-tight md:text-3xl">
                {feature.title}
              </h3>
              <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
              <a
                href="#"
                className="mt-6 inline-block font-medium text-primary transition-opacity hover:opacity-70"
              >
                {feature.cta} &rarr;
              </a>
            </div>

            <FeatureVisual index={features.indexOf(feature)} />
          </div>
        ))}
      </div>
    </section>
  )
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
        </div>
        <p className="font-mono text-sm leading-relaxed text-muted-foreground">
          <span className="text-primary">$</span> xbow scan start target: production-app mode:
          autonomous
        </p>
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          <span className="text-sm text-foreground">Security incident</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          </div>
          <p className="font-mono text-sm leading-relaxed text-muted-foreground">
            Excerpt from the server-rendered edit form returned by{" "}
            <span className="text-foreground">`GET /addresses/1/edit`</span>:
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-4">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Thinking...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center rounded-xl border border-border bg-card py-12">
      <div className="flex flex-col items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_4px] shadow-primary/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        <span className="h-2 w-2 rounded-full bg-primary/50" />
        <span className="font-mono text-xs text-muted-foreground">Security Team</span>
      </div>
    </div>
  )
}
