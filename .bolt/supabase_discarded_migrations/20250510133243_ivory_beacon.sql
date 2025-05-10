/*
  # Initial Database Schema Setup

  1. New Tables
    - `usuarios` (users)
      - Basic user information and authentication
    - `assinaturas` (subscriptions)
      - Subscription status and payment info
    - `vendas` (sales)
      - Sales transactions and analytics data

  2. Security
    - Enable RLS on all tables
    - Add appropriate access policies
    - Set up necessary indexes

  3. Functions
    - Weekly sales summary
    - Category distribution
*/

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text,
  criado_em timestamp with time zone DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create assinaturas table
CREATE TABLE IF NOT EXISTS assinaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  status text CHECK (status IN ('ativa', 'inativa', 'teste')),
  inicio timestamp with time zone DEFAULT now(),
  fim timestamp with time zone,
  stripe_customer_id text,
  stripe_subscription_id text
);

ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON assinaturas
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Create vendas table
CREATE TABLE IF NOT EXISTS vendas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  valor numeric NOT NULL CHECK (valor >= 0),
  categoria text NOT NULL,
  criado_em timestamp with time zone DEFAULT now()
);

ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sales"
  ON vendas
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendas_usuario_id ON vendas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_vendas_criado_em ON vendas(criado_em);

-- Create view for pie chart data
CREATE OR REPLACE VIEW resumo_pizza AS
SELECT 
  categoria,
  sum(valor) as total
FROM vendas
GROUP BY categoria
ORDER BY total DESC;

-- Create function for weekly summary
CREATE OR REPLACE FUNCTION resumo_semanal()
RETURNS TABLE (
  semana text,
  total numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    'Semana ' || to_char(date_trunc('week', d), 'WW') as semana,
    COALESCE(sum(v.valor), 0) as total
  FROM generate_series(
    date_trunc('week', current_date - interval '4 weeks'),
    date_trunc('week', current_date),
    interval '1 week'
  ) as d
  LEFT JOIN vendas v ON date_trunc('week', v.criado_em) = d
  GROUP BY 1, d
  ORDER BY d;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION resumo_semanal TO authenticated;