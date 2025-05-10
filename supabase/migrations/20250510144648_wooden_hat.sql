/*
  # Create vendas table and add sample data

  1. New Tables
    - `vendas`
      - `id` (uuid, primary key)
      - `valor` (numeric, not null)
      - `categoria` (text, not null)
      - `criado_em` (timestamptz, default now())

  2. Security
    - Enable RLS on `vendas` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data

  3. Sample Data
    - Insert sample records for testing
*/

CREATE TABLE IF NOT EXISTS vendas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  valor numeric NOT NULL,
  categoria text NOT NULL,
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON vendas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own data"
  ON vendas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample data
INSERT INTO vendas (valor, categoria, criado_em) VALUES
  (150.00, 'Produtos', now() - interval '6 days'),
  (299.99, 'Serviços', now() - interval '5 days'),
  (75.50, 'Produtos', now() - interval '4 days'),
  (450.00, 'Assinaturas', now() - interval '3 days'),
  (199.99, 'Serviços', now() - interval '2 days'),
  (89.90, 'Produtos', now() - interval '1 day'),
  (599.99, 'Assinaturas', now());