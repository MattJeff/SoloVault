'use client';

import { useState, useEffect } from 'react';
import { X, Download, Lock, Filter } from 'lucide-react';
import { Project } from '@/lib/types';
import { filterProjects } from '@/lib/filters';
import * as XLSX from 'xlsx';

interface DownloadModalProps {
  allProjects: Project[];
  onClose: () => void;
}

export default function DownloadModal({ allProjects, onClose }: DownloadModalProps) {
  const [filters, setFilters] = useState({
    revenue: 'all',
    mvp: null as string | null,
    solo: false,
    search: '',
    industry: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filtrer les projets en temps réel
  const filteredProjects = filterProjects(allProjects, filters);
  const projectCount = filteredProjects.length;
  const isFree = projectCount < 10;

  // Empêcher le scroll du body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Fermer avec ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleFilter = (key: 'mvp', value: string) => {
    const newValue = filters[key] === value ? null : value;
    updateFilter(key, newValue);
  };

  const handleDownload = async () => {
    if (!isFree) {
      // Rediriger vers Stripe
      setIsLoading(true);
      try {
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: localStorage.getItem('solovault_email'),
            projectCount: projectCount
          })
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
        }

        window.location.href = data.url;
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Erreur lors de la redirection vers le paiement');
        setIsLoading(false);
      }
    } else {
      // Téléchargement gratuit
      downloadExcel(filteredProjects);
      onClose();
    }
  };

  const downloadAll = () => {
    downloadExcel(allProjects);
    onClose();
  };

  const downloadExcel = (projects: Project[]) => {
    const excelData = projects.map(project => ({
      'Nom': project.name,
      'Industrie': project.industry,
      'Problème': project.problem,
      'Solution': project.solution,
      'Revenue': project.revenue,
      'Développeur': project.developer,
      'Idéation': project.ideation,
      'Temps MVP': project.mvp,
      'Encore solo?': project.stillSolo,
      'Croissance 1': project.growth1,
      'Croissance 2': project.growth2,
      'Plateforme': project.platform,
      'Type de produit': project.productType,
      'Cible': project.target,
      'Prix': project.priceRange,
      'Business Model': project.businessModel,
      'Plan gratuit': project.freePlan,
      'Détails pricing': project.pricingDetails,
      'Traffic': project.traffic,
      'Revenue/Traffic': project.revenuePerTraffic,
      'Case Study': project.caseStudy
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projets SoloVault');

    const colWidths = [
      { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 15 },
      { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
      { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 }
    ];
    ws['!cols'] = colWidths;

    const fileName = `solovault-${projects.length}-projets-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Récupérer les industries uniques
  const industries = ['all', ...Array.from(new Set(allProjects.map(p => p.industry).filter(Boolean)))];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Download className="w-7 h-7 text-orange-500" />
              Télécharger la base de données
            </h2>
            <p className="text-zinc-400 mt-1">Filtrez les projets ou téléchargez tout</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black border border-zinc-700 rounded-lg flex items-center justify-center hover:border-orange-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={downloadAll}
              className="p-6 bg-black border-2 border-orange-500 rounded-xl hover:bg-orange-500/10 transition text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">📦</div>
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tout télécharger</h3>
              <p className="text-zinc-400 text-sm mb-3">
                {allProjects.length} projets complets
              </p>
              <div className="text-orange-500 font-semibold">
                19,00 € • Paiement unique
              </div>
            </button>

            <div className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-xl">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Filtrer et télécharger</h3>
              <p className="text-zinc-400 text-sm mb-3">
                Sélectionnez uniquement ce dont vous avez besoin
              </p>
              <div className="text-green-500 font-semibold">
                Gratuit si &lt; 10 projets
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-black border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold">Filtres</h3>
            </div>

            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Recherche</label>
                <input
                  type="text"
                  placeholder="Nom, industrie, problème..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium mb-2">Industrie</label>
                <select
                  value={filters.industry}
                  onChange={(e) => updateFilter('industry', e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                >
                  <option value="all">Toutes les industries</option>
                  {industries.filter(i => i !== 'all').map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Revenue */}
              <div>
                <label className="block text-sm font-medium mb-2">Revenue annuel</label>
                <div className="flex flex-wrap gap-2">
                  {['all', '1M+', '500K-1M', '100K-500K'].map((rev) => (
                    <button
                      key={rev}
                      onClick={() => updateFilter('revenue', rev)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        filters.revenue === rev
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-orange-500'
                      }`}
                    >
                      {rev === 'all' ? 'Tous' : rev}
                    </button>
                  ))}
                </div>
              </div>

              {/* MVP Speed */}
              <div>
                <label className="block text-sm font-medium mb-2">Vitesse MVP</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleFilter('mvp', 'weekend')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filters.mvp === 'weekend'
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-orange-500'
                    }`}
                  >
                    ⚡ Weekend
                  </button>
                  <button
                    onClick={() => toggleFilter('mvp', 'week')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filters.mvp === 'week'
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-orange-500'
                    }`}
                  >
                    🏃 Semaine
                  </button>
                </div>
              </div>

              {/* Solo */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.solo}
                    onChange={(e) => updateFilter('solo', e.target.checked)}
                    className="w-5 h-5 rounded bg-zinc-900 border-zinc-700 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="font-medium">👤 Uniquement les solopreneurs</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-orange-500 mb-1">
                  {projectCount}
                </div>
                <div className="text-zinc-300">
                  {projectCount === 1 ? 'projet sélectionné' : 'projets sélectionnés'}
                </div>
              </div>
              
              <div className="text-right">
                {isFree ? (
                  <div>
                    <div className="text-2xl font-bold text-green-500">GRATUIT</div>
                    <div className="text-sm text-zinc-400">Moins de 10 projets</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-orange-500">19,00 €</div>
                    <div className="text-sm text-zinc-400">10+ projets</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-zinc-700 hover:border-zinc-600 rounded-lg font-semibold transition"
          >
            Annuler
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading || projectCount === 0}
            className={`flex-1 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              isFree
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              'Chargement...'
            ) : isFree ? (
              <>
                <Download className="w-5 h-5" />
                Télécharger gratuitement
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Acheter et télécharger (19€)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
