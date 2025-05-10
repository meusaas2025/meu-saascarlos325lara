import { useEffect, useState } from "react"
import GraficoComparativo from "./components/GraficoComparativo"
import GraficoPizza from "./components/GraficoPizza"
import { Toaster } from "./components/Toaster"
import BotaoDarkMode from "./components/BotaoDarkMode"
import BotaoExportarPDF from "./components/BotaoExportarPDF"
import { supabase } from "./lib/supabaseClient"

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (!session) {
        setError("Por favor, faça login para continuar")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar usuário")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
        <p className="text-zinc-900 dark:text-white">Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <main className="max-w-6xl mx-auto p-6 bg-gray-100 dark:bg-zinc-800 min-h-screen">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">DataFlux - Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Seu painel de controle futurista</p>
        </header>

        <section className="mb-8">
          <label className="block mb-2 text-zinc-900 dark:text-white">Filtrar por data:</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </section>

        <div className="space-y-6">
          <GraficoComparativo startDate={startDate} endDate={endDate} />
          <GraficoPizza startDate={startDate} endDate={endDate} />
        </div>
      </main>
      
      <BotaoExportarPDF />
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
  )
}