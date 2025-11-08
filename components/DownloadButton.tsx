'use client';

import { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { Project } from '@/lib/types';
import * as XLSX from 'xlsx';

interface DownloadButtonProps {
  filteredProjects: Project[];
  totalProjects: number;
}

export default function DownloadButton({ filteredProjects, totalProjects }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const projectCount = filteredProjects.length;
  const isFree = projectCount < 10;

  const handleDownload = async () => {
    if (!isFree) {
      // Rediriger vers Stripe Checkout
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

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la redirection vers le paiement');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Téléchargement gratuit
      downloadExcel(filteredProjects);
    }
  };

  const downloadExcel = (projects: Project[]) => {
    // Préparer les données pour Excel
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

    // Créer le workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projets SoloVault');

    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 20 }, // Nom
      { wch: 15 }, // Industrie
      { wch: 30 }, // Problème
      { wch: 30 }, // Solution
      { wch: 15 }, // Revenue
      { wch: 20 }, // Développeur
      { wch: 25 }, // Idéation
      { wch: 12 }, // MVP
      { wch: 12 }, // Solo
      { wch: 20 }, // Croissance 1
      { wch: 20 }, // Croissance 2
      { wch: 15 }, // Plateforme
      { wch: 15 }, // Type produit
      { wch: 20 }, // Cible
      { wch: 15 }, // Prix
      { wch: 20 }, // Business Model
      { wch: 12 }, // Plan gratuit
      { wch: 25 }, // Détails pricing
      { wch: 15 }, // Traffic
      { wch: 15 }, // Revenue/Traffic
      { wch: 30 }  // Case Study
    ];
    ws['!cols'] = colWidths;

    // Télécharger le fichier
    const fileName = `solovault-${projectCount}-projets-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="sticky bottom-0 z-40 bg-gradient-to-t from-black via-black to-transparent pt-8 pb-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl font-bold text-orange-500">
                {projectCount}
              </div>
              <div>
                <div className="font-semibold">
                  {projectCount === 1 ? 'projet sélectionné' : 'projets sélectionnés'}
                </div>
                <div className="text-sm text-zinc-400">
                  sur {totalProjects} projets au total
                </div>
              </div>
            </div>
            
            {isFree ? (
              <div className="text-sm text-green-500 flex items-center gap-2">
                ✅ Téléchargement gratuit (moins de 10 projets)
              </div>
            ) : (
              <div className="text-sm text-orange-500 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Base complète - 19€ (10+ projets)
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isLoading || projectCount === 0}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-3 ${
              isFree
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Download className="w-6 h-6" />
            {isLoading ? 'Chargement...' : isFree ? 'Télécharger gratuitement' : 'Acheter et télécharger (19€)'}
          </button>
        </div>
      </div>
    </div>
  );
}
