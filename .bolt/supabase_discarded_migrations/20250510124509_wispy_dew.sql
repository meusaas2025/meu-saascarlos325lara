/*
  # Create subscriptions table

  1. New Table
    - `assinaturas`
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key to usuarios)
      - `status` (text) - possible values: 'teste', 'ativa', 'expirada'
      - `data_inicio` (timestamp)
      - `data_fim` (timestamp)
  
  2. Security
    - Enable RLS on `assinaturas` table
    - Add policies for users to read their own subscriptions
    - Add policies for system to manage subscription status
*/

CREATE TABLE IF NOT EXISTS assinaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('teste', 'ativa', 'expirada')),
  data_inicio timestamp with time zone DEFAULT now(),
  data_fim timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON assinaturas
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Allow system to manage subscriptions (using service_role)
CREATE POLICY "Service role can manage all subscriptions"
  ON assinaturas
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);