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
        }
        .dark {
          --tooltip-bg: #18181b;
          --tooltip-text: #ffffff;
        }
      `}</style>
    </>
  );
}