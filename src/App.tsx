import GraficoComparativo from "./components/GraficoComparativo"
import GraficoPizzaCategorias from "./components/GraficoPizzaCategorias"
import ExportarPDF from "./components/ExportarPDF"
import { Toaster } from "./components/Toaster"

export default function App() {
  return (
    <>
      <div id="painel-dashboard">
        <GraficoComparativo />
        <GraficoPizzaCategorias />
      </div>
      <ExportarPDF />
      <Toaster />
    </>
  )
}