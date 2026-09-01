-- Ozeil — bande/section d'annonce (remplace le système de blocs de section, migration_003).
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

create table if not exists promo (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default false,
  placement text not null default 'bande' check (placement in ('bande','section','les_deux')),
  image_url text,
  heading text,
  body text,
  button_text text,
  button_url text,
  created_at timestamptz not null default now()
);

alter table promo enable row level security;

create policy "public read promo" on promo
  for select using (true);

create policy "authenticated write promo" on promo
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Optionnel : l'ancien système de blocs de section (migration_003) n'est plus utilisé par le site.
-- Si tu veux le retirer de ta base (aucune donnée importante n'y a été ajoutée) :
-- drop table if exists page_sections;
