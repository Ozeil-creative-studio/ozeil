-- Ozeil — variantes de produit (ex. un même design vendu en t-shirt ET en hoodie).
-- Chaque variante a son propre lien Printify et, optionnellement, son propre prix
-- (sinon le prix de base du produit est utilisé).
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

alter table products add column if not exists variants jsonb not null default '[]'::jsonb;
