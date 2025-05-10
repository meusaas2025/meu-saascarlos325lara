/*
  # Create resumo_semanal function

  1. New Function
    - `resumo_semanal()`
      - Returns daily sales totals for the last 7 days
      - Groups by day of week
      - Orders results by day

  2. Purpose
    - Provides aggregated data for weekly sales chart
    - Formats dates as day abbreviations (e.g., 'Mon', 'Tue')
    - Simplifies frontend data fetching
*/

create or replace function resumo_semanal()
returns table (
  dia text,
  total numeric
) as $$
begin
  return query
  select
    to_char(date_trunc('day', criado_em), 'Dy') as dia,
    coalesce(sum(valor), 0) as total
  from vendas
  where criado_em > current_date - interval '7 days'
  group by 1
  order by min(criado_em);
end;
$$ language plpgsql;

-- Grant execute permission to authenticated users
grant execute on function resumo_semanal to authenticated;