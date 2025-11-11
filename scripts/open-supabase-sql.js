#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configuration automatique de Supabase...\n');

// Lire le SQL
const sqlPath = path.join(__dirname, '..', 'supabase-setup.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

// Copier dans le clipboard
try {
  const platform = process.platform;

  if (platform === 'darwin') {
    // macOS
    execSync('pbcopy', { input: sqlContent });
    console.log('✅ SQL copié dans le presse-papier!');
  } else if (platform === 'win32') {
    // Windows
    execSync('clip', { input: sqlContent });
    console.log('✅ SQL copié dans le presse-papier!');
  } else {
    // Linux
    try {
      execSync('xclip -selection clipboard', { input: sqlContent });
      console.log('✅ SQL copié dans le presse-papier!');
    } catch {
      console.log('ℹ️  Installe xclip pour copier automatiquement: sudo apt-get install xclip');
    }
  }
} catch (error) {
  console.log('⚠️  Impossible de copier automatiquement');
}

// Ouvrir le navigateur
const supabaseUrl = 'https://supabase.com/dashboard/project/qwkieyypejlniuewavya/sql/new';

console.log('\n📋 Instructions:');
console.log('1. Le SQL a été copié dans ton presse-papier');
console.log('2. Une page Supabase va s\'ouvrir dans ton navigateur');
console.log('3. Colle le SQL (Cmd/Ctrl + V) dans l\'éditeur');
console.log('4. Clique sur "Run" en bas à droite');
console.log('5. Attends que les tables soient créées\n');

console.log('🌐 Ouverture de Supabase...');

try {
  const platform = process.platform;
  const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
  execSync(`${command} "${supabaseUrl}"`);

  console.log('✅ Supabase ouvert dans le navigateur!');
  console.log('\n⏳ Après avoir exécuté le SQL, lance: npm run dev');
} catch (error) {
  console.log('\n⚠️  Ouvre manuellement: ' + supabaseUrl);
}

console.log('\n🎯 Une fois les tables créées, tout fonctionnera automatiquement!');
