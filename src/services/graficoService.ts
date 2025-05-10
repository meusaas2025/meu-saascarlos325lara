import { supabase } from "../lib/supabaseClient";

export interface DadosVenda {
  categoria: string;
  total: number;
  semana?: string;
}

export async function buscarDadosPizza(startDate?: string, endDate?: string): Promise<DadosVenda[]> {
  let query = supabase.from('vendas')
    .select('categoria, valor');

  if (startDate) {
    query = query.gte('criado_em', startDate);
  }
  if (endDate) {
    query = query.lte('criado_em', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Agrupa os dados por categoria
  const groupedData = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.valor);
    return acc;
  }, {});

  return Object.entries(groupedData || {}).map(([categoria, total]) => ({
    categoria,
    total: Number(total.toFixed(2))
  }));
}

export async function buscarDadosSemanais(startDate?: string, endDate?: string): Promise<DadosVenda[]> {
  let query = supabase.from('vendas')
    .select('criado_em, valor');

  if (startDate) {
    query = query.gte('criado_em', startDate);
  }
  if (endDate) {
    query = query.lte('criado_em', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Agrupa os dados por semana
  const groupedData = data?.reduce((acc: Record<string, number>, item) => {
    const week = new Date(item.criado_em).toLocaleDateString('pt-BR', { week: 'numeric' });
    const weekKey = `Semana ${week}`;
    acc[weekKey] = (acc[weekKey] || 0) + Number(item.valor);
    return acc;
  }, {});

  return Object.entries(groupedData || {}).map(([semana, total]) => ({
    semana,
    total: Number(total.toFixed(2))
  }));
}