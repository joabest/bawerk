import { Parallax } from "@/components/parallax"

const stats = [
  {
    value: "#1",
    label: "HackerOne",
    desc: "Ranked above every human researcher",
  },
  {
    value: "1st",
    label: "Autonomous System",
    desc: "Ranked on Microsoft's MSRC leaderboard",
  },
  {
    value: "14,000±",
    label: "Zero Days",
    desc: "Found in real customer applications",
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-40 pb-24">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-balance font-mono text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Anyone Can Claim to Be the Best AI Hacker.
        </h1>

        <p className="mt-8 font-mono text-2xl text-primary sm:text-3xl md:text-4xl">
          Only XBOW Can Prove It.
        </p>

        <p className="mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          XBOW is the autonomous hacker proven against the world&apos;s best. That&apos;s why 150+
          security teams trust XBOW to find and prove the flaws attackers would actually exploit.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="#demo"
            className="rounded-md bg-[#f7fafc] px-6 py-3 font-mono text-sm text-[#00080b] transition-transform hover:-translate-y-0.5"
          >
            Get a Demo
          </a>
        </div>
      </div>

      {/* Stats */}
      <Parallax speed={-0.08} className="mx-auto mt-28 grid max-w-6xl gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card px-8 py-10 text-center"
          >
            <div className="font-mono text-6xl text-primary">{stat.value}</div>
            <div className="mt-4 text-lg">{stat.label}</div>
            <div className="mt-2 text-sm text-muted-foreground">{stat.desc}</div>
          </div>
        ))}
      </Parallax>
    </section>
  )
}
