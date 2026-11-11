-- SAEP Inteligente | Estrutura inicial do banco Supabase
-- Execute no SQL Editor de um projeto Supabase novo, após revisão institucional.
create extension if not exists pgcrypto;

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel text not null check (papel in ('administrador','coordenacao','professor')),
  unidade_id uuid,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table if not exists public.unidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  codigo text unique,
  ativa boolean not null default true,
  criado_em timestamptz not null default now()
);

create table if not exists public.cursos (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references public.unidades(id),
  nome text not null,
  modalidade text,
  ativo boolean not null default true
);

create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references public.cursos(id),
  codigo text,
  nome text not null,
  turno text,
  ano integer,
  ativo boolean not null default true
);

create table if not exists public.alunos (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas(id),
  matricula text,
  nome text not null,
  ativo boolean not null default true
);

create table if not exists public.aplicacoes (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas(id),
  professor_id uuid references public.perfis(id),
  titulo text not null,
  data_prevista date not null,
  data_realizada date,
  status text not null default 'agendada' check (status in ('agendada','confirmada','em_andamento','concluida','cancelada','atrasada')),
  observacao text,
  criado_por uuid references public.perfis(id),
  criado_em timestamptz not null default now()
);

create table if not exists public.simulados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  identificador text,
  descricao text,
  ativo boolean not null default true
);

create table if not exists public.competencias (
  id uuid primary key default gen_random_uuid(),
  codigo text,
  descricao text not null,
  capacidade text
);

create table if not exists public.resultados (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id),
  aplicacao_id uuid references public.aplicacoes(id),
  simulado_id uuid references public.simulados(id),
  competencia_id uuid references public.competencias(id),
  nota numeric(7,2),
  acertos integer,
  total_questoes integer,
  data_importacao timestamptz not null default now(),
  arquivo_origem text,
  importado_por uuid references public.perfis(id),
  unique (aluno_id, aplicacao_id, simulado_id, competencia_id)
);

create table if not exists public.intervencoes (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas(id),
  competencia_id uuid references public.competencias(id),
  descricao text not null,
  responsavel_id uuid references public.perfis(id),
  prazo date,
  status text not null default 'planejada' check(status in ('planejada','em_andamento','concluida')),
  registro_em timestamptz not null default now()
);

create table if not exists public.auditoria (
  id bigint generated always as identity primary key,
  usuario_id uuid references auth.users(id),
  acao text not null,
  tabela text not null,
  registro_id text,
  detalhes jsonb,
  criado_em timestamptz not null default now()
);

-- RLS: habilitada em todas as tabelas que contêm dados institucionais.
alter table public.perfis enable row level security;
alter table public.unidades enable row level security;
alter table public.cursos enable row level security;
alter table public.turmas enable row level security;
alter table public.alunos enable row level security;
alter table public.aplicacoes enable row level security;
alter table public.simulados enable row level security;
alter table public.competencias enable row level security;
alter table public.resultados enable row level security;
alter table public.intervencoes enable row level security;
alter table public.auditoria enable row level security;

-- Funções auxiliares de autorização. O perfil deve ser provisionado pelo administrador.
create or replace function public.meu_papel()
returns text language sql stable security definer set search_path=public
as $$ select papel from public.perfis where id=auth.uid() and ativo=true $$;

create or replace function public.minha_unidade()
returns uuid language sql stable security definer set search_path=public
as $$ select unidade_id from public.perfis where id=auth.uid() and ativo=true $$;

-- Leitura limitada à unidade. Administrador e coordenação podem consultar dados da unidade.
create policy "perfil consulta o proprio registro" on public.perfis for select to authenticated
using (id=auth.uid() or (unidade_id=public.minha_unidade() and public.meu_papel() in ('administrador','coordenacao')));

create policy "usuarios consultam unidade" on public.unidades for select to authenticated
using (id=public.minha_unidade());

create policy "cursos da unidade" on public.cursos for select to authenticated
using (unidade_id=public.minha_unidade());

create policy "turmas da unidade" on public.turmas for select to authenticated
using (exists(select 1 from public.cursos c where c.id=curso_id and c.unidade_id=public.minha_unidade()));

create policy "alunos da unidade" on public.alunos for select to authenticated
using (exists(select 1 from public.turmas t join public.cursos c on c.id=t.curso_id where t.id=turma_id and c.unidade_id=public.minha_unidade()));

create policy "aplicacoes da unidade leitura" on public.aplicacoes for select to authenticated
using (exists(select 1 from public.turmas t join public.cursos c on c.id=t.curso_id where t.id=turma_id and c.unidade_id=public.minha_unidade())
and (public.meu_papel() in ('administrador','coordenacao') or professor_id=auth.uid()));

create policy "simulados leitura autenticada" on public.simulados for select to authenticated using (true);
create policy "competencias leitura autenticada" on public.competencias for select to authenticated using (true);

create policy "resultados por unidade e papel" on public.resultados for select to authenticated
using (exists(select 1 from public.alunos a join public.turmas t on t.id=a.turma_id join public.cursos c on c.id=t.curso_id where a.id=aluno_id and c.unidade_id=public.minha_unidade())
and (public.meu_papel() in ('administrador','coordenacao') or exists(select 1 from public.aplicacoes ap where ap.id=aplicacao_id and ap.professor_id=auth.uid())));

create policy "intervencoes leitura coord" on public.intervencoes for select to authenticated
using (public.meu_papel() in ('administrador','coordenacao'));

create policy "auditoria leitura admin" on public.auditoria for select to authenticated
using (public.meu_papel()='administrador');

-- IMPORTANTE:
-- Este script é uma base inicial, não libera INSERT/UPDATE/DELETE deliberadamente.
-- As políticas de escrita devem ser adicionadas após confirmar os fluxos de cada perfil.
-- Nunca coloque a chave service_role no navegador. Use somente a chave anon/public.
