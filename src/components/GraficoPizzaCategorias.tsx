import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CORES = ["#00FFCC", "#FF6384", "#FFCE56", "#36A2EB", "#4BC0C0"];

interface DadosVenda {
  categoria: string;
  valor: number;
}

export default function GraficoPizzaCategorias() {
  const [dados, setDados] = useState<DadosVenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("vendas")
          .select("categoria, valor");

        if (error) throw error;

        if (data) {
          const agrupado = data.reduce<Record<string, number>>((acc, item) => {
            acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
            return acc;
          }, {});

          const resultado = Object.entries(agrupado).map(([categoria, valor]) => ({
            categoria,
            valor: Number(valor.toFixed(2)),
          }));

          setDados(resultado);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
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
      <h2 className="text-2xl font-bold mb-6">Distribuição por Categoria</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={({ categoria, valor }) => `${categoria}: R$ ${valor.toLocaleString('pt-BR')}`}
          >
            {dados.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
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