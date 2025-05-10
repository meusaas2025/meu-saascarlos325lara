import { supabase } from "@/lib/supabaseClient";

export interface DadosVenda {
  categoria: string;
  total: number;
}

export async function buscarDadosPizza(): Promise<DadosVenda[]> {
  const { data, error } = await supabase
    .from('resumo_pizza')
    .select('*');

  if (error) throw error;
  
  return data?.map(item => ({
    categoria: item.categoria,
    total: Number(item.total.toFixed(2))
  })) || [];
}