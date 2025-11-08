'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Send, ArrowLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';
import projectsData from '@/data/projects.json';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    projectDescription: '',
    features: '',
    selectedProject: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Récupérer le projet sélectionné depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId) {
      const project = projectsData.find(p => p.id === parseInt(projectId));
      if (project) {
        setFormData(prev => ({ ...prev, selectedProject: project.name }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          budget: formData.budget,
          project_description: formData.projectDescription,
          features: formData.features,
          selected_project: formData.selectedProject || 'Aucun projet sélectionné',
          to_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        budget: '',
        projectDescription: '',
        features: '',
        selectedProject: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Back Button */}
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium">Demande de devis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Demandez un devis pour votre projet
            </h1>
            <p className="text-xl text-zinc-400">
              Décrivez votre projet et recevez une estimation personnalisée
            </p>
          </div>

          {/* Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Votre nom complet <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Votre email <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@example.com"
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>

              {/* Projet inspirant */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Projet inspirant (optionnel)
                </label>
                <select
                  value={formData.selectedProject}
                  onChange={(e) => setFormData({ ...formData, selectedProject: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                >
                  <option value="">Sélectionnez un projet similaire</option>
                  {projectsData
                    .filter(p => p.name)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((project) => (
                      <option key={project.id} value={project.name}>
                        {project.name} - {project.industry}
                      </option>
                    ))}
                </select>
                <p className="text-sm text-zinc-500 mt-2">
                  Sélectionnez un projet de la base de données qui ressemble à votre idée
                </p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget estimé
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
                >
                  <option value="">Sélectionnez une fourchette</option>
                  <option value="< 5K€">Moins de 5 000€</option>
                  <option value="5K€ - 10K€">5 000€ - 10 000€</option>
                  <option value="10K€ - 20K€">10 000€ - 20 000€</option>
                  <option value="20K€ - 50K€">20 000€ - 50 000€</option>
                  <option value="> 50K€">Plus de 50 000€</option>
                </select>
              </div>

              {/* Description du projet */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description de votre projet <span className="text-orange-500">*</span>
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Décrivez votre projet, vos objectifs et vos besoins..."
                  rows={5}
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition resize-none"
                  required
                />
              </div>

              {/* Fonctionnalités souhaitées */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fonctionnalités souhaitées
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Listez les fonctionnalités principales que vous souhaitez..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-500">
                  ✅ Demande envoyée avec succès ! Nous vous répondrons sous 24h.
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
                  ❌ Erreur lors de l'envoi. Veuillez réessayer.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isLoading ? 'Envoi en cours...' : 'Recevoir mon devis'}
              </button>

              <p className="text-sm text-zinc-500 text-center">
                Nous vous répondrons sous 24h avec une estimation détaillée
              </p>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-br from-orange-900/20 to-orange-950/20 border border-orange-500/30 rounded-xl p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Ce qui se passe ensuite
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>✓ Réponse sous 24h avec une première estimation</li>
              <li>✓ Appel de découverte gratuit de 30 minutes</li>
              <li>✓ Devis détaillé avec roadmap et délais</li>
              <li>✓ Aucun engagement jusqu'à signature du contrat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
