import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase
      .from('resumo_vendas')
      .select('*')
    
    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar dados de vendas' },
      { status: 500 }
    )
  }
}