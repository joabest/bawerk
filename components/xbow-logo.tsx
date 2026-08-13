export function BawerkLogo({ className }: { className?: string }) {
  return (
    <span
      className={`font-mono text-xl font-semibold tracking-tight ${className ?? ""}`}
      aria-hidden
    >
      <span className="text-primary">BA</span>WERK <span className="text-xs font-normal">SOLUTIONS</span>
    </span>
  )
}
