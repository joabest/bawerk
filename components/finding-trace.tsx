export function FindingTrace() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-balance font-mono text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Every Finding, Traced End to End.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Every XBOW finding is a complete case file: the chained attack path, the working exploit
          that proves it, a full log of every decision and tactic, and developer-ready remediation.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="rounded-md bg-[#f7fafc] px-6 py-3 font-mono text-sm text-[#00080b] transition-transform hover:-translate-y-0.5"
          >
            See a Finding Trace
          </a>
        </div>
      </div>

      {/* Trace card */}
      <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-primary/30 bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
            <span className="font-mono text-sm text-muted-foreground">finding-1252 · trace</span>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 font-mono text-xs text-primary-foreground">
            Validated
          </span>
        </div>

        <div className="space-y-5 p-6 font-mono text-sm">
          <div className="flex flex-wrap gap-x-3">
            <span className="text-muted-foreground">Target</span>
            <span className="text-foreground">customer-app.example.com /api/courses</span>
          </div>

          <div className="text-muted-foreground">Chain</div>

          <TraceStep
            num="01"
            desc="Probe the /api/courses endpoint for injection in the location parameter."
            cmd={`$ curl "…/api/courses?location=Berlin' AND 1=CAST((SELECT version()) AS int)--"`}
          />

          <TraceStep
            num="07"
            desc="Error-based SQLi confirmed. Escalate via pg_read_file() and CAST() to exfiltrate command output in-band."
            cmd={`$ … COPY (SELECT '') TO PROGRAM 'id; cat /etc/passwd' …`}
          />

          <div className="border-t border-border pt-5">
            <span className="text-primary">Result</span>{" "}
            <span className="text-foreground">
              Remote code execution as the database service account. Output returned in-band.
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Working exploit · Full decision log · Reproducible · Developer-ready remediation
          </p>
        </div>
      </div>
    </section>
  )
}

function TraceStep({ num, desc, cmd }: { num: string; desc: string; cmd: string }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{num}</span>
        <span className="text-muted-foreground">{desc}</span>
      </div>
      <div className="rounded-md border border-border bg-background/60 px-4 py-3 text-foreground">
        {cmd}
      </div>
    </div>
  )
}
