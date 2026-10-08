import { ParallaxBackground } from "@/components/parallax-background"

const WA = "https://wa.me/5511992779039"

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-6 py-12 text-white">
      <ParallaxBackground />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_15%,rgba(65,105,225,.20),transparent_38%),linear-gradient(180deg,rgba(3,10,28,.16),rgba(2,7,20,.72))]" />

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#4169E1]/35 bg-[#081331]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A8BAFF] shadow-[0_0_35px_rgba(65,105,225,.12)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#4169E1] shadow-[0_0_14px_rgba(65,105,225,.95)]" aria-hidden />
          Bawerk Solutions
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Site em manutenção
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base leading-7 text-white/65 sm:text-lg">
          Estamos realizando alguns ajustes. Em breve retornamos.
        </p>

        <a
          href={WA}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a Bawerk pelo WhatsApp"
          className="mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#07151c]/95 px-5 font-sans text-sm font-semibold text-white shadow-[0_10px_35px_rgba(0,0,0,.45),0_0_24px_rgba(37,211,102,.16)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#25D366]/80"
        >
          <span
            className="whatsapp-icon-blink h-2.5 w-2.5 shrink-0 rounded-full bg-[#25D366] shadow-[0_0_12px_rgba(37,211,102,.95)]"
            aria-hidden
          />
          WhatsApp
        </a>
      </section>
    </main>
  )
}
