const findings = [
  { code: "XXE", label: "(XML External Entity)" },
  { code: "EDI", label: "Exposed Debug Informa.." },
  { code: "IDOR", label: "(Insecure Direct Obje.." },
  { code: "SSRF", label: "(Server-Side Request.." },
]

export function DepthScale() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-balance font-mono text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Depth, Trust, and Scale.
        </h2>
        <p className="mt-4 text-balance font-mono text-2xl leading-tight tracking-tight sm:text-3xl md:text-4xl">
          Proof you can act on, across everything you ship.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3">
        {/* Card 1 */}
        <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="relative h-24 w-32">
              <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
              <span className="absolute left-6 top-1/2 h-px w-10 -translate-y-1/2 bg-muted-foreground/40" />
              <span className="absolute left-16 top-2 h-1/2 w-px bg-muted-foreground/40" />
              <span className="absolute bottom-2 left-16 h-1/2 w-px bg-muted-foreground/40" />
              <span className="absolute left-16 top-2 h-px w-12 bg-muted-foreground/40" />
              <span className="absolute bottom-2 left-16 h-px w-12 bg-muted-foreground/40" />
            </div>
          </div>
          <h3 className="text-lg font-medium">The Attacks Others Miss.</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            XBOW chains vulnerabilities into real attack paths that scanners and point-in-time
            pentests never reach.
          </p>
        </article>

        {/* Card 2 */}
        <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="flex-1 py-4">
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <p className="mb-3 font-mono text-sm">Findings</p>
              <ul className="space-y-3">
                {findings.map((f) => (
                  <li key={f.code} className="flex items-center justify-between font-mono text-sm">
                    <span>
                      <span className="text-muted-foreground">○ </span>
                      <span className="text-foreground">{f.code}</span>{" "}
                      <span className="text-muted-foreground">{f.label}</span>
                    </span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-destructive/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-medium">Proof, Not Noise.</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every finding is a real, reproducible exploit with board- and auditor-ready reporting.
            Near-zero false positives and clear evidence your team can act on.
          </p>
        </article>

        {/* Card 3 */}
        <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden py-8">
            <div className="relative h-32 w-full">
              {[0, 1, 2].map((r) => (
                <span
                  key={r}
                  className="absolute left-1/2 top-full -translate-x-1/2 rounded-full border border-muted-foreground/25"
                  style={{ width: `${(r + 1) * 90}px`, height: `${(r + 1) * 90}px`, bottom: 0 }}
                />
              ))}
              <span className="absolute left-[30%] top-[20%] h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="absolute left-[55%] top-[35%] h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="absolute left-[78%] top-[18%] h-1.5 w-1.5 rounded-full bg-destructive" />
              <span className="absolute left-[24%] top-[62%] h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="absolute left-[80%] top-[62%] h-1.5 w-1.5 rounded-full bg-destructive" />
            </div>
          </div>
          <h3 className="mt-4 text-lg font-medium">Coverage Without Headcount.</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Test every application continuously as it changes. XBOW scales with your attack surface,
            not your headcount.
          </p>
        </article>
      </div>
    </section>
  )
}
