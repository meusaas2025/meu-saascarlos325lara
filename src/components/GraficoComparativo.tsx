import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useEffect, useState } from "react";
import { buscarDadosSemanais, type DadosVenda } from "@/services/graficoService";

const META_SEMANAL = 1000; // R$1.000 por semana

export default function GraficoComparativo() {
  const [dados, setDados] = useState<DadosVenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const resultado = await buscarDadosSemanais();
        setDados(resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-2xl min-h-[400px] flex items-center justify-center">
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-2xl min-h-[400px] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (dados.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-2xl min-h-[400px] flex items-center justify-center">
        <p>Nenhum dado encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">📊 Vendas Semanais</h2>
      <div className="mb-4 text-sm">
        <span className="inline-flex items-center">
          <span className="w-4 h-0.5 bg-red-500 mr-2"></span>
          Meta semanal: R$ {META_SEMANAL.toLocaleString('pt-BR')}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis 
            dataKey="semana" 
            stroke="currentColor"
          />
          <YAxis 
            stroke="currentColor"
            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Tooltip 
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Total']}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--tooltip-text)'
            }}
          />
          <ReferenceLine 
            y={META_SEMANAL} 
            stroke="#ef4444" 
            strokeDasharray="3 3"
            label={{
              value: `Meta: R$ ${META_SEMANAL}`,
              fill: '#ef4444',
              position: 'right'
            }}
          />
          <Bar 
            dataKey="total" 
            fill="var(--chart-bar)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}