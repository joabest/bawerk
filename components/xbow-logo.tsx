export function XbowLogo({ className }: { className?: string }) {
  return (
    <span
      className={`font-mono text-xl font-semibold tracking-tight ${className ?? ""}`}
      aria-hidden
    >
      <span className="inline-block -skew-x-12">X</span>BOW
    </span>
  )
}
