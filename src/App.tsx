import GraficoComparativo from "./components/GraficoComparativo"
import GraficoPizzaCategorias from "./components/GraficoPizzaCategorias"
import ExportarPDF from "./components/ExportarPDF"
import { Toaster } from "./components/Toaster"
import BotaoDarkMode from "./components/BotaoDarkMode"

export default function App() {
  return (
    <>
      <div id="painel-dashboard" className="p-4 bg-gray-100 dark:bg-zinc-800 min-h-screen">
        <GraficoComparativo />
        <GraficoPizzaCategorias />
      </div>
      <ExportarPDF />
      <BotaoDarkMode />
      <Toaster />
      <style>{`
        :root {
          --tooltip-bg: #ffffff;
          --tooltip-text: #000000;
          --chart-grid: #e5e7eb;
          --chart-bar: #4ade80;
          --chart-colors: #00FFCC, #FF6384, #FFCE56, #36A2EB, #4BC0C0;
        }
        .dark {
          --tooltip-bg: #18181b;
          --tooltip-text: #ffffff;
          --chart-grid: #374151;
          --chart-bar: #22c55e;
        }
      `}</style>
    </>
  );
}