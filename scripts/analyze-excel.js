const XLSX = require('xlsx');
const path = require('path');

// Lire le fichier Excel
const filePath = '/Users/mathishiguinen/Desktop/SOLOVAULT/Copie de Solo Developers Making $10K+_Month - Starter Story.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Lire avec range pour ignorer la première ligne
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

  console.log('📊 Analyse du fichier Excel\n');
  console.log('Nombre de lignes:', jsonData.length);
  console.log('\n📋 Colonnes détectées:');
  
  if (jsonData.length > 0) {
    const columns = Object.keys(jsonData[0]);
    columns.forEach((col, index) => {
      console.log(`${index + 1}. "${col}"`);
    });

    console.log('\n🔍 Exemple de la première ligne (vraies données):');
    console.log(JSON.stringify(jsonData[0], null, 2));
    
    console.log('\n🔍 Exemple de la deuxième ligne:');
    console.log(JSON.stringify(jsonData[1], null, 2));
  }
} catch (error) {
  console.error('Erreur:', error.message);
}
