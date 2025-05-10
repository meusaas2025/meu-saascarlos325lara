import { supabase } from "../lib/supabaseClient";

export interface DadosVenda {
  categoria: string;
  total: number;
  semana?: string;
}

export async function buscarDadosPizza(startDate?: string, endDate?: string): Promise<DadosVenda[]> {
  let query = supabase.from('vendas')
    .select('categoria, total');

  if (startDate) {
    query = query.gte('criado_em', startDate);
  }
  if (endDate) {
    query = query.lte('criado_em', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  const groupedData = data?.reduce((acc: Record<string, number>, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + Number(item.total);
    return acc;
  }, {});

  return Object.entries(groupedData || {}).map(([categoria, total]) => ({
    categoria,
    total: Number(total.toFixed(2))
  }));
}

export async function buscarDadosSemanais(startDate?: string, endDate?: string): Promise<DadosVenda[]> {
  let query = supabase.from('vendas')
    .select('criado_em, total');

  if (startDate) {
    query = query.gte('criado_em', startDate);
  }
  if (endDate) {
    query = query.lte('criado_em', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Agrupar por semana usando o número da semana no ano
  const groupedData = data?.reduce((acc: Record<string, number>, item) => {
    const date = new Date(item.criado_em);
    const week = getWeekNumber(date); // Semana do ano
    const weekKey = `Semana ${week}`;
    acc[weekKey] = (acc[weekKey] || 0) + Number(item.total);
    return acc;
  }, {});

  return Object.entries(groupedData || {}).map(([semana, total]) => ({
    categoria: '',
    semana,
    total: Number(total.toFixed(2))
  }));
}

// Função auxiliar para obter número da semana do ano
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.ceil((diff + start.getDay() + 1) / 7);
}