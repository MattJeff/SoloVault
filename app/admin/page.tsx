'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Lock, Check, AlertCircle, Download, History, Users, TrendingUp, Award, MessageSquare, UserPlus, Activity, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  source: string;
  page: string;
  createdAt: string;
}

interface AdminStats {
  users: {
    total: number;
    byDay: { date: string; count: number }[];
    recent: any[];
  };
  progress: {
    totalPoints: number;
    avgPoints: number;
    topUsers: any[];
    badgeDistribution: { name: string; count: number }[];
  };
  quiz: {
    total: number;
    resultDistribution: { type: string; count: number }[];
    recent: any[];
  };
  referrals: {
    total: number;
    callsEarned: number;
    topReferrers: any[];
  };
  actions: {
    emailSubmitted: number;
    quizCompleted: number;
    dataDownloaded: number;
    totalProjectsViewed: number;
  };
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
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'quiz' | 'referrals' | 'upload'>('overview');

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

  // Load stats from Supabase
  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (!data.error) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoadingStats(false);
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

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      loadStats();
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

  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">📊 Admin Dashboard</h1>
            <p className="text-zinc-400">Gérez et analysez SoloVault</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('admin_authenticated');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-red-500 text-red-500 rounded-lg font-semibold transition"
          >
            🔒 Déconnexion
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: BarChart3 },
            { id: 'users', label: '👥 Utilisateurs', icon: Users },
            { id: 'quiz', label: '🎯 Quiz', icon: MessageSquare },
            { id: 'referrals', label: '🎁 Parrainages', icon: UserPlus },
            { id: 'upload', label: '📤 Upload', icon: Upload }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-900 border border-zinc-800 hover:border-orange-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoadingStats && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent" />
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div className="text-zinc-400 text-sm">Utilisateurs</div>
                </div>
                <div className="text-3xl font-bold">{stats.users.total}</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <div className="text-zinc-400 text-sm">Quiz complétés</div>
                </div>
                <div className="text-3xl font-bold">{stats.quiz.total}</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <UserPlus className="w-5 h-5 text-orange-500" />
                  <div className="text-zinc-400 text-sm">Parrainages</div>
                </div>
                <div className="text-3xl font-bold">{stats.referrals.total}</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <div className="text-zinc-400 text-sm">Points totaux</div>
                </div>
                <div className="text-3xl font-bold">{stats.progress.totalPoints}</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Users Growth Chart */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">📈 Croissance utilisateurs (7 jours)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.users.byDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#71717a" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      labelStyle={{ color: '#a1a1aa' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Quiz Results Distribution */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">🎯 Distribution des profils quiz</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={stats.quiz.resultDistribution}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stats.quiz.resultDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actions Stats */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">⚡ Actions utilisateurs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-400 text-sm mb-1">Emails soumis</div>
                  <div className="text-2xl font-bold text-orange-500">{stats.actions.emailSubmitted}</div>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-400 text-sm mb-1">Quiz complétés</div>
                  <div className="text-2xl font-bold text-orange-500">{stats.actions.quizCompleted}</div>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-400 text-sm mb-1">Téléchargements</div>
                  <div className="text-2xl font-bold text-orange-500">{stats.actions.dataDownloaded}</div>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-400 text-sm mb-1">Projets vus</div>
                  <div className="text-2xl font-bold text-orange-500">{stats.actions.totalProjectsViewed}</div>
                </div>
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">🏆 Top 10 utilisateurs</h3>
              <div className="space-y-2">
                {stats.progress.topUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between bg-black border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</div>
                      <div>
                        <div className="font-semibold">{user.email}</div>
                        <div className="text-sm text-zinc-400">Level {user.level} • {user.badges} badges</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-orange-500">{user.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
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
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
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
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && stats && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">🎯 Statistiques Quiz</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Distribution des profils</h3>
                  <div className="space-y-2">
                    {stats.quiz.resultDistribution.map((result, index) => (
                      <div key={index} className="flex items-center justify-between bg-black border border-zinc-800 rounded-lg p-3">
                        <span className="text-zinc-300">{result.type}</span>
                        <span className="font-bold text-orange-500">{result.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Réponses récentes</h3>
                  <div className="space-y-2">
                    {stats.quiz.recent.map((quiz, index) => (
                      <div key={index} className="bg-black border border-zinc-800 rounded-lg p-3">
                        <div className="text-sm text-orange-500">{quiz.email}</div>
                        <div className="text-xs text-zinc-400">{quiz.resultType}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REFERRALS TAB */}
        {activeTab === 'referrals' && stats && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-zinc-400 text-sm mb-2">Total parrainages</div>
                <div className="text-3xl font-bold">{stats.referrals.total}</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-zinc-400 text-sm mb-2">Appels gagnés</div>
                <div className="text-3xl font-bold text-green-500">{stats.referrals.callsEarned}</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-zinc-400 text-sm mb-2">Taux de conversion</div>
                <div className="text-3xl font-bold">
                  {stats.referrals.total > 0 ? Math.round((stats.referrals.callsEarned / stats.referrals.total) * 100) : 0}%
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">🏆 Top Referrers</h2>
              <div className="space-y-2">
                {stats.referrals.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between bg-black border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</div>
                      <div>
                        <div className="font-semibold">{referrer.email}</div>
                        <div className="text-sm text-zinc-400">
                          {referrer.referrals} parrainage{referrer.referrals > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    {referrer.callEarned && (
                      <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full text-sm font-semibold">
                        ✓ Appel gagné
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
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
        )}
      </div>
    </div>
  );
}
