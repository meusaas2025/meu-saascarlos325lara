/*
  # Create view for pie chart data

  1. New View
    - `resumo_pizza`
      - Aggregates sales data by category
      - Shows total value per category
      - Orders results by total value descending

  2. Purpose
    - Simplifies data fetching for pie chart
    - Maintains consistency with weekly summary approach
    - Improves query performance
*/

create or replace view resumo_pizza as
select 
  categoria,
  sum(valor) as total
from vendas
group by categoria
order by total desc;