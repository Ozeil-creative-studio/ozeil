-- Ozeil — schema for products, collections, storage, and access rules.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query > Run).

create extension if not exists pgcrypto;

-- ---------- Tables ----------

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(10,2) not null,
  description text,
  image_url text,
  collection_id uuid references collections(id) on delete set null,
  featured_slot text check (featured_slot in ('nouveaute','meilleur_vendeur')),
  created_at timestamptz not null default now()
);

-- Only one product can hold a given featured slot at a time.
create unique index if not exists one_product_per_featured_slot
  on products (featured_slot)
  where featured_slot is not null;

-- ---------- Row Level Security ----------

alter table collections enable row level security;
alter table products enable row level security;

create policy "public read collections" on collections
  for select using (true);
create policy "public read products" on products
  for select using (true);

create policy "authenticated write collections" on collections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- Storage (product images) ----------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "authenticated write product-images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "authenticated update product-images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "authenticated delete product-images" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ---------- Seed: the 5 current products ----------
-- Images point at the site's existing /images files — no re-upload needed.
-- No collections yet: add them from the dashboard whenever ready.

insert into products (title, price, description, image_url, featured_slot) values
  ('T-shirt Comète', 45.00, 'Coton lourd 240g, coupe droite, sérigraphie du logo Ozeil sur la poitrine. Disponible du S au XXL.', 'images/tshirt-nouveaute.png', 'nouveaute'),
  ('Hoodie Éclipse', 68.00, 'Molleton épais 320g, capuchon doublé, poche kangourou. Notre pièce la plus vendue depuis août 2025.', 'images/hoodie-front.png', 'meilleur_vendeur'),
  ('Casquette Orbite', 32.00, 'Casquette ajustable brodée, logo Ozeil à l''avant. Une taille, ajustement à sangle.', 'images/casquette.jpg', null),
  ('Coque Aurore', 28.00, 'Coque de téléphone souple et résistante aux chocs. Précisez votre modèle à la commande.', 'images/coque-iphone.jpg', null),
  ('Sac Nova', 75.00, 'Sac à dos 22L, compartiment laptop rembourré, logo Ozeil brodé. Idéal pour l''école ou le travail.', 'images/sac-a-dos.jpg', null)
on conflict do nothing;
