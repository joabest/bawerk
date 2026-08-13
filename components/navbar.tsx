"use client"

import { ChevronDown } from "lucide-react"
import { XbowLogo } from "./xbow-logo"

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources", hasDropdown: true },
  { label: "Blog", href: "#blog" },
  { label: "Company", href: "#company", hasDropdown: true },
]

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-xl border border-border bg-[#f7fafc] px-5 py-3 text-[#00080b] shadow-lg">
        <a href="#" aria-label="XBOW home" className="flex items-center">
          <XbowLogo className="h-5 w-auto text-[#00080b]" />
        </a>

        <ul className="hidden items-center gap-7 font-mono text-sm md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center gap-1 text-[#00080b] transition-opacity hover:opacity-60"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#demo"
          className="rounded-md bg-[#00080b] px-4 py-2 font-mono text-sm text-[#f0f6fa] transition-transform hover:-translate-y-0.5"
        >
          Get a Demo
        </a>
      </nav>
    </header>
  )
}
