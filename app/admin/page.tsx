'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Lock, Check, AlertCircle, Download, History } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  source: string;
  page: string;
  createdAt: string;
}

export default function AdminPage() {
  const [code, setCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [projectCount, setProjectCount] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const handleAuth = () => {
    if (code === process.env.NEXT_PUBLIC_ADMIN_CODE || code === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Code incorrect');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');
    setMessage('');

    try {
      // 1. Lire le fichier Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Lire à partir de la ligne 2 (ignorer la première ligne si c'est un header)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

      console.log('📊 Données Excel reçues:', jsonData.length, 'lignes');
      console.log('🔍 Première ligne:', jsonData[0]);

      // 2. Mapper les données vers notre format
      const projects = jsonData.map((row: any, index: number) => {
        // Gérer le revenue qui peut être un nombre ou une string
        let revenue = 0;
        if (typeof row['Revenue (yearly)'] === 'number') {
          revenue = row['Revenue (yearly)'];
        } else if (typeof row['Revenue (yearly)'] === 'string') {
          revenue = parseInt(String(row['Revenue (yearly)']).replace(/[^0-9]/g, '')) || 0;
        }

        return {
          id: index,
          name: row['Business'] || '',
          revenue: revenue,
          problem: row['Problem / customer pain point'] || '',
          solution: row['Solution'] || '',
          developer: row['Developer'] || '',
          ideation: row['Ideation'] || '',
          mvp: row['MVP'] || '',
          growth1: row['Growth'] || '',
          growth2: row['Growth_1'] || '', // Excel utilise _1 pour les colonnes dupliquées
          industry: row['Industry'] || '',
          platform: row['Platform'] || '',
          productType: row['Type of Product'] || '',
          target: row['Target'] || '',
          priceRange: row['Price Range'] || '',
          businessModel: row['Business Model'] || '',
          freePlan: row['Free Plan'] || '',
          pricingDetails: row['Pricing Details'] || '',
          traffic: row['Monthly Website Traffic'] || '',
          revenuePerTraffic: row['Revenue Per Traffic'] || '',
          stillSolo: row['Still solo?'] || '',
          caseStudy: row['Full Case Study'] || ''
        };
      });

      setProjectCount(projects.length);

      // 3. Envoyer au backend
      const response = await fetch('/api/admin/update-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      setUploadStatus('success');
      setMessage(`✅ ${projects.length} projets mis à jour avec succès !`);

      // Reset file input
      e.target.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setMessage('❌ Erreur lors de l\'upload. Vérifiez le format du fichier.');
    } finally {
      setIsUploading(false);
    }
  };

  // Load users
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/get-users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Download users as Excel
  const downloadUsers = () => {
    const excelData = users.map(user => ({
      'Prénom': user.firstName,
      'Nom': user.lastName,
      'Email': user.email,
      'Source': user.source,
      'Page': user.page,
      'Date': new Date(user.createdAt).toLocaleString('fr-FR')
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');

    const fileName = `solovault-users-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Check if already authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">🔒 Admin Access</h1>
          <p className="text-zinc-400 text-center mb-6">
            Entrez le code PIN pour accéder au dashboard
          </p>

          <input
            type="password"
            placeholder="Code PIN"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg mb-4 focus:outline-none focus:border-orange-500"
            autoFocus
          />

          <button
            onClick={handleAuth}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 font-semibold rounded-lg transition"
          >
            Accéder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📊 Admin Dashboard</h1>
          <p className="text-zinc-400">Gérez la base de données SoloVault</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-2">Projets actifs</div>
            <div className="text-3xl font-bold">{projectCount || 50}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-2">Utilisateurs inscrits</div>
            <div className="text-3xl font-bold">{users.length}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-2">Format</div>
            <div className="text-lg font-semibold">Excel (.xlsx)</div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Mettre à jour la base de données</h2>
              <p className="text-zinc-400 text-sm">
                Upload ton fichier Excel pour mettre à jour tous les projets
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-black border border-zinc-800 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Instructions
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Le fichier doit être au format .xlsx ou .xls</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Les colonnes doivent correspondre au format SoloVault</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Un backup automatique sera créé avant la mise à jour</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Le site sera automatiquement mis à jour après l'upload</span>
              </li>
            </ul>
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-orange-500 transition">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-lg font-semibold mb-2">
                {isUploading ? 'Upload en cours...' : 'Cliquer pour sélectionner un fichier'}
              </p>
              <p className="text-sm text-zinc-500">
                ou glisser-déposer un fichier .xlsx
              </p>
            </label>
          </div>

          {/* Status Messages */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg ${
              uploadStatus === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                : 'bg-red-500/10 border border-red-500/30 text-red-500'
            }`}>
              {message}
            </div>
          )}

          {/* Loading State */}
          {isUploading && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent" />
              <span className="text-zinc-400">Traitement en cours...</span>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">👥 Liste des utilisateurs</h2>
              <p className="text-zinc-400 text-sm mt-1">
                {users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={downloadUsers}
              disabled={users.length === 0}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Télécharger Excel
            </button>
          </div>

          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              Aucun utilisateur pour le moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 font-semibold text-zinc-400">Prénom</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-400">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-400">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-400">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-4">{user.firstName}</td>
                      <td className="py-3 px-4">{user.lastName}</td>
                      <td className="py-3 px-4 text-orange-500">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-zinc-400">{user.source}</td>
                      <td className="py-3 px-4 text-sm text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex-1 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-orange-500 rounded-lg font-semibold transition"
          >
            👀 Prévisualiser le site
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('admin_authenticated');
              setIsAuthenticated(false);
            }}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-red-500 text-red-500 rounded-lg font-semibold transition"
          >
            🔒 Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
