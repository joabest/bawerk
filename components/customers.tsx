const logos = ["LG Electronics", "PingIdentity", "SAMSUNG SDS", "Playtika", "NEXON", "SEZNAM.CZ"]

const quotes = [
  {
    quote:
      "Before XBOW, we had a huge volume of findings which made it hard to prioritize. Now we get proof of what's actually exploitable.",
    name: "Farzan Karimi",
    role: "Deputy CISO, Moderna",
  },
  {
    quote:
      "Every XBOW agent is a new team member. It works around the clock and never misses a change to our attack surface.",
    name: "Security Engineer",
    role: "Fortune 500",
  },
  {
    quote:
      "For a lean team like ours, XBOW's simplicity and flexibility were game changers. We finally have continuous coverage.",
    name: "Head of Security",
    role: "Series B Startup",
  },
]

export function Customers() {
  return (
    <section id="company" className="px-4 py-24">
      {/* Logo strip */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {logos.map((logo) => (
          <div
            key={logo}
            className="flex items-center justify-center rounded-xl border border-border bg-card px-4 py-6 font-mono text-sm text-muted-foreground"
          >
            {logo}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl justify-end">
        <a
          href="#"
          className="rounded-md bg-[#f7fafc] px-5 py-2.5 font-mono text-sm text-[#00080b] transition-transform hover:-translate-y-0.5"
        >
          See Customer Stories
        </a>
      </div>

      {/* Quotes */}
      <div className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <figure
            key={q.name}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 h-14 w-14 rounded-full bg-secondary" aria-hidden />
            <blockquote className="flex-1 text-pretty leading-relaxed">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6">
              <div className="font-medium">{q.name}</div>
              <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {q.role}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
