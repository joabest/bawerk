import type { Metadata } from "next"
import Experience3D from "./experience"
import "./teste3d.css"

export const metadata: Metadata = {
  title: "Experiência 3D | Bawerk Solutions",
  description: "Explore as soluções digitais, APIs e automações da Bawerk Solutions em uma experiência interativa 3D.",
}

export default function Teste3DPage() {
  return <Experience3D />
}
