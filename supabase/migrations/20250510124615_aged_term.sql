/*
  # Create sales table with security policies

  1. New Table
    - `vendas` (sales)
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key to usuarios)
      - `valor` (numeric, sale amount)
      - `data` (timestamp, sale date)
      - `categoria` (text, sale category)

  2. Security
    - Enable RLS on `vendas` table
    - Add policies for:
      - Users to read their own sales data
      - Service role to manage all sales
*/

CREATE TABLE IF NOT EXISTS vendas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  valor numeric NOT NULL CHECK (valor >= 0),
  categoria text NOT NULL,
  data timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own sales
CREATE POLICY "Users can read own sales"
  ON vendas
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Allow service role to manage all sales
CREATE POLICY "Service role can manage all sales"
  ON vendas
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_vendas_usuario_id ON vendas(usuario_id);
CREATE INDEX idx_vendas_data ON vendas(data);