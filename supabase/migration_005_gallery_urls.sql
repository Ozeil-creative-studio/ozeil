-- Ozeil — photos supplémentaires par produit (galerie), en plus de la photo principale (image_url).
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

alter table products add column if not exists gallery_urls text[] not null default '{}';
