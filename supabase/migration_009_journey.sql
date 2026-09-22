-- Ozeil — "Le voyage du hoodie" : mur de photos soumises par le public, approuvées par l'admin.
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

-- ---------- Table ----------

create table if not exists journey_entries (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null
    check (photo_url ~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/journey-photos/'),
  name text not null check (char_length(name) between 1 and 60),
  city text check (char_length(city) <= 80),
  message text check (char_length(message) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

alter table journey_entries enable row level security;

-- Le public ne voit que les entrées approuvées.
create policy "public read approved journey" on journey_entries
  for select using (status = 'approved');

-- N'importe qui peut soumettre, mais seulement en statut "pending".
create policy "anyone can submit journey" on journey_entries
  for insert to anon, authenticated with check (status = 'pending');

-- L'admin (connecté) voit tout, approuve, modifie et supprime.
create policy "authenticated manage journey" on journey_entries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

grant select, insert on journey_entries to anon;
grant all on journey_entries to authenticated;

-- ---------- Storage (photos du voyage) ----------
-- Bucket public : les photos sont servies par URL directe (noms aléatoires).
-- Volontairement AUCUNE policy de lecture/listing pour anon : personne ne peut lister les photos en attente.
-- Limite de 5 Mo et formats image seulement.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('journey-photos', 'journey-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "anyone upload journey-photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'journey-photos');
create policy "authenticated delete journey-photos" on storage.objects
  for delete using (bucket_id = 'journey-photos' and auth.role() = 'authenticated');
