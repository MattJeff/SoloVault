'use client';

import { Project } from '@/lib/types';
import { formatRevenue } from '@/lib/filters';
import { X, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const isSolo = project.stillSolo.toLowerCase().includes('yes');

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleDownload = async () => {
    // Redirection vers Stripe Checkout
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: localStorage.getItem('solovault_email')
      })
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  const handleQuoteRequest = () => {
    // Rediriger vers la page de devis avec le projet sélectionné
    window.location.href = `/quote?project=${project.id}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-zinc-800 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black border border-zinc-700 rounded-lg flex items-center justify-center hover:border-orange-500 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-zinc-500 text-sm mb-3 flex items-center gap-2">
            <button onClick={onClose} className="hover:text-white transition">
              ← Retour aux projets
            </button>
          </div>

          <h2 className="text-4xl font-bold mb-3">{project.name}</h2>

          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="text-orange-500 font-semibold">📅 2025</span>
            <span className="text-zinc-400">{project.productType}</span>
          </div>

          <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
            {project.solution}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-500 font-bold text-xl">
            💰 ${formatRevenue(project.revenue)}/année
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Quick Stats */}
          {(project.traffic || project.productType || project.businessModel || project.freePlan) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {project.traffic && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-500 text-sm mb-1">Traffic mensuel</div>
                  <div className="text-xl font-bold">{project.traffic}</div>
                </div>
              )}
              {project.productType && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-500 text-sm mb-1">Type de produit</div>
                  <div className="text-xl font-bold">{project.productType}</div>
                </div>
              )}
              {project.businessModel && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-500 text-sm mb-1">Business Model</div>
                  <div className="text-xl font-bold">{project.businessModel}</div>
                </div>
              )}
              {project.freePlan && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="text-zinc-500 text-sm mb-1">Free Plan</div>
                  <div className="text-xl font-bold">{project.freePlan}</div>
                </div>
              )}
            </div>
          )}

          {/* Technologies */}
          {(project.industry || project.platform || project.growth1 || project.growth2) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-orange-500">&lt;/&gt;</span>
                Technologies & Growth
              </h3>
              <div className="flex flex-wrap gap-2">
                {[project.industry, project.platform, project.productType, project.growth1, project.growth2, project.businessModel]
                  .filter(Boolean)
                  .map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-black border border-zinc-700 rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-500">⚡</span>
              Fonctionnalités Principales
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {project.ideation && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-orange-500">●</span>
                    Idéation
                  </div>
                  <p className="text-sm text-zinc-400">{project.ideation}</p>
                </div>
              )}
              {project.mvp && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-orange-500">●</span>
                    Temps de développement MVP
                  </div>
                  <p className="text-sm text-zinc-400">{project.mvp}</p>
                </div>
              )}
              {(project.growth1 || project.growth2) && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-orange-500">●</span>
                    Stratégies de croissance
                  </div>
                  <p className="text-sm text-zinc-400">
                    {[project.growth1, project.growth2].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
              {project.stillSolo && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-orange-500">●</span>
                    Status actuel
                  </div>
                  <p className="text-sm text-zinc-400">
                    {isSolo ? '👤 Still solo' : '👥 Équipe constituée'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Problem / Solution */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black border border-zinc-800 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-3 text-orange-500">
                🎯 Défi Rencontré
              </h4>
              <p className="text-zinc-300 leading-relaxed">{project.problem}</p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-3 text-green-500">
                ✨ Solution Apportée
              </h4>
              <p className="text-zinc-300 leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Pricing */}
          {project.pricingDetails && (
            <div className="bg-black border border-zinc-800 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-bold mb-3">💰 Pricing</h4>
              <p className="text-zinc-300">{project.pricingDetails}</p>
              {project.priceRange && (
                <p className="text-sm text-zinc-500 mt-2">Range: {project.priceRange}</p>
              )}
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-black border border-zinc-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">
              Intéressé par un projet similaire ?
            </h3>
            <p className="text-zinc-400 mb-6">
              Je serais ravi de discuter de votre projet et de voir comment je peux vous aider
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={handleQuoteRequest}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              >
                📨 Demander un devis
              </button>
              
              {project.caseStudy && (
                <a
                  href={project.caseStudy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border border-zinc-700 hover:border-orange-500 text-white font-semibold rounded-lg transition inline-flex items-center justify-center gap-2"
                >
                  📚 Lire le case study
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Download Banner */}
            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left">
                  <h4 className="font-bold mb-1">📥 Télécharger la base complète</h4>
                  <p className="text-sm text-zinc-400">
                    Accédez aux 50 projets détaillés + mises à jour mensuelles
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition whitespace-nowrap"
                >
                  19€ seulement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
