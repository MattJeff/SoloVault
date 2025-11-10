'use client';

import { useState } from 'react';
import { FileText, Download, CheckSquare, Presentation, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ContentUpgradesProps {
  onClose: () => void;
}

export default function ContentUpgrades({ onClose }: ContentUpgradesProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<'checklist' | 'pitch' | null>(null);
  const [email, setEmail] = useState('');

  const downloadChecklist = () => {
    const checklistData = [
      { '✓': '', 'Étape': 'Validation de l\'idée', 'Détails': 'Vérifier qu\'il y a un marché', 'Outils': 'Google Trends, Reddit, Twitter' },
      { '✓': '', 'Étape': 'Définir le MVP', 'Détails': 'Liste des fonctionnalités essentielles', 'Outils': 'Notion, Figma' },
      { '✓': '', 'Étape': 'Choisir la stack', 'Détails': 'Next.js, Supabase, Stripe', 'Outils': 'GitHub, Vercel' },
      { '✓': '', 'Étape': 'Design UI/UX', 'Détails': 'Wireframes + maquettes', 'Outils': 'Figma, Tailwind CSS' },
      { '✓': '', 'Étape': 'Développement', 'Détails': '2-3 semaines de code', 'Outils': 'VS Code, Cursor, Claude' },
      { '✓': '', 'Étape': 'Tests utilisateurs', 'Détails': '5-10 beta testers', 'Outils': 'Loom, Hotjar' },
      { '✓': '', 'Étape': 'Landing page', 'Détails': 'Copywriting + CTA', 'Outils': 'Vercel, Framer' },
      { '✓': '', 'Étape': 'Paiement', 'Détails': 'Intégration Stripe', 'Outils': 'Stripe, Lemon Squeezy' },
      { '✓': '', 'Étape': 'Lancement', 'Détails': 'Product Hunt, Twitter, Reddit', 'Outils': 'Buffer, Typefully' },
      { '✓': '', 'Étape': 'Premiers clients', 'Détails': 'Outreach + support', 'Outils': 'Crisp, Intercom' },
      { '✓': '', 'Étape': 'Itération', 'Détails': 'Feedback + amélioration', 'Outils': 'Linear, GitHub Issues' },
      { '✓': '', 'Étape': 'Croissance', 'Détails': 'SEO, Content, Ads', 'Outils': 'Ahrefs, Google Ads' }
    ];

    const ws = XLSX.utils.json_to_sheet(checklistData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Checklist MVP');

    // Set column widths
    ws['!cols'] = [
      { wch: 3 },
      { wch: 25 },
      { wch: 40 },
      { wch: 30 }
    ];

    XLSX.writeFile(wb, 'SoloVault-Checklist-MVP-30-jours.xlsx');

    // Track download
    trackAction('DOWNLOAD_CHECKLIST');
  };

  const downloadPitchTemplate = () => {
    const pitchData = [
      { 'Slide': '1. Cover', 'Contenu': 'Nom du projet + Tagline + Contact' },
      { 'Slide': '2. Problem', 'Contenu': 'Quel problème résous-tu ? (3 points max)' },
      { 'Slide': '3. Solution', 'Contenu': 'Comment ton SaaS résout ce problème' },
      { 'Slide': '4. Demo', 'Contenu': 'Screenshots ou vidéo du produit' },
      { 'Slide': '5. Market Size', 'Contenu': 'TAM / SAM / SOM (taille du marché)' },
      { 'Slide': '6. Business Model', 'Contenu': 'Comment tu gagnes de l\'argent' },
      { 'Slide': '7. Traction', 'Contenu': 'Users, MRR, croissance' },
      { 'Slide': '8. Competition', 'Contenu': 'Qui sont tes concurrents ? Ton avantage ?' },
      { 'Slide': '9. Team', 'Contenu': 'Toi (+ co-founders si applicable)' },
      { 'Slide': '10. Roadmap', 'Contenu': 'Prochaines features et milestones' },
      { 'Slide': '11. Financials', 'Contenu': 'Projections 12-24 mois' },
      { 'Slide': '12. Ask', 'Contenu': 'Ce que tu cherches (feedback, investissement, etc.)' }
    ];

    const ws = XLSX.utils.json_to_sheet(pitchData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pitch Deck Template');

    ws['!cols'] = [
      { wch: 20 },
      { wch: 60 }
    ];

    XLSX.writeFile(wb, 'SoloVault-Pitch-Deck-Template.xlsx');

    // Track download
    trackAction('DOWNLOAD_TEMPLATE');
  };

  const trackAction = async (action: string) => {
    const userEmail = localStorage.getItem('solovault_email');
    if (userEmail) {
      await fetch('/api/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          action,
          metadata: { type: selectedUpgrade }
        })
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">📚 Content Upgrades</h2>
            <p className="text-zinc-400">Ressources gratuites pour t'aider à réussir</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Checklist MVP */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-2 border-green-500/30 rounded-xl p-6 hover:border-green-500 transition cursor-pointer"
            onClick={() => setSelectedUpgrade('checklist')}>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <CheckSquare className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Checklist MVP</h3>
            <p className="text-zinc-400 text-sm mb-4">
              12 étapes détaillées pour lancer ton MVP en 30 jours
            </p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>✅ De l'idée au lancement</li>
              <li>✅ Stack technique recommandée</li>
              <li>✅ Outils gratuits inclus</li>
            </ul>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadChecklist();
              }}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>

          {/* Pitch Deck Template */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition cursor-pointer"
            onClick={() => setSelectedUpgrade('pitch')}>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Presentation className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Pitch Deck Template</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Template de présentation pour investors ou partners
            </p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>✅ 12 slides essentiels</li>
              <li>✅ Structure éprouvée</li>
              <li>✅ Conseils inclus</li>
            </ul>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadPitchTemplate();
              }}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>
        </div>

        <div className="bg-black border border-zinc-800 rounded-xl p-6 text-center">
          <FileText className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <p className="text-zinc-300 mb-4">
            Ces ressources sont <strong className="text-orange-500">100% gratuites</strong> pour tous les utilisateurs de SoloVault
          </p>
          <p className="text-sm text-zinc-500">
            Gagne +15 points en téléchargeant ces templates ! 🎯
          </p>
        </div>
      </div>
    </div>
  );
}
