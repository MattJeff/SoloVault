-- Migration: Ajouter colonnes source et page à la table users
-- Exécute ce script dans Supabase SQL Editor si tu as déjà créé la table users

ALTER TABLE users ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Unknown';
ALTER TABLE users ADD COLUMN IF NOT EXISTS page TEXT DEFAULT '/';

-- Vérification
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
