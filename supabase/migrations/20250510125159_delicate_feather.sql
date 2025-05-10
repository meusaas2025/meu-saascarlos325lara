/*
  # Weekly Sales Summary Function
  
  1. Function Details
    - Name: resumo_semanal
    - Returns: Table with daily sales totals for the last 7 days
    - Columns:
      - dia (text): Day of the week
      - total (numeric): Total sales for that day
  
  2. Security
    - Grants execute permission to authenticated users
    
  3. Features
    - Returns 0 instead of null for days with no sales
    - Orders results chronologically by actual date
    - Includes data from the last 7 days
*/

create or replace function resumo_semanal()
returns table (
  dia text,
  total numeric
) as $$
begin
  return query
  select
    to_char(date_trunc('day', v.criado_em), 'Dy') as dia,
    coalesce(sum(v.valor), 0) as total
  from generate_series(
    current_date - interval '6 days',
    current_date,
    interval '1 day'
  ) as d
  left join vendas v on date_trunc('day', v.criado_em) = d
  group by 1, d
  order by d;
end;
$$ language plpgsql;

-- Grant execute permission to authenticated users
grant execute on function resumo_semanal to authenticated;