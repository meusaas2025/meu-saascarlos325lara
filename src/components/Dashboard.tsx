import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { format } from "date-fns"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"

const cores = ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00", "#FF4500"]

interface DadosVenda {
  data: string
  total: number
}

export default function Dashboard() {
  const [dados, setDados] = useState<DadosVenda[]>([])
  const [carregando, setCarregando] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setCarregando(true)
      const { data, error } = await supabase
        .from('vendas')
        .select('criado_em, valor')
        .order('criado_em', { ascending: false })

      if (error) throw error

      const dadosFormatados = data.map(venda => ({
        data: format(new Date(venda.criado_em), 'dd/MM/yyyy'),
        total: Number(venda.valor)
      }))

      setDados(dadosFormatados)
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados",
        variant: "destructive"
      })
    } finally {
      setCarregando(false)
    }
  }

  const exportarPDF = () => {
    try {
      const doc = new jsPDF()
      doc.text("Relatório de Vendas", 20, 10)
      
      autoTable(doc, {
        head: [["Data", "Total (R$)"]],
        body: dados.map(item => [
          item.data,
          item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        ])
      })
      
      doc.save("relatorio-vendas.pdf")
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado para o seu computador",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="p-6 bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard de Vendas</h1>

      {carregando ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg animate-pulse">Carregando dados...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 text-white shadow-xl rounded-2xl">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Vendas por Data</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dados}
                    dataKey="total"
                    nameKey="data"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {dados.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={cores[index % cores.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => 
                      value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white shadow-xl rounded-2xl">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Exportar Dados</h2>
              <Button 
                className="bg-cyan-500 hover:bg-cyan-700 transition-colors"
                onClick={exportarPDF}
              >
                📄 Baixar PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}