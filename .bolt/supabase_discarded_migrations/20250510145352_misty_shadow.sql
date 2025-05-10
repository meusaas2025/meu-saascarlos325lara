/*
  # Create resumo_vendas view

  1. Changes
    - Creates a view `resumo_vendas` that aggregates sales data by date
    - Formats date as YYYY-MM-DD string
    - Calculates total sales amount per day
    - Orders results by date

  2. Security
    - Sets security_invoker to true for RLS enforcement
    - Adds policy for authenticated users to access the view
*/

CREATE OR REPLACE VIEW resumo_vendas AS
SELECT
  DATE(criado_em) as data,
  SUM(valor) as total,
  COUNT(*) as quantidade
FROM vendas
GROUP BY DATE(criado_em)
ORDER BY data DESC;

-- Enable RLS
ALTER VIEW resumo_vendas SET (security_invoker = true);

-- Create policy for the underlying table
CREATE POLICY "Users can read resumo_vendas"
  ON vendas
  FOR SELECT
  TO authenticated
  USING (true);