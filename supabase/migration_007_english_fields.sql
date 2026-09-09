-- Ozeil — champs anglais (optionnels) pour le site multilingue FR/EN.
-- Laisser vide = le site anglais réutilise automatiquement le texte français.
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

alter table products add column if not exists title_en text;
alter table products add column if not exists description_en text;

alter table collections add column if not exists title_en text;

alter table promo add column if not exists heading_en text;
alter table promo add column if not exists body_en text;
alter table promo add column if not exists button_text_en text;
