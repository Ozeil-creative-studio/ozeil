-- Ozeil — catégorie de produit (Hoodie, T-shirt, Manche longue, Camisoles, Maillot, Accessoires),
-- distincte des collections. Alimente le filtre de la Boutique et la section "Nos accessoires"
-- de l'accueil (catégorie 'accessoire' = affiché automatiquement là).
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

alter table products add column if not exists category text
  check (category in ('hoodie','tshirt','manche_longue','camisole','maillot','accessoire'));
