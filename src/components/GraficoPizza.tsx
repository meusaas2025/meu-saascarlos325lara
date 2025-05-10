import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { buscarDadosPizza, type DadosVenda } from "@/services/pizzaService";

const CORES = ["#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function GraficoPizza() {
  const [dados, setDados] = useState<DadosVenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const resultado = await buscarDadosPizza();
        setDados(resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

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
    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Distribuição por Categoria</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="total"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ categoria, total }) => `${categoria}: R$ ${total.toLocaleString('pt-BR')}`}
          >
            {dados.map((_, i) => (
              <Cell key={`cell-${i}`} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--tooltip-text)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}