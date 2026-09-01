-- Ozeil — blocs de section modifiables depuis le dashboard (accueil + boutique).
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil), après schema.sql et migration_002.

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null check (page in ('accueil','boutique')),
  type text not null check (type in ('texte','image_texte','bandeau')),
  position integer not null default 0,
  heading text,
  body text,
  image_url text,
  image_side text check (image_side in ('left','right')),
  button_text text,
  button_url text,
  created_at timestamptz not null default now()
);

alter table page_sections enable row level security;

create policy "public read page_sections" on page_sections
  for select using (true);

create policy "authenticated write page_sections" on page_sections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
