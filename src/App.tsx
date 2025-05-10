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

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (!session) {
        // Redirect to login or show login form
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
      <div id="painel-dashboard" className="p-4 bg-gray-100 dark:bg-zinc-800 min-h-screen">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <GraficoComparativo />
          <GraficoPizza />
        </div>
      </div>
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