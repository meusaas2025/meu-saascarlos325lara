/*
  # Create resumo_vendas view

  1. New Views
    - `resumo_vendas`: Aggregates daily sales data
      - `data` (date)
      - `total` (numeric)
      - `quantidade` (bigint)

  2. Security
    - Enable RLS on the view
    - Add policy for authenticated users to read data
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