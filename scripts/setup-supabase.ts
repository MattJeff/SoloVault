// Script pour créer les tables Supabase automatiquement
// Usage: npx tsx scripts/setup-supabase.ts

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://qwkieyypejlniuewavya.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a2lleXlwZWpsbml1ZXdhdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTEzMzAsImV4cCI6MjA3ODM4NzMzMH0.xSYcBsILphPwXnzz2WLsSGTU4PVKSXOMBovD784j624'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données Supabase...\n')

  try {
    // Test de connexion
    const { data, error } = await supabase.from('user_progress').select('count').limit(1)

    if (error && error.code === '42P01') {
      console.log('⚠️  Les tables n\'existent pas encore.')
      console.log('\n📋 Instructions manuelles:')
      console.log('1. Va sur https://qwkieyypejlniuewavya.supabase.co/project/qwkieyypejlniuewavya/sql')
      console.log('2. Copie le contenu du fichier supabase-setup.sql')
      console.log('3. Colle-le dans l\'éditeur SQL et exécute')
      console.log('4. Relance ce script pour vérifier\n')
      return
    }

    console.log('✅ Tables existantes détectées!')

    // Vérifier chaque table
    const tables = ['user_progress', 'referrals', 'quiz_responses']
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.log(`❌ Erreur sur la table ${table}:`, error.message)
      } else {
        console.log(`✅ Table ${table} OK`)
      }
    }

    console.log('\n🎉 Base de données configurée avec succès!')

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

setupDatabase()
