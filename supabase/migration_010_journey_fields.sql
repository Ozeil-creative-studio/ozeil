-- Ozeil / The Switch — champs du formulaire : nom de la photo, adresse (pour la future carte),
-- contact privé, et coordonnées géographiques à remplir plus tard.
-- Le contact (courriel / pseudo) n'est JAMAIS lisible par le public : seul l'admin connecté le voit.
-- À exécuter dans le SQL Editor de Supabase (projet Ozeil).

-- ---------- Colonnes ----------

-- "city" devient "address" (saisie d'adresse ou de lieu)
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'journey_entries' and column_name = 'city')
     and not exists (select 1 from information_schema.columns
                     where table_schema = 'public' and table_name = 'journey_entries' and column_name = 'address') then
    alter table journey_entries rename column city to address;
  end if;
end $$;

alter table journey_entries add column if not exists contact text;
alter table journey_entries add column if not exists lat double precision;
alter table journey_entries add column if not exists lng double precision;

-- longueurs maximales
alter table journey_entries drop constraint if exists journey_entries_city_check;
alter table journey_entries drop constraint if exists journey_entries_address_check;
alter table journey_entries add constraint journey_entries_address_check
  check (address is null or char_length(address) <= 160);
alter table journey_entries drop constraint if exists journey_entries_contact_check;
alter table journey_entries add constraint journey_entries_contact_check
  check (contact is null or char_length(contact) <= 120);

-- ---------- Confidentialité du contact ----------
-- Le public peut lire toutes les colonnes SAUF "contact".
revoke select on journey_entries from anon;
grant select (id, photo_url, name, address, message, status, created_at, lat, lng)
  on journey_entries to anon;

-- Le public peut soumettre (la policy RLS impose déjà status = 'pending').
revoke insert on journey_entries from anon;
grant insert (photo_url, name, address, message, contact, status)
  on journey_entries to anon;

-- L'admin connecté garde l'accès complet (lecture du contact, modification, suppression).
grant all on journey_entries to authenticated;
