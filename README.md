# meu-saascarlos325lara
create table mensagens_enviadas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id),
  conteudo text,
  criada_em timestamp with time zone default now()
);

create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id),
  status text, -- ativo, expirado, cancelado
  iniciou_em timestamp with time zone default now(),
  expiracao timestamp with time zone
);
