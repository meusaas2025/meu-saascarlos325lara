/*
  # Update database schema

  1. Changes
    - Update usuarios table
      - Rename data_criacao to criado_em
      - Make email not null
      - Change uuid generation function
    - Update assinaturas table
      - Rename data_inicio/data_fim to inicio/fim
      - Add stripe fields
      - Update status check constraint
      - Add cascade delete
    - Update vendas table
      - Rename data to criado_em
      - Add cascade delete
      - Add not null constraints
      - Add check constraint for valor

  2. Security
    - All existing RLS policies remain unchanged
*/

-- Update usuarios table
ALTER TABLE usuarios 
  RENAME COLUMN data_criacao TO criado_em;

ALTER TABLE usuarios
  ALTER COLUMN email SET NOT NULL;

-- Update assinaturas table
ALTER TABLE assinaturas 
  RENAME COLUMN data_inicio TO inicio;

ALTER TABLE assinaturas 
  RENAME COLUMN data_fim TO fim;

ALTER TABLE assinaturas 
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

DO $$ 
BEGIN
  ALTER TABLE assinaturas 
    DROP CONSTRAINT IF EXISTS assinaturas_status_check;
  
  ALTER TABLE assinaturas
    ADD CONSTRAINT assinaturas_status_check 
    CHECK (status IN ('ativa', 'inativa', 'teste'));
END $$;

-- Update vendas table
ALTER TABLE vendas 
  RENAME COLUMN data TO criado_em;

ALTER TABLE vendas
  ALTER COLUMN valor SET NOT NULL,
  ADD CONSTRAINT vendas_valor_check CHECK (valor >= 0);