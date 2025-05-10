/*
  # Create users table with authentication

  1. New Tables
    - `usuarios`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `email` (text, unique) - User's email address
      - `nome` (text) - User's name
      - `data_criacao` (timestamp) - When the user was created
  
  2. Security
    - Enable RLS on `usuarios` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  nome text,
  data_criacao timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);