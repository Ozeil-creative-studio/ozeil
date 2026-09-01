-- Ajoute le lien Printify sur chaque produit (bouton "Commander" de la page Boutique).
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil), après schema.sql.

alter table products add column if not exists printify_url text;
